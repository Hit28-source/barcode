import { useState } from 'react';

const useScanner = () => {
    const [formData, setFormData] = useState({
        DeviceID: '',
        DeviceName: '',
        MQTT_IP: '',
        MQTT_UserName: '',
        MQTT_Password: '',
        MQTT_Topic: '',
        MQTT_MacID: '',
        Status: '',
        MQTT_Port: '',
        WarrantyStartDate: '',
        WarrantyPeriod: '',
        SerialNumber: '',
    });

    const handleScanResult = (parsedData) => {
        console.log('Setting form data:', parsedData);
        setFormData({
            ...formData,
            DeviceID: parsedData.DeviceID || '',
            DeviceName: parsedData.DeviceName || '',
            MQTT_IP: parsedData.MQTT_IP || '',
            MQTT_UserName: parsedData.MQTT_UserName || '',
            MQTT_Password: parsedData.MQTT_Password || '',
            MQTT_Topic: parsedData.MQTT_Topic || '',
            MQTT_MacID: parsedData.MQTT_MacID || '',
            Status: parsedData.Status || '',
            MQTT_Port: parsedData.MQTT_Port || '',
            WarrantyStartDate: parsedData.WarrantyStartDate || '',
            WarrantyPeriod: parsedData.WarrantyPeriod || '',
            SerialNumber: parsedData.SerialNumber || '',
        });
        console.log('Form data in useScanner:', formData);
    };

    const clearForm = () => {
        setFormData({
            DeviceID: '',
            DeviceName: '',
            MQTT_IP: '',
            MQTT_UserName: '',
            MQTT_Password: '',
            MQTT_Topic: '',
            MQTT_MacID: '',
            Status: '',
            MQTT_Port: '',
            WarrantyStartDate: '',
            WarrantyPeriod: '',
            SerialNumber: '',
        });
    };

    return {
        formData,
        handleScanResult,
        clearForm,
    };
};

export default useScanner;