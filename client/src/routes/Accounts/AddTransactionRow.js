import React, { useEffect } from "react";
import { Input, DatePicker, Button } from "antd";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import AccountPicker from "components/AccountPicker";

const AddTransactionRow = ({ accounts, actions, activeTabId }) => {
  const { handleSubmit, errors, formState, control } = useForm();

  const onSubmit = ({ date, inAccount, outAccount, description, amount }) => {
    const transaction = {
      inDate: date.format("YYYY-MM-DD"),
      outDate: date.format("YYYY-MM-DD"),
      inAccount: inAccount[inAccount.length - 1],
      outAccount: outAccount[outAccount.length - 1],
      description,
      amount: parseInt(amount, 10),
    };
    actions.addTransaction(transaction);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table>
        <tbody className="ant-table-tbody">
          <tr className="ant-table-row ant-table-row-level-0">
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="date"
                as={DatePicker}
                defaultValue={moment()}
                rules={{ required: true }}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="outAccount"
                as={AccountPicker}
                accounts={accounts}
                rules={{ required: true }}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="inAccount"
                as={AccountPicker}
                accounts={accounts}
                rules={{ required: true }}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="description"
                as={Input}
                placeholder="description"
                rules={{ required: true }}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="amount"
                as={Input}
                placeholder="amount"
                rules={{ required: true }}
              />
            </td>
            <td className="ant-table-cell">
              <Button htmlType="submit">Add</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default AddTransactionRow;

// <
//   defaultValue={moment()}
//   onChange={(val) => {
//     setValue("date", val);
//   }}
// />

//
