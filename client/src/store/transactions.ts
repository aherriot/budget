import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "store";
import request from "utils/request";
import { actions as accountsActions } from "./accounts";

interface FetchTransactionsArgs {
  accountId: string;
  fromDate: string;
  toDate: string;
}
type FetchTransactionsPayload = Transaction[];

const fetchTransactions = createAsyncThunk<
  FetchTransactionsPayload,
  FetchTransactionsArgs,
  { state: RootState }
>("transactions/fetchTransactions", async (args, thunkAPI) => {
  let fromDate, toDate, accountId;
  if (args) {
    accountId = args.accountId;
    fromDate = args.fromDate;
    toDate = args.toDate;
  } else {
    accountId = thunkAPI.getState().data.transactions.parameters?.accountId;
    fromDate = thunkAPI.getState().data.transactions.parameters?.fromDate ?? "";
    toDate = thunkAPI.getState().data.transactions.parameters?.toDate ?? "";
  }
  const response = await request("/api/transactions/search", "POST", {
    accountId,
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
  });
  return response.data;
});

export interface AddTransactionArgs {
  inDate: string;
  inAccount: string;
  outDate: string;
  outAccount: string;
  description: string;
  amount: number;
}

const addTransaction = createAsyncThunk<
  Transaction,
  AddTransactionArgs,
  { state: RootState }
>("transactions/addTransaction", async (transaction, thunkAPI) => {
  const response = await request("/api/transactions/", "POST", {
    transaction,
  });
  thunkAPI.dispatch(accountsActions.fetchAccounts());
  return response.data;
});

const addTransactionsBulk = createAsyncThunk<
  Transaction[],
  AddTransactionArgs[],
  { state: RootState }
>("transactions/addTransactionsBulk", async (data, thunkAPI) => {
  const response = await request("/api/transactions/bulk", "POST", {
    data,
  });
  return response.data;
});

const updateTransaction = createAsyncThunk<
  Transaction,
  Transaction,
  { state: RootState }
>("transactions/updateTransaction", async (transaction, thunkAPI) => {
  const response = await request(`/api/transactions/${transaction.id}`, "PUT", {
    transaction,
  });
  thunkAPI.dispatch(accountsActions.fetchAccounts());
  return response.data;
});

const deleteTransaction = createAsyncThunk<
  string,
  Transaction,
  { state: RootState }
>("transactions/deleteTransaction", async (transactionId, thunkAPI) => {
  const response = await request(
    `/api/transactions/${transactionId}`,
    "DELETE"
  );
  thunkAPI.dispatch(accountsActions.fetchAccounts());
  return response.data;
});

export interface Transaction {
  id: string;
  inDate: string;
  inAccount: string;
  outDate: string;
  outAccount: string;
  description: string;
  amount: number;
  inAmount: number;
  outAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface TransactionsState {
  data: Transaction[];
  parameters: FetchTransactionsArgs | null;
  loading: boolean;
  error: boolean;
}

const transactions = createSlice({
  name: "transactions",
  initialState: {
    data: [],
    parameters: null,
    loading: false,
    error: false,
  } as TransactionsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state, action) => {
      if (action.meta.arg) {
        state.parameters = action.meta.arg;
      }
      state.loading = true;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.error = !!action.error;
    });
  },
});

const actions = {
  fetchTransactions,
  addTransaction,
  addTransactionsBulk,
  updateTransaction,
  deleteTransaction,
};

export { actions };
export default transactions;
