import { actions as accountActions } from "./accounts";
import { actions as transactionActions } from "./transactions";

const actions = { ...accountActions, ...transactionActions };
export default actions;
