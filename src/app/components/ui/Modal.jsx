import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getModalClasses = () => {
    const classes = ['modal-content'];
    classes.push(`modal-content--${size}`);
    return classes.join(' ');
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />
      <div className={getModalClasses()}>
        {title ? (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close-button"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="modal-close-button modal-close-button--absolute"
          >
            <X size={24} />
          </button>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};