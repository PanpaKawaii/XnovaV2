import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './AlertPopup.css';

export const AlertPopup = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="alert-popup__icon alert-popup__icon--success" size={48} />;
      case 'error':
        return <AlertCircle className="alert-popup__icon alert-popup__icon--error" size={48} />;
      case 'warning':
        return <AlertTriangle className="alert-popup__icon alert-popup__icon--warning" size={48} />;
      case 'info':
      default:
        return <Info className="alert-popup__icon alert-popup__icon--info" size={48} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className="alert-popup-overlay">
      <div 
        className="alert-popup-backdrop"
        onClick={onClose}
      />
      <div className={`alert-popup ${type ? `alert-popup--${type}` : ''}`}>
        <button
          onClick={onClose}
          className="alert-popup__close"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="alert-popup__content">
          <div className="alert-popup__icon-wrapper">
            {getIcon()}
          </div>

          {title && (
            <h3 className="alert-popup__title">{title}</h3>
          )}

          {message && (
            <p className="alert-popup__message">{message}</p>
          )}
        </div>

        <div className="alert-popup__actions">
          {cancelText && (
            <button
              onClick={handleCancel}
              className="alert-popup__button alert-popup__button--secondary"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`alert-popup__button alert-popup__button--primary alert-popup__button--${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
