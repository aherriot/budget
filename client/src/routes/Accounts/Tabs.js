import React, { useEffect } from "react";
// import PropTypes from 'prop-types'
import { Tabs as AntDTabs } from "antd";
import "./Tabs.css";
import TabContent from "./TabContent";

const Tabs = ({ accounts, transactions, accountsView, actions }) => {
  useEffect(() => {
    actions.fetchTransactions({
      accountId: accountsView.activeTabId,
      fromDate: accountsView.dateRange[0],
      toDate: accountsView.dateRange[1],
    });
  }, [actions, accountsView.activeTabId, accountsView.dateRange]);

  const onEdit = (targetKey, action) => {
    // add/remove
    if (action === "remove") {
      actions.removeTab({ id: targetKey });
    }
  };

  const onSelectAccount = (key) => {
    actions.selectAccount({ id: key });
  };

  if (accounts.loading) {
    return null;
  }

  return (
    <div className="tabs__container">
      {accountsView.openTabs.length === 0 && <p>Select a tab on the left.</p>}
      <AntDTabs
        activeKey={accountsView.activeTabId}
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
                actions={actions}
                accountId={tab.id}
                accounts={accounts}
                transactions={transactions}
                accountsView={accountsView}
                onSelectAccount={onSelectAccount}
              />
            )}
          </AntDTabs.TabPane>
        ))}
      </AntDTabs>
    </div>
  );
};

Tabs.propTypes = {};

export default Tabs;
