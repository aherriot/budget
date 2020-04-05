import { combineReducers } from "redux";

import accounts from "store/accounts";
import transactions from "store/transactions";

import accountsRoute from "routes/Accounts/redux/slice";

export default combineReducers({
  // general app state (like global error messages)
  // app: appReducer,

  // data from server
  data: combineReducers({
    accounts: accounts.reducer,
    transactions: transactions.reducer
  }),

  // view state for specific routes
  routes: combineReducers({
    accounts: accountsRoute.reducer
  })
});
