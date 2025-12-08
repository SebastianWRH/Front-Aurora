import { useState } from 'react';

function VerificationModal({ email, onVerify, onClose, onResend }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await onVerify(code);
    
    if (!result.success) {
      setError(result.error || 'Código inválido o expirado');
    }
    
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    await onResend();
    setResending(false);
    setCode('');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  return (
    <div className="os-modal-overlay">
      <div className="os-modal">
        <button className="os-modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="os-modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 className="os-modal-title">Verificación de Email</h2>
        <p className="os-modal-text">
          Hemos enviado un código de 6 dígitos a:<br/>
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="os-verification-form">
          <div className="os-code-input-group">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              className="os-code-input"
              maxLength="6"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="os-error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="os-verify-btn"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <div className="os-spinner"></div>
                Verificando...
              </>
            ) : (
              'Verificar Código'
            )}
          </button>
        </form>

        <div className="os-modal-footer">
          <p>¿No recibiste el código?</p>
          <button 
            onClick={handleResend} 
            className="os-resend-btn"
            disabled={resending}
          >
            {resending ? 'Reenviando...' : 'Reenviar código'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationModal;