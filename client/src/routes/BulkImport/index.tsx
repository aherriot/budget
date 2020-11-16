import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import Header from "components/Header";
import actions from "store/actions";
import { AddTransactionArgs } from "store/transactions";
import AccountPicker from "components/AccountPicker";

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
        defaultValue=""
      />
      <Controller
        control={control}
        name="targetAccountId"
        render={AccountPicker}
        defaultValue={null}
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

export default BulkImport;
