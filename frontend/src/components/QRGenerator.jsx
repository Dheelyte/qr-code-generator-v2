import { useState, useRef } from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { HexColorPicker } from 'react-colorful';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [padding, setPadding] = useState(2);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const qrRef = useRef(null);
  const qrSize = 400;

  const handleDownload = async () => {
    try {
      const canvas = await html2canvas(qrRef.current);
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('QR code downloaded!');
      console.log('Toast')
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="qr-generator-container">
      <div className="form-container">
        <h1>Design Your QR Code</h1>
        
        <div className="input-group">
          <label>URL or Text</label>
          <input
            type="text"
            className="styled-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="design-section">
        <div className="color-pickers">
          <div className="color-option" onClick={() => setShowColorPicker('fg')}>
            <div className="color-preview-container">
              <div 
                className="color-preview" 
                style={{ backgroundColor: fgColor }}
              />
              <span className="color-text-label">Color</span>
            </div>
          </div>

          <div className="color-option" onClick={() => setShowColorPicker('bg')}>
            <div className="color-preview-container">
              <div 
                className="color-preview" 
                style={{ backgroundColor: bgColor }}
              />
              <span className="color-text-label">Background</span>
            </div>
          </div>
        </div>

        {showColorPicker && (
          <div className="color-picker-popup">
            <HexColorPicker
              color={showColorPicker === 'fg' ? fgColor : bgColor}
              onChange={(color) => 
                showColorPicker === 'fg' ? setFgColor(color) : setBgColor(color)
              }
            />
            <button 
              className="close-button"
              onClick={() => setShowColorPicker(null)}
            >close color picker</button>
          </div>
        )}

        <div className="input-group">
          <label>Margin</label>
          <input
            type="range"
            className="size-slider"
            min="0"
            max="10"
            value={padding}
            onChange={(e) => setPadding(parseInt(e.target.value))}
          />
          <div className="size-value">{padding * 10}px</div>
        </div>

        <div className="input-group">
          <label>{"Add Logo (optional)"}</label>
          <label className="logo-upload">
            <input type="file" onChange={handleLogoUpload} hidden />
            <svg fill="#76828b" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 374.116 374.116" xml:space="preserve">
              <g>
                <path d="M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30
                  v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z"/>
                <path d="M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488
                  c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788
                  c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426
                  C92.859,147.631,111.855,147.631,123.57,135.915z"/>
              </g>
            </svg>
            <span>{logo ? 'Change Logo' : 'Upload Logo'}</span>
          </label>
        </div>
        </div>

        <button 
          className="generate-button" 
          onClick={handleDownload} 
          disabled={!url}
        >
          Download QR Code
        </button>
      </div>

      <div className="qr-preview-container">
        <h1>Preview Your QR Code</h1>
        <div className="qr-preview" ref={qrRef}>
          <QRCodeSVG
            value={url}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            marginSize={padding}
          />
          {logo && (
            <div className="logo-overlay">
              <img src={logo} alt="QR Logo" />
            </div>
          )}
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default QrGenerator;