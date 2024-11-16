import React, { useState } from 'react';
import QRScanner from './components/QRScanner';
import BarcodeGenerator from './components/BarcodeGenerator';
import DeviceForm from './components/DeviceForm';
import './App.css';

function App() {
  const [mode, setMode] = useState('scan');
  const [formData, setFormData] = useState({});

  const handleScanResult = (result) => {
    setFormData(result);
  };

  const clearForm = () => {
    setFormData({});
  };

  return (
    <div className="App">
      <div className="mode-buttons">
        <button
          className={`mode-button ${mode === 'scan' ? 'active' : ''}`}
          onClick={() => setMode('scan')}
        >
          Scan Barcode
        </button>
        <button
          className={`mode-button ${mode === 'generate' ? 'active' : ''}`}
          onClick={() => setMode('generate')}
        >
          Generate Barcode
        </button>
      </div>
      <div className="app-container">
        <div className="left-section">
          {mode === 'scan' ? (
            <QRScanner onScanResult={handleScanResult} />
          ) : (
            <BarcodeGenerator />
          )}
        </div>
        {mode === 'scan' && (
          <div className="right-section">
            <DeviceForm formData={formData} onClear={clearForm} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;