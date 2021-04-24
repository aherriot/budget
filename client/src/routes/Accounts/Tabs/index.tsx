import React, { useState, useEffect } from "react";
import { Tabs as AntDTabs, Empty } from "antd";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import actions from "store/actions";
import { actions as viewActions } from "../redux/slice";
import TabContent from "./TabContent";
import "./Tabs.css";
import ColorDot from "components/ColorDot";

const Tabs = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const accountsView = useSelector(
    (state) => state.routes.accounts,
    shallowEqual
  );
  const [val, setVal] = useState(0);

  useEffect(() => {
    dispatch(
      actions.fetchTransactions({
        accountId: accountsView.activeTabId as string,
        fromDate: accountsView.dateRange[0],
        toDate: accountsView.dateRange[1],
      })
    );
  }, [dispatch, accountsView.activeTabId, accountsView.dateRange]);

  useEffect(() => {
    console.log("Tabs mounting");
    return () => console.log("Tabs unmounting");
  }, []);

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
      <h1 onClick={() => setVal(val + 1)}>{val}</h1>

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
            tab={
              <span key={tab.id} className="sidebar__label">
                <ColorDot color={accounts.byId[tab.id]?.color as string} />
                {accounts.byId[tab.id]?.name}
              </span>
            }
            key={tab.id}
            closable
            forceRender
          >
            {accountsView.activeTabId === tab.id && (
              <TabContent
                key={tab.id}
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

Tabs.whyDidYouRender = true;

export default Tabs;
