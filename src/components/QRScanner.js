import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import '../styles/QRScanner.css';
import successSound from '../assets/sounds/beep_success.ogg';
import failSound from '../assets/sounds/beep_fail.ogg';
import { Howl } from 'howler';

const QRScanner = ({ onScanResult }) => {
  const [scanMethod, setScanMethod] = useState('file');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const successAudioRef = useRef(new Audio(successSound));
  const failAudioRef = useRef(new Audio(failSound));

useEffect(() => {
  successAudioRef.current.preload = 'auto';
  failAudioRef.current.preload = 'auto';
}, []);

  useEffect(() => {
    if (scanMethod === 'live') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMethod]);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      //This button toggles the facingMode between 'environment' and 'user' and restarts the camera with the updated facing mode.
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }
      scanQRCode();
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please grant camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (scanMethod !== 'live' || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleScan({ text: code.data });
        }
      }
      requestAnimationFrame(scan);
    };

    requestAnimationFrame(scan);
  };

 const playSound = (isSuccess) => {
    const audio = isSuccess ? successAudioRef.current : failAudioRef.current;
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(e => {
        console.error('Error playing sound:', e);
        // Handle the error, e.g., show a message to the user
      });
    });
    audio.load();
  };

  const handleScan = (result) => {
    if (result && result.text) {
      console.log('Raw scan result:', result);
      try {
        const jsonStr = result.text.replace(/'/g, '"');
        const parsedData = JSON.parse(jsonStr);

        console.log('Parsed QR data:', parsedData);
        onScanResult(parsedData);
        setError('');
        setScanStatus('success');
        setScanSuccess(true);
        playSound(true);

        setTimeout(() => {
          setScanSuccess(false);
        }, 2000);

        setTimeout(() => setScanStatus(null), 3000);
      } catch (err) {
        console.error('Error parsing QR data:', err);
        setError('Invalid QR code format. Please scan a valid device QR code.');
        setScanStatus('error');
        playSound(false);

        setTimeout(() => setScanStatus(null), 3000);
      }
    }
  };

  const handleFileInput = async (file) => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const imageData = await readFileAsImageData(file);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR Code detected:', code.data);
        handleScan({ text: code.data });
      } else {
        setError('No QR code found in the image. Please try another image.');
        setScanStatus('error');
        playSound(false);
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error processing file. Please try again.');
      setScanStatus('error');
      playSound(false);
    } finally {
      setLoading(false);
    }
  };

  const readFileAsImageData = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileInput(files[0]);
    }
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-controls">
        <button
          className={`scanner-button ${scanMethod === 'live' ? 'active' : ''}`}
          onClick={() => setScanMethod('live')}
        >
          <span className="icon">📷</span>
          Live Scanner
        </button>
        <button
          className={`scanner-button ${scanMethod === 'file' ? 'active' : ''}`}
          onClick={() => setScanMethod('file')}
        >
          <span className="icon">📁</span>
          File Upload
        </button>
      </div>

      {scanStatus && (
        <p className={`scan-status ${scanStatus}`}>
          {scanStatus === 'success' ? '✅ Scan Successful' : '❌ Scan Failed'}
        </p>
      )}

      {error && (
        <div className="error-message">
          <span className="icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="scanner-container">
        {scanMethod === 'live' ? (
          <div className="live-scanner-wrapper">
            <video ref={videoRef} className="qr-video" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="scanner-overlay">
              <div className={`scanner-frame ${scanSuccess ? 'success' : ''}`}></div>
            </div>
          </div>
        ) : (
          <div
            className={`file-upload ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFileInput(event.target.files[0])}
              ref={fileInputRef}
              className="file-input"
            />
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              {loading ? (
                <div className="loading-spinner">Processing...</div>
              ) : (
                <>
                  <span className="upload-icon" alt="Upload">📤</span>
                  <p>Click or drag image here</p>
                  <small>Supports PNG, JPG, JPEG</small>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;