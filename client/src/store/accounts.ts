import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "store";
import request from "utils/request";

export enum AccountType {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  EQUITY = "EQUITY",
}

export interface Account {
  id: string;
  parentId: string | null;
  type: AccountType;
  name: string;
  total: number | null;
}

interface FetchAccountsArgs {
  fromDate: string;
  toDate: string;
}

interface AccountsState {
  byId: Record<string, Account>;
  parameters: FetchAccountsArgs | null;
  loading: boolean;
  error: boolean | any;
}

type FetchPayload = Record<string, Account>;

const fetchAccounts = createAsyncThunk<
  FetchPayload,
  FetchAccountsArgs | void,
  { state: RootState }
>("accounts/fetchAccounts", async (args, thunkAPI) => {
  let fromDate, toDate;

  if (args) {
    fromDate = args.fromDate;
    toDate = args.toDate;
  } else {
    fromDate = thunkAPI.getState().data.accounts.parameters?.fromDate ?? "";
    toDate = thunkAPI.getState().data.accounts.parameters?.toDate ?? "";
  }

  const response = await request("/api/accounts/tree", "POST", {
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
  });

  return response.data.reduce(
    (byId: Record<string, Account>, account: Account) => {
      byId[account.id] = account;
      return byId;
    },
    {}
  );
});

interface UpdateAccountPayload {}

interface UpdateAccountArgs {
  account: Account;
  parentId: string | null;
}

const updateAccount = createAsyncThunk<
  UpdateAccountPayload,
  UpdateAccountArgs,
  { state: RootState }
>(
  "transactions/updateAccount",
  async ({ account, parentId }: UpdateAccountArgs, thunkAPI) => {
    const response = await request(`/api/accounts/${account.id}`, "PATCH", {
      parentId,
    });
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

interface AddAccountPayload {}
interface AddAccountArgs {
  parentId: string | null;
  type: AccountType;
  name: string;
}

const addAccount = createAsyncThunk<
  AddAccountPayload,
  AddAccountArgs,
  { state: RootState }
>(
  "transactions/addAccount",
  async ({ parentId, type, name }: AddAccountArgs, thunkAPI) => {
    const response = await request(`/api/accounts`, "POST", {
      parentId,
      type,
      name,
    });
    thunkAPI.dispatch(fetchAccounts());
    return response.data;
  }
);

const initialState: AccountsState = {
  byId: {},
  parameters: null,
  loading: false,
  error: false,
};

const accounts = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.pending, (state, action) => {
      if (action.meta.arg) {
        state.parameters = action.meta.arg;
      }
      state.loading = true;
    });
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.byId = action.payload;
      state.loading = false;
      state.error = false;
    });

    builder.addCase(fetchAccounts.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

const actions = { fetchAccounts, updateAccount, addAccount };
export { actions };
export default accounts;
