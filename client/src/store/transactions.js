import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "utils/request";
import { fetchAccounts } from "./accounts";

const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (accountId, thunkAPI) => {
    const response = await request("/api/transactions/search", "POST", {
      accountId,
    });
    return response.data;
  }
);

const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, thunkAPI) => {
    const response = await request("/api/transactions/", "POST", {
      transaction,
    });
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

const addTransactionsBulk = createAsyncThunk(
  "transactions/addTransactionsBulk",
  async (data, thunkAPI) => {
    const response = await request("/api/transactions/bulk", "POST", {
      data,
    });
    return response.data;
  }
);

const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction, thunkAPI) => {
    const response = await request(
      `/api/transactions/${transaction.id}`,
      "PUT",
      {
        transaction,
      }
    );
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, thunkAPI) => {
    const response = await request(
      `/api/transactions/${transactionId}`,
      "DELETE"
    );
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

const transactions = createSlice({
  name: "transactions",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchTransactions.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchTransactions.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchTransactions.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export default transactions;
export {
  fetchTransactions,
  addTransaction,
  addTransactionsBulk,
  updateTransaction,
  deleteTransaction,
};
