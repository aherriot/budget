const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  enum WeightUnits {
    POUND
    KILOGRAM
    STONE
  }

  type User {
    id: ID!
    username: String!
    currentMeasurement: Measurement
    measurements(measurementsInput: MeasurementsInput): [Measurement]!
    preferences: Preferences!
  }

  type Measurement {
    id: ID!
    weight: Float!
    date: Date!
  }

  type Preferences {
    weightUnit: WeightUnits!
  }

  input MeasurementsInput {
    moreRecentlyThan: Date
  }

  input MeasurementPayload {
    weight: Float!
    date: Date
  }

  input PreferencesPayload {
    weightUnit: WeightUnits
  }

  type LoginResponse {
    jwt: String!
  }

  input CreateAccountPayload {
    username: String!
    password: String!
  }

  type CreateAccountResponse {
    jwt: String!
  }

  type Query {
    user: User
    measurements(measurementsInput: MeasurementsInput): [Measurement]!
  }

  type Mutation {
    addMeasurement(measurement: MeasurementPayload): Measurement
    updatePreferences(preferences: PreferencesPayload): Preferences
    login(username: String!, password: String!): LoginResponse!
    createAccount(payload: CreateAccountPayload): CreateAccountResponse!
  }
`;
