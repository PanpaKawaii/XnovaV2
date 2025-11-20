import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';
import './AlertModal.css';

export const AlertModal = ({ isOpen, message, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="alert-modal">
        <div className="alert-modal__icon">
          <AlertCircle size={48} />
        </div>
        <div className="alert-modal__content">
          <p className="alert-modal__message">{message}</p>
        </div>
        <div className="alert-modal__actions">
          <Button variant="primary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};