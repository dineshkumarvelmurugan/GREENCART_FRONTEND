import React from 'react';
import ReactDOM from 'react-dom';
import './QRModal.css';

// This component will be rendered as a portal outside the main container
const QRModal = ({ qrImage, onClose }) => {
  // Create a portal to render outside the parent hierarchy
  return ReactDOM.createPortal(
    <div className="qr-modal-overlay">
      <div className="qr-modal-container">
        <div className="qr-modal-header">
          <h3>Scan to Pay</h3>
          <button 
            className="qr-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="qr-modal-content">
          <img src={qrImage} alt="Payment QR Code" className="qr-modal-image" />
          <p className="qr-modal-instruction">Scan this QR code with your payment app</p>
        </div>
        <div className="qr-modal-footer">
          <button 
            className="qr-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body // This attaches the modal directly to the body, outside of any containers
  );
};

export default QRModal;