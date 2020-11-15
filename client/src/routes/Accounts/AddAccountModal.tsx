import React from "react";
import { Modal, Input, Select, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { renderAccountPicker } from "components/AccountPicker";
import { AccountType } from "store/accounts";
import actions from "store/actions";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  parentId: string;
  type: AccountType;
  name: string;
}

function AddAccountModal({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm<FormValues>();

  const onSubmit = ({ parentId, type, name }: FormValues) => {
    const account = {
      parentId: parentId[parentId.length - 1],
      type,
      name,
    };

    dispatch(actions.addAccount(account));
  };

  return (
    <Modal title="Add Account" visible={open} onCancel={onClose} onOk={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            control={control}
            name="parentId"
            render={renderAccountPicker}
            rules={{ required: true }}
          />
        </div>
        <div>
          <Controller
            control={control}
            as={Select}
            name="type"
            rules={{ required: true }}
            defaultValue="EXPENSE"
            options={[
              { label: "Asset", value: "ASSET" },
              { label: "Liability", value: "LIABILITY" },
              { label: "Expense", value: "EXPENSE" },
              { label: "Income", value: "INCOME" },
              { label: "Equity", value: "EQUITY" },
            ]}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="name"
            as={Input}
            placeholder="name"
            rules={{ required: true }}
          />
        </div>
        <div>
          <Button htmlType="submit">Add</Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddAccountModal;
