import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import accountsViewSlice from "./slice";
import { fetchTransactions } from "store/transactions";

import Tabs from "../Tabs";

export default connect(
  state => ({
    accountsView: state.routes.accounts,
    accounts: state.data.accounts,
    transactions: state.data.transactions
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...accountsViewSlice.actions,
        fetchTransactions
      },
      dispatch
    )
  })
)(Tabs);
