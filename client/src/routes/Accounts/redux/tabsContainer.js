import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import accountsViewSlice from "./slice";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "store/transactions";

import Tabs from "../Tabs";

export default connect(
  (state) => ({
    accountsView: state.routes.accounts,
    accounts: state.data.accounts,
    transactions: state.data.transactions,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        ...accountsViewSlice.actions,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      },
      dispatch
    ),
  })
)(Tabs);
