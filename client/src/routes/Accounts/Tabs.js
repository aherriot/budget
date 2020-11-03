import React, { useEffect } from "react";
// import PropTypes from 'prop-types'
import { Tabs as AntDTabs } from "antd";
import "./Tabs.css";
import TabContent from "./TabContent";

const Tabs = ({ accounts, transactions, accountsView, actions }) => {
  useEffect(() => {
    actions.fetchTransactions(accountsView.activeTabId);
  }, [actions, accountsView.activeTabId]);

  const onEdit = (targetKey, action) => {
    // add/remove
    if (action === "remove") {
      actions.removeTab({ id: targetKey });
    }
  };

  const onSelectAccount = (key) => {
    actions.selectAccount({ id: key });
  };

  return (
    <div className="tabs__container">
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
