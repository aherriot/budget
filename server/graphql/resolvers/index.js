const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const crypto = require("../../utils/crypto");
const db = require("../../db/index");
const config = require("../../config.json");

const convertDbRowToMeasurement = (row) => {
  if (!row) {
    return row;
  }

  return {
    id: row.id,
    weight: row.weight,
    date: row.created_at,
  };
};

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    user: (_, args, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }
      return {
        id: user.id,
        username: user.username,
      };
    },
    measurements: async (_, args, { user }) => {
      let result;
      try {
        result = await db.query(
          `select id, weight, created_at from measurements where user_id = $1;`,
          [user.id]
        );
      } catch (e) {
        throw e;
      }
      return result.rows.map((row) => ({
        id: row.id,
        weight: row.weight,
        date: row.created_at,
      }));
    },
  },
  Mutation: {
    addMeasurement: async (_, { measurement }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }
      let result;
      try {
        if (measurement.date) {
          result = await db.query(
            `insert into measurements (user_id, weight, created_at) values ($1, $2, $3) returning *;`,
            [user.id, measurement.weight, measurement.date]
          );
        } else {
          result = await db.query(
            `insert into measurements (user_id, weight) values ($1, $2) returning *;`,
            [user.id, measurement.weight]
          );
        }
      } catch (e) {
        throw e;
      }

      return convertDbRowToMeasurement(result.rows[0]);
    },
    updatePreferences: async (_, { preferences }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      let result;
      try {
        result = await db.query(
          `
          insert into user_preferences(user_id, weight_unit)
          values ($1, $2)
          on conflict(user_id)
          do update set weight_unit = $2;
        `,
          [user.id, preferences.weightUnit]
        );
      } catch (e) {
        throw e;
      }

      return {
        weightUnit: preferences.weightUnit,
      };
    },
    login: async (_, { username, password }) => {
      if (!username || !password) {
        throw new AuthenticationError("Invalid Login attempt 1");
      }

      let result;
      try {
        result = await db.query(
          `select id, username, password from users where username = $1 limit 1;`,
          [username]
        );
      } catch (e) {
        throw new AuthenticationError("Invalid Login attempt 2");
      }

      if (result.rows.length !== 1) {
        throw new AuthenticationError("Invalid Login attempt 3");
      }

      const user = result.rows[0];

      let isVerified;
      try {
        isVerified = await crypto.verify(password, user.password);
      } catch (e) {
        throw new AuthenticationError("Invalid Login attempt 4");
      }

      if (!isVerified) {
        throw new AuthenticationError("Invalid Login attempt 5");
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiry,
        }
      );

      return { jwt: token };
    },
    createAccount: async (_, { payload: { username, password } }) => {
      if (!username || !password) {
        throw new AuthenticationError("Invalid create attempt 1");
      }

      let result;
      try {
        result = await db.query(
          `select id, username, password from users where username = $1 limit 1;`,
          [username]
        );
      } catch (e) {
        throw new AuthenticationError("Invalid Login attempt 2");
      }

      // user already exists
      if (result.rows.length === 1) {
        throw new AuthenticationError("Invalid Login attempt 3");
      }

      let key;
      try {
        key = await crypto.kdf(password);
      } catch (e) {
        throw new AuthenticationError("Invalid Login attempt 4");
      }

      try {
        result = await db.query(
          `insert into users (username, password) values ($1, $2) returning *;`,
          [username.toLowerCase(), key]
        );
      } catch (e) {
        throw new AuthenticationError("Invalid Login attempt 5");
      }

      const token = jwt.sign(
        { id: result.id, username: result.username },
        config.jwtSecret,
        {
          expiresIn: config.jwtExpiry,
        }
      );

      return { jwt: token };
    },
  },
  User: {
    currentMeasurement: async (parent, args) => {
      let result;
      try {
        result = await db.query(`
          select id, weight, created_at 
          from measurements 
          order by created_at desc 
          limit 1;`);
      } catch (e) {
        throw e;
      }

      return convertDbRowToMeasurement(result.rows[0]);
    },
    measurements: async (parent, { measurementsInput }) => {
      let result;
      try {
        result = await db.query(
          `select id, weight, created_at from measurements where user_id = $1;`,
          [parent.id]
        );
      } catch (e) {
        throw e;
      }
      return result.rows.map(convertDbRowToMeasurement);
    },
    preferences: async (parent) => {
      let result;
      try {
        result = await db.query(
          `select weight_unit from user_preferences where user_id = $1;`,
          [parent.id]
        );
      } catch (e) {
        throw e;
      }

      let weightUnit;
      if (result.rows.length === 1) {
        weightUnit = result.rows[0].weight_unit;
      } else {
        weightUnit = "POUND";
      }
      return {
        weightUnit: weightUnit,
      };
    },
  },
};
