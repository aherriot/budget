import React from "react";
import { useDispatch } from "react-redux";
import { Input, InputNumber, DatePicker, Button } from "antd";
import moment, { Moment } from "moment";
import { useForm, Controller } from "react-hook-form";

import actions from "store/actions";
import AccountPicker from "components/AccountPicker";

interface FormValues {
  date: Moment;
  inAccount: string[];
  outAccount: string[];
  description: string;
  amount: number;
}

const AddTransactionRow = () => {
  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm<FormValues>();

  const onSubmit = ({
    date,
    inAccount,
    outAccount,
    description,
    amount,
  }: FormValues) => {
    const transaction = {
      inDate: date.format("YYYY-MM-DD"),
      outDate: date.format("YYYY-MM-DD"),
      inAccount: inAccount[inAccount.length - 1],
      outAccount: outAccount[outAccount.length - 1],
      description,
      amount: amount * 100,
    };
    dispatch(actions.addTransaction(transaction));
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
                render={AccountPicker}
                rules={{ required: true }}
                defaultValue={null}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="inAccount"
                render={AccountPicker}
                rules={{ required: true }}
                defaultValue={null}
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="description"
                as={Input}
                placeholder="description"
                rules={{ required: true }}
                defaultValue=""
              />
            </td>
            <td className="ant-table-cell">
              <Controller
                control={control}
                name="amount"
                as={InputNumber}
                formatter={(value: number | string | undefined) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: string | undefined) =>
                  value?.replace(/\$\s?|(,*)/g, "") ?? 0
                }
                placeholder="amount"
                rules={{ required: true }}
                defaultValue={null}
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
