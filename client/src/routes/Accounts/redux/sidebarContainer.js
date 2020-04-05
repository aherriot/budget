import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import accountsViewSlice from "./slice";
import accounts, { fetchAccounts } from "store/accounts";

import Sidebar from "../Sidebar";

export default connect(
  state => ({
    accountsView: state.routes.accounts,
    accounts: state.data.accounts
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...accountsViewSlice.actions,
        ...accounts.actions,
        fetchAccounts
      },
      dispatch
    )
  })
)(Sidebar);
