import React, { useEffect } from "react";
// import PropTypes from "prop-types";
import { Input, Button, Cascader } from "antd";
import { useForm } from "react-hook-form";
import Header from "components/Header";

const BulkImport = ({ actions, accounts }) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    actions.fetchAccounts();
  }, [actions]);

  useEffect(() => {
    register({ name: "csvData" }, { required: true });
    register({ name: "targetAccountId" }, { required: true });
  }, [register]);

  // date, description, inAmount, outAmount
  const onSubmit = (data) => {
    const convertedData = convertFromCsv(
      data.csvData,
      data.targetAccountId,
      Object.values(accounts.byId).find((account) => account.parentId === null)
        .id
    );
    actions.addTransactionsBulk(convertedData);
  };

  const accountTreeData = buildAcountsTree(null, accounts.byId);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Header />
      <h2>Bulk Import</h2>
      <p> date, description, inAmount, outAmount</p>
      <pre>
        2020-03-14,Tim Horton's 123,,5.23
        <br />
        2020-03-14,C/C Transfer,723.23,
      </pre>
      <Input.TextArea
        name="csvData"
        onChange={(e) => setValue("csvData", e.target.value)}
        placeholder={
          "2020-03-14,Tim Horton's 123,,5.23\n2020-03-14,C/C Transfer,723.23"
        }
      />
      <Cascader
        showSearch={{
          filter: (searchValue, path) => {
            return (
              path[path.length - 1].label.toLowerCase() ===
              searchValue.toLowerCase()
            );
          },
        }}
        options={accountTreeData}
        displayRender={(val) => val[val.length - 1]}
        onChange={(val) => {
          setValue("targetAccountId", val[val.length - 1]);
        }}
      />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
};

const convertFromCsv = (csvData, targetAccountId, rootAccountId) => {
  const data = [];
  csvData.split("\n").forEach((row) => {
    const [date, description, inAmount, outAmount] = row.split(",");
    if (date && description && (inAmount || outAmount)) {
      data.push(
        createTransaction(
          date,
          description,
          inAmount,
          outAmount,
          targetAccountId,
          rootAccountId
        )
      );
    }
  });
  return data;
};

const createTransaction = (
  date,
  description,
  inAmount,
  outAmount,
  targetAccountId,
  rootAccountId
) => {
  let amount;
  let inAccount = rootAccountId;
  let outAccount = rootAccountId;

  if (inAmount) {
    amount = inAmount;
    inAccount = targetAccountId;
  } else {
    amount = outAmount;
    outAccount = targetAccountId;
  }

  return {
    amount: parseFloat(amount) * 100,
    description,
    inDate: date,
    inAccount,
    outDate: date,
    outAccount,
  };
};

function buildAcountsTree(parentId, accountsById) {
  const children = [];
  Object.values(accountsById).forEach((account) => {
    if (account.parentId === parentId) {
      children.push({
        label: accountsById[account.id]?.name,
        value: account.id,
        children: buildAcountsTree(account.id, accountsById),
      });
    }
  });
  return children;
}

BulkImport.propTypes = {};

export default BulkImport;

/*


*/
