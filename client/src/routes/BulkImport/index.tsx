import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Input, Button, Cascader } from "antd";
import { useForm, Controller } from "react-hook-form";
import Header from "components/Header";
import actions from "store/actions";
import { AddTransactionArgs } from "store/transactions";
import { Account } from "store/accounts";

interface FormValues {
  csvData: string;
  targetAccountId: string;
}

const BulkImport = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const { handleSubmit, control } = useForm<FormValues>();

  useEffect(() => {
    dispatch(actions.fetchAccounts());
  }, [dispatch]);

  // date, description, inAmount, outAmount
  const onSubmit = (data: FormValues) => {
    const convertedData = convertFromCsv(
      data.csvData,
      data.targetAccountId,
      Object.values(accounts.byId).find((account) => account.parentId === null)
        ?.id ?? null
    );
    dispatch(actions.addTransactionsBulk(convertedData));
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
      <Controller
        control={control}
        name="csvData"
        as={Input.TextArea}
        rules={{ required: true }}
        placeholder={
          "2020-03-14,Tim Horton's 123,,5.23\n2020-03-14,C/C Transfer,723.23"
        }
      />
      <Controller
        control={control}
        name="targetAccountId"
        render={({ onChange, value, name }: any) => (
          <Cascader
            name={name}
            onChange={onChange}
            value={value}
            changeOnSelect
            displayRender={(val: string[]) => val[val.length - 1]}
            showSearch={{
              filter: (searchValue: string, path: any[]) => {
                return !!(
                  (path[path.length - 1].label as string).toLowerCase() ??
                  null === searchValue.toLowerCase()
                );
              },
            }}
            options={accountTreeData}
          />
        )}
      />
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
};

const convertFromCsv = (
  csvData: string,
  targetAccountId: string,
  rootAccountId: string | null
) => {
  const data: AddTransactionArgs[] = [];
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
  date: string,
  description: string,
  inAmount: string,
  outAmount: string,
  targetAccountId: string | null,
  rootAccountId: string | null
) => {
  let amount;
  let inAccount = rootAccountId;
  let outAccount = rootAccountId;

  if (inAmount) {
    amount = inAmount;
    inAccount = targetAccountId;
  } else {
    amount = outAmount as string;
    outAccount = targetAccountId;
  }

  return {
    amount: parseFloat(amount) * 100,
    description,
    inDate: date,
    inAccount: inAccount as string,
    outDate: date,
    outAccount: outAccount as string,
  };
};

interface TreeNode {
  label: string;
  value: string;
  children: TreeNode[];
}

function buildAcountsTree(
  parentId: string | null,
  accountsById: Record<string, Account>
) {
  const children: TreeNode[] = [];
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
