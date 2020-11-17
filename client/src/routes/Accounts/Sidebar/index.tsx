import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, DatePicker } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import actions from "store/actions";
import { actions as viewActions } from "../redux/slice";
import AccountTree from "./AccountTree";
import AddAccountModal from "./AddAccountModal";
import "./Sidebar.css";

const Sidebar = () => {
  const accountsView = useSelector((state) => state.routes.accounts);
  const dispatch = useDispatch();
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      actions.fetchAccounts({
        fromDate: accountsView.dateRange[0],
        toDate: accountsView.dateRange[1],
      })
    );
  }, [dispatch, accountsView.dateRange]);

  const onSelectDateRange = (dates: any) => {
    dispatch(
      viewActions.selectDateRange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].endOf("month").format("YYYY-MM-DD"),
      ])
    );
  };

  return (
    <div className="sidebar__container">
      <h2>Accounts</h2>
      <DatePicker.RangePicker
        picker="month"
        value={accountsView.dateRange.map((val) => moment(val)) as any}
        onChange={onSelectDateRange}
      />
      <AccountTree />
      <Button
        icon={<PlusOutlined />}
        onClick={() => setAddAccountModalOpen(true)}
      >
        Add Account
      </Button>
      <Link to="/bulk-import">
        <Button icon={<UploadOutlined />}>Import Transactions</Button>
      </Link>
      <AddAccountModal
        open={addAccountModalOpen}
        onClose={() => setAddAccountModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
