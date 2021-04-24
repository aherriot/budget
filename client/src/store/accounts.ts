import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "store";
import getAccountColor from "utils/getAccountColor";
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
  color: string | null;
  children: Account[] | null;
}

interface FetchAccountsArgs {
  fromDate: string;
  toDate: string;
}

export interface AccountTreeNode {
  id: string;
  children: AccountTreeNode[];
}
interface AccountsState {
  byId: Record<string, Account>;
  byTree: AccountTreeNode[];
  parameters: FetchAccountsArgs | null;
  loading: boolean;
  error: boolean | any;
}

interface FetchPayload {
  byId: Record<string, Account>;
  byTree: AccountTreeNode[];
}

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

  const byId = {};

  const byTree = buildTree(null, response.data, byId, { counter: 0 });

  return { byId, byTree };
});

function buildTree(
  parentId: string | null,
  accounts: Account[],
  byId: Record<string, Account>,
  meta: { counter: number }
) {
  let childAccounts: Account[] = [];
  accounts.forEach((account) => {
    if (account.parentId === parentId) {
      childAccounts.push(account);
    }
  });

  childAccounts.sort((a, b) => b.name.localeCompare(b.name));
  const children: AccountTreeNode[] = [];

  childAccounts.forEach((account) => {
    byId[account.id] = {
      ...account,
      color: getAccountColor(meta.counter, accounts.length),
    };
    meta.counter++;
    children.push({
      id: account.id,
      children: buildTree(account.id, accounts, byId, meta),
    });
  });

  return children;
}

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
  async ({ parentId, type, name }: AddAccountArgs, thunkAPI): Promise<any> => {
    const response = await request(`/api/accounts2`, "POST", {
      parentId,
      type,
      name,
    });
    console.log("after request");
    // thunkAPI.dispatch(fetchAccounts());
    return Promise.resolve(response.data);
  }
);

const initialState: AccountsState = {
  byId: {},
  byTree: [],
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
      state.byId = action.payload.byId;
      state.byTree = action.payload.byTree;
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
