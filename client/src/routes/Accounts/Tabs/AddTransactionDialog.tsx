import React from "react";
import { Modal } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
}
function AddTransactionDialog({ open, onClose }: Props) {
  return (
    <Modal
      title="Add Transaction"
      visible={open}
      onCancel={onClose}
      onOk={onClose}
    >
      Content
    </Modal>
  );
}

export default AddTransactionDialog;
