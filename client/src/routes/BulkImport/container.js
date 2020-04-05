import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { addTransactionsBulk } from "store/transactions";
import { fetchAccounts } from "store/accounts";

import BulkImport from ".";

export default connect(
  state => ({
    accounts: state.data.accounts,
    transactions: state.data.transactions
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        // ...accountsViewSlice.actions,
        fetchAccounts,
        addTransactionsBulk
      },
      dispatch
    )
  })
)(BulkImport);
