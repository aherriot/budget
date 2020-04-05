import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "utils/request";

const fetchAccounts = createAsyncThunk("accounts/fetchAccounts", async () => {
  const response = await request("/api/accounts");

  return response.data.reduce((byId, account) => {
    byId[account.id] = account;
    return byId;
  }, {});
});

const accounts = createSlice({
  name: "accounts",
  initialState: {
    byId: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: {
    [fetchAccounts.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAccounts.fulfilled]: (state, action) => {
      state.byId = action.payload;
      state.loading = false;
      state.error = false;
    },
    [fetchAccounts.rejected]: (state, action) => {
      state.error = action.error;
    }
  }
});

export default accounts;
export { fetchAccounts };
