import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './ConfirmModal.css';

export const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="confirm-modal">
        <div className="confirm-modal__content">
          <p className="confirm-modal__message">{message}</p>
          <div className="confirm-modal__actions">
            <Button variant="secondary" onClick={onCancel}>
              Hủy
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};