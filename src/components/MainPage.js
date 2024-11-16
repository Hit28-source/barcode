import React, { useState } from 'react';
import QRScanner from './QRScanner';
import BarcodeGenerator from './BarcodeGenerator';
import DeviceForm from './DeviceForm';

const MainPage = () => {
    const [mode, setMode] = useState('scan'); // Default to 'scan' mode
    const [formData, setFormData] = useState({});

    const handleScanResult = (result) => {
        setFormData(result);
    };

    const clearForm = () => {
        setFormData({});
    };

    return (
        <div className="main-page">
            <div className="content-wrapper">
                <div className="left-section">
                    <div className="mode-selection">
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
                    {mode === 'scan' ? (
                        <QRScanner onScanResult={handleScanResult} />
                    ) : (
                        <BarcodeGenerator />
                    )}
                </div>
                <div className="right-section">
                    <DeviceForm formData={formData} onClear={clearForm} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;