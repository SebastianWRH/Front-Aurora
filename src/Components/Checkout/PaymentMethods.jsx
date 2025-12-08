import { useState } from 'react';
import { uploadToCloudinary, validateImageFile } from '../../services/cloudinaryService';

function PaymentMethods({ onMethodSelect, selectedMethod, onTicketUpload }) {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showYapeDetails, setShowYapeDetails] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleMethodClick = (method) => {
    onMethodSelect(method);
    setShowBankDetails(method === 'transfer');
    setShowYapeDetails(method === 'yape');
    
    // Limpiar upload si cambia a cash
    if (method === 'cash') {
      setUploadedUrl('');
      setPreviewUrl('');
      setUploadError('');
      onTicketUpload('');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      const url = await uploadToCloudinary(file);
      setUploadedUrl(url);
      onTicketUpload(url); // Notificar al componente padre
      
    } catch (error) {
      setUploadError(error.message || 'Error al subir la imagen');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const clearUpload = () => {
    setUploadedUrl('');
    setPreviewUrl('');
    setUploadError('');
    onTicketUpload('');
  };

  const needsTicket = selectedMethod === 'transfer' || selectedMethod === 'yape';

  return (
    <div className="payment-methods">
      <h2 className="payment-title">Método de Pago</h2>
      <p className="payment-subtitle">Selecciona tu método de pago preferido</p>

      <div className="payment-options">
        
        {/* Transferencia Bancaria */}
        <div 
          className={`payment-option ${selectedMethod === 'transfer' ? 'active' : ''}`}
          onClick={() => handleMethodClick('transfer')}
        >
          <div className="payment-option-header">
            <div className="payment-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div className="payment-info">
              <h3>Transferencia Bancaria</h3>
              <p>Realiza una transferencia a nuestra cuenta</p>
            </div>
            <div className="payment-radio">
              <input 
                type="radio" 
                name="payment" 
                checked={selectedMethod === 'transfer'}
                onChange={() => {}}
              />
            </div>
          </div>

          {showBankDetails && (
            <div className="payment-details">
              <div className="bank-details">
                <div className="detail-item">
                  <span className="detail-label">Banco:</span>
                  <span className="detail-value">BCP</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Número de Cuenta:</span>
                  <span className="detail-value">191-2468135-0-45</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">CCI:</span>
                  <span className="detail-value">002-191-002468135045-15</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Titular:</span>
                  <span className="detail-value">Aurora Joyería SAC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Yape/Plin */}
        <div 
          className={`payment-option ${selectedMethod === 'yape' ? 'active' : ''}`}
          onClick={() => handleMethodClick('yape')}
        >
          <div className="payment-option-header">
            <div className="payment-icon yape">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div className="payment-info">
              <h3>Yape / Plin</h3>
              <p>Pago rápido mediante código QR</p>
            </div>
            <div className="payment-radio">
              <input 
                type="radio" 
                name="payment" 
                checked={selectedMethod === 'yape'}
                onChange={() => {}}
              />
            </div>
          </div>

          {showYapeDetails && (
            <div className="payment-details">
              <div className="qr-container">
                <div className="qr-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <p>Escanea este código QR</p>
                </div>
                <div className="yape-info">
                  <p><strong>Número Yape:</strong></p>
                  <p className="yape-number">987 654 321</p>
                  <p className="yape-name">Aurora Joyería</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pago Contra Entrega */}
        <div 
          className={`payment-option ${selectedMethod === 'cash' ? 'active' : ''}`}
          onClick={() => handleMethodClick('cash')}
        >
          <div className="payment-option-header">
            <div className="payment-icon cash">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="payment-info">
              <h3>Pago Contra Entrega</h3>
              <p>Paga cuando recibas tu pedido</p>
            </div>
            <div className="payment-radio">
              <input 
                type="radio" 
                name="payment" 
                checked={selectedMethod === 'cash'}
                onChange={() => {}}
              />
            </div>
          </div>

          {selectedMethod === 'cash' && (
            <div className="payment-details">
              <div className="payment-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>Solo disponible para Lima Metropolitana. El pago debe ser en efectivo al momento de la entrega.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload de Comprobante (solo para transfer y yape) */}
      {needsTicket && (
        <div className="ticket-upload-section">
          <h3 className="upload-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Subir Comprobante de Pago *
          </h3>
          <p className="upload-subtitle">Sube una captura o foto de tu comprobante de pago</p>

          {!uploadedUrl ? (
            <div className="upload-area">
              <input
                type="file"
                id="ticket-upload"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <label htmlFor="ticket-upload" className="upload-label">
                {uploading ? (
                  <>
                    <div className="upload-spinner"></div>
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Haz clic para subir tu comprobante</span>
                    <span className="upload-hint">JPG, PNG o JPEG (máx. 5MB)</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="upload-success">
              <div className="preview-container">
                {previewUrl && (
                  <img src={previewUrl} alt="Comprobante" className="preview-image" />
                )}
                <div className="preview-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Comprobante subido correctamente</span>
                </div>
              </div>
              <button type="button" onClick={clearUpload} className="upload-clear-btn">
                Cambiar comprobante
              </button>
            </div>
          )}

          {uploadError && (
            <div className="upload-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {uploadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;