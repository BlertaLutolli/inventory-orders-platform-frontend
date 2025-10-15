import React from 'react';
import Modal from './Modal';
import Button from './Button';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

const ConfirmDialog: React.FC<Props> = ({
  open, title = 'Are you sure?', message = 'This action cannot be undone.',
  confirmLabel = 'Delete', cancelLabel = 'Cancel', onCancel, onConfirm, busy
}) => (
  <Modal open={open} onClose={onCancel} title={title} footer={
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Button onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
      <Button variant="danger" onClick={onConfirm} loading={busy}>{confirmLabel}</Button>
    </div>
  }>
    <p>{message}</p>
  </Modal>
);

export default ConfirmDialog;
