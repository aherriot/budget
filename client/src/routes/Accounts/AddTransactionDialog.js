import React from "react";
import { Modal } from "antd";
function AddTransactionDialog({ open, onClose }) {
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
