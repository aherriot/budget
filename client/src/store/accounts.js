import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "utils/request";

const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (args, thunkAPI) => {
    let fromDate, toDate;
    if (args) {
      fromDate = args.fromDate;
      toDate = args.toDate;
    } else {
      fromDate = thunkAPI.getState().data.accounts.parameters.fromDate;
      toDate = thunkAPI.getState().data.accounts.parameters.toDate;
    }
    const response = await request("/api/accounts/tree", "POST", {
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
    });

    return response.data.reduce((byId, account) => {
      byId[account.id] = account;
      return byId;
    }, {});
  }
);

const updateAccount = createAsyncThunk(
  "transactions/updateAccount",
  async ({ account, parentId }, thunkAPI) => {
    const response = await request(`/api/accounts/${account.id}`, "PATCH", {
      parentId,
    });
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

const accounts = createSlice({
  name: "accounts",
  initialState: {
    byId: {},
    parameters: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchAccounts.pending]: (state, action) => {
      if (action.meta.arg) {
        state.parameters = action.meta.arg;
      }
      state.loading = true;
    },
    [fetchAccounts.fulfilled]: (state, action) => {
      state.byId = action.payload;
      state.loading = false;
      state.error = false;
    },
    [fetchAccounts.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export default accounts;
export { fetchAccounts, updateAccount };
