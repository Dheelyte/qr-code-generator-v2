import { useState, useRef } from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { HexColorPicker } from 'react-colorful';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [padding, setPadding] = useState(20);
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
        <h1>✨ Design Your QR Code</h1>
        
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
            {logo ? 'Change Logo' : 'Upload Logo'}
          </label>
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
            size={qrSize}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            marginSize={padding}
          />
          {logo && (
            <div className="logo-overlay">
              <img src={logo} alt="QR Logo" style={{ width: qrSize * 0.2 }} />
            </div>
          )}
      </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default QrGenerator;