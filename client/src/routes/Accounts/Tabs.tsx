import React, { useEffect } from "react";
import { Tabs as AntDTabs, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import actions from "store/actions";
import { actions as viewActions } from "./redux/slice";
import TabContent from "./TabContent";
import "./Tabs.css";

const Tabs = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const accountsView = useSelector((state) => state.routes.accounts);

  useEffect(() => {
    dispatch(
      actions.fetchTransactions({
        accountId: accountsView.activeTabId as string,
        fromDate: accountsView.dateRange[0],
        toDate: accountsView.dateRange[1],
      })
    );
  }, [dispatch, accountsView.activeTabId, accountsView.dateRange]);

  const onEdit = (targetKey: any, action: any) => {
    // add/remove
    if (action === "remove") {
      dispatch(viewActions.removeTab({ id: targetKey }));
    }
  };

  const onSelectAccount = (key: string) => {
    dispatch(viewActions.selectAccount({ id: key }));
  };

  if (accounts.loading) {
    return null;
  }

  return (
    <div className="tabs__container">
      {accountsView.openTabs.length === 0 && (
        <Empty image={null} description="Select a tab on the left."></Empty>
      )}
      <AntDTabs
        activeKey={accountsView.activeTabId as string}
        animated={false}
        type="editable-card"
        hideAdd
        onEdit={onEdit}
        onChange={onSelectAccount}
      >
        {accountsView.openTabs.map((tab) => (
          <AntDTabs.TabPane
            tab={accounts.byId[tab.id]?.name}
            key={tab.id}
            closable
          >
            {accountsView.activeTabId === tab.id && (
              <TabContent
                accountId={tab.id}
                onSelectAccount={onSelectAccount}
              />
            )}
          </AntDTabs.TabPane>
        ))}
      </AntDTabs>
    </div>
  );
};

export default Tabs;
