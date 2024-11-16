import React from 'react';

const DeviceForm = ({ formData, onClear }) => {
    return (
        <div className="device-info">
            <h2>Device Information</h2>
            <div className="info-grid">
                <div className="info-column">
                    <h3>Basic Information</h3>
                    <div className="form-group">
                        <label>Device ID:</label>
                        <input type="text" value={formData.DeviceID || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Device Name:</label>
                        <input type="text" value={formData.DeviceName || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Serial Number:</label>
                        <input type="text" value={formData.SerialNumber || ''} readOnly />
                    </div>
                </div>
                <div className="info-column">
                    <h3>MQTT Configuration</h3>
                    <div className="form-group">
                        <label>MQTT IP:</label>
                        <input type="text" value={formData.MQTT_IP || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>MQTT Port:</label>
                        <input type="text" value={formData.MQTT_Port || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>MQTT Username:</label>
                        <input type="text" value={formData.MQTT_Username || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>MQTT Password:</label>
                        <input type="password" value={formData.MQTT_Password || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>MQTT Topic:</label>
                        <input type="text" value={formData.MQTT_Topic || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>MQTT Mac ID:</label>
                        <input type="text" value={formData.MQTT_MacID || ''} readOnly />
                    </div>
                </div>
                <div className="info-column">
                    <h3>Status & Warranty</h3>
                    <div className="form-group">
                        <label>Status:</label>
                        <input type="text" value={formData.Status || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Warranty Start Date:</label>
                        <input type="text" value={formData.WarrantyStartDate || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Warranty Period:</label>
                        <input type="text" value={formData.WarrantyPeriod || ''} readOnly />
                    </div>
                </div>
            </div>
            <div className="clear-form">
                <button className="clear-button" onClick={onClear}>Clear Form</button>
            </div>
        </div>
    );
};

export default DeviceForm;