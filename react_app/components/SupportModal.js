
import React, { useState, useEffect } from 'react';
import Toast from './Toast';

export default function SupportModal({ isOpen, onClose }) {
  const [toastMessage, setToastMessage] = useState('');

  const supportEmail = "suporte@toggo.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setToastMessage("E-mail copiado para a área de transferência!");
  };
  
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);


  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content support-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Entre em Contato</h2>
          <p>Você pode nos contatar diretamente pelo e-mail abaixo.</p>
          
          <div className="support-email-box">
            <span>{supportEmail}</span>
            <button onClick={handleCopyEmail}>Copiar</button>
          </div>
          
          <span className="or-divider">ou</span>

          <a href={`mailto:${supportEmail}?subject=Suporte%20Toggo`} className="primary-button">
            Abrir no seu App de E-mail
          </a>

          <button className="secondary-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
      
      <Toast message={toastMessage} />
    </>
  );
}