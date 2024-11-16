import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import '../styles/BarcodeGenerator.css';
import { FaQrcode } from 'react-icons/fa';


const BarcodeGenerator = () => {
    const [formData, setFormData] = useState({
        DeviceID: '',
        DeviceName: '',
        SerialNumber: '',
        MQTT_IP: '',
        MQTT_Port: '',
        MQTT_UserName: '',
        MQTT_Password: '',
        MQTT_Topic: '',
        MQTT_MacID: '',
        Status: '',
        WarrantyStartDate: '',
        WarrantyPeriod: '',
    });

    const [errors, setErrors] = useState({});
    const [generatedQR, setGeneratedQR] = useState(null);
    const qrCodeRef = useRef(null);

    const validateForm = () => {
        let newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) {
                newErrors[key] = 'This field is required';
            }
        });

        // Additional validations
        if (formData.MQTT_Port && !/^\d+$/.test(formData.MQTT_Port)) {
            newErrors.MQTT_Port = 'Port must be a number';
        }
        if (formData.WarrantyStartDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.WarrantyStartDate)) {
            newErrors.WarrantyStartDate = 'Date must be in YYYY-MM-DD format';
        }
        if (formData.WarrantyPeriod && !/^\d+$/.test(formData.WarrantyPeriod)) {
            newErrors.WarrantyPeriod = 'Warranty period must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const generateQRCode = () => {
        if (validateForm()) {
            const qrData = JSON.stringify(formData);
            setGeneratedQR(qrData);
        } else {
            alert('Please fill in all required fields correctly.');
        }
    };

    const saveImage = () => {
        const svgElement = qrCodeRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                saveAs(blob, 'qr-code.png');
            });
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    const clearForm = () => {
        setFormData({
            DeviceID: '',
            DeviceName: '',
            SerialNumber: '',
            MQTT_IP: '',
            MQTT_Port: '',
            MQTT_UserName: '',
            MQTT_Password: '',
            MQTT_Topic: '',
            MQTT_MacID: '',
            Status: '',
            WarrantyStartDate: '',
            WarrantyPeriod: '',
        });
        setErrors({});
        setGeneratedQR(null);
    };

    return (
        <div className="barcode-generator">
            <h2>Generate 2D Barcode</h2>
            <div className="generator-container">
                <form className="generator-form">
                    <fieldset>
                        <legend>Basic Information</legend>
                        {['DeviceID', 'DeviceName', 'SerialNumber'].map((field) => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors[field] ? 'error' : ''}`}
                                />
                                {errors[field] && <span className="error-message">{errors[field]}</span>}
                            </div>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>MQTT Configuration</legend>
                        {['MQTT_IP', 'MQTT_Port', 'MQTT_UserName', 'MQTT_Password', 'MQTT_Topic', 'MQTT_MacID'].map((field) => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').replace('MQTT_', '').trim()}:</label>
                                <input
                                    type={field === 'MQTT_Password' ? 'password' : 'text'}
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors[field] ? 'error' : ''}`}
                                />
                                {errors[field] && <span className="error-message">{errors[field]}</span>}
                            </div>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Status & Warranty</legend>
                        {['Status', 'WarrantyStartDate', 'WarrantyPeriod'].map((field) => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                <input
                                    type={field === 'WarrantyStartDate' ? 'date' : 'text'}
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors[field] ? 'error' : ''}`}
                                />
                                {errors[field] && <span className="error-message">{errors[field]}</span>}
                            </div>
                        ))}
                    </fieldset>
                    <button type="button" onClick={generateQRCode} className="generate-button">Generate Barcode</button>
                </form>
                <div className="qr-code-container" ref={qrCodeRef}>
                    {generatedQR ? (
                        <div className="generated-qr">
                            <QRCodeSVG value={generatedQR} size={500} />
                            <div className="qr-actions">
                                <button onClick={saveImage} className="save-button">Save Image</button>
                                <button onClick={clearForm} className="clear-button">Clear Form</button>
                            </div>
                        </div>
                    ) : (
                        <div className="qr-placeholder">
                            <FaQrcode className="qr-placeholder-icon" />
                            <p className="qr-placeholder-text">
                                QR Code will appear here<br />
                                after generation
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;