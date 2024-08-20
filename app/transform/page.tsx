//@ts-nocheck
'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SpeechToTextTerminal = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState('fa-IR');
    const [status, setStatus] = useState('Ready');
    const [logs, setLogs] = useState([]);
    const [logCounter, setLogCounter] = useState(1);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [location, setLocation] = useState(null);
    const recognitionRef = useRef(null);
    const terminalRef = useRef(null);
    const inputRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const requestPermissions = async () => {
            // درخواست دسترسی به لوکیشن
            try {
                await navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Location access denied:', error.message);
                    }
                );
            } catch (error) {
                console.error('Error requesting location access:', error);
            }

            // درخواست دسترسی به میکروفون و دوربین (برای مرورگرهایی که از WebRTC پشتیبانی می‌کنند)
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            } catch (error) {
                console.error('Microphone or camera access denied:', error.message);
            }
        };

        requestPermissions();
    }, []);

    const addLog = (message) => {
        const currentTime = new Date().toLocaleTimeString();
        const logMessage = `${logCounter}: [${currentTime}] ${message}`;
        setLogs((prevLogs) => [...prevLogs, logMessage]);
        setLogCounter((prevCounter) => prevCounter + 1);
    };

    const clearLogs = () => {
        setLogs([]);
        setLogCounter(1);
        addLog('Logs cleared.');
    };

    const startListening = () => {
        if (!recognitionRef.current) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;

            recognition.onstart = () => {
                setStatus('Listening');
                addLog('Started listening...');
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPart = event.results[i][0].transcript;
                    if (transcriptPart && transcriptPart.trim() !== '') {
                        if (event.results[i].isFinal) {
                            const cleanedText = transcriptPart.replace(/undefined/g, '').trim();
                            setTranscript((prev) => (prev + cleanedText + ' ').replace(/undefined/g, ''));
                            setStatus('Typing');
                            addLog(`Final result: ${cleanedText}`);
                        } else {
                            interimTranscript += transcriptPart.replace(/undefined/g, '');
                        }
                    }
                }
            };

            recognition.onerror = (event) => {
                setStatus('Error');
                addLog(`Error: ${event.error}`);
            };

            recognition.onend = () => {
                setListening(false);
                setStatus('Ready');
                addLog('Stopped listening.');
            };

            recognitionRef.current = recognition;
        }

        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setListening(true);
        setStatus('Listening');
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setListening(false);
        setStatus('Ready');
        addLog('Stopped listening.');
    };

    const toggleFullscreen = () => {
        const elem = terminalRef.current;

        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const switchLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'fa-IR' ? 'en-US' : 'fa-IR'));
        stopListening();
        setTranscript('');
        setStatus('Ready');
        addLog(`Language switched to ${language === 'fa-IR' ? 'English' : 'Persian'}`);
    };

    const recognizeAndExecuteCommand = () => {
        addLog('Listening for a command...');
        startListening();

        setTimeout(() => {
            stopListening();
            const recognizedCommand = transcript.trim().toLowerCase();
            addLog(`Recognized command: ${recognizedCommand}`);
            handleCommand(recognizedCommand);
        }, 5000);
    };

    const downloadFile = async (url) => {
        try {
            const startTime = performance.now(); // ثبت زمان شروع دانلود
            const response = await axios.get(url, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded / total) * 100);
                    const elapsedTime = (performance.now() - startTime) / 1000; // محاسبه زمان گذشته
                    const speed = (loaded / elapsedTime / 1024).toFixed(2); // سرعت دانلود به کیلوبایت بر ثانیه
                    addLog(`Downloading: ${percentage}% of ${Math.floor(total / 1024)} KB at ${speed} KB/s`);
                },
            });

            const endTime = performance.now();
            const ping = (endTime - startTime).toFixed(2); // محاسبه پینگ

            const fileName = url.split('/').pop();
            FileSaver.saveAs(response.data, fileName);
            addLog(`Downloaded file: ${fileName} | Ping: ${ping} ms`);
        } catch (error) {
            addLog(`Download error: ${error}`);
            setStatus('Download failed');
        }
    };

    const handleCommand = async (command) => {
        if (command.trim() !== '') {
            setHistory((prevHistory) => [...prevHistory, command]);
            setHistoryIndex(-1);
        }

        if (command.startsWith('dl ')) {
            const url = command.slice(3).trim();
            if (url) {
                await downloadFile(url);
            } else {
                addLog('No URL provided for download.');
            }
            return;
        }

        switch (command.trim().toLowerCase()) {
            case 'start':
                startListening();
                break;
            case 'stop':
                stopListening();
                break;
            case 'clear':
                clearLogs();
                break;
            case 'copy':
                navigator.clipboard?.writeText(transcript).then(() => {
                    setStatus('Text copied to clipboard!');
                    addLog('Text copied to clipboard.');
                }).catch(err => {
                    setStatus('Failed to copy text: ' + err);
                    addLog(`Failed to copy text: ${err}`);
                });
                break;
            case 'fullscreen':
                toggleFullscreen();
                break;
            case 'switch':
                switchLanguage();
                break;
            case 'recognize':
                recognizeAndExecuteCommand();
                break;
            case 'status':
                setStatus(`Current status: ${status}`);
                addLog(`Current status: ${status}`);
                break;
            case 'power':
                toggleFullscreen();
                break;
            case 'trans-ir':
                const persianText = await translateText(transcript, 'fa');
                setTranscript(persianText);
                setStatus('Translated to Persian');
                addLog(`Translated to Persian: ${persianText}`);
                break;
            case 'trans-en':
                const englishText = await translateText(transcript, 'en');
                setTranscript(englishText);
                setStatus('Translated to English');
                addLog(`Translated to English: ${englishText}`);
                break;
            case 'info':
                const deviceSpecs = getDeviceSpecs();
                let locationString = 'Location data unavailable';

                if (location && location.latitude && location.longitude) {
                    locationString = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;

                    // ساخت URL نقشه
                    const mapUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=12`;
                    // باز کردن نقشه در تب جدید
                    window.open(mapUrl, '_blank');
                }
                setStatus(`Device Specs: ${deviceSpecs} | Location: ${locationString}`);
                addLog(`Device Specs: ${deviceSpecs} | Location: ${locationString}`);
                break;
            case 'help':
                setStatus(`Available commands:
                - start: Begin speech recognition.
                - stop: End speech recognition.
                - clear: Clear the logs.
                - copy: Copy the transcript to clipboard.
                - fullscreen: Toggle fullscreen mode.
                - switch: Switch language between Persian and English.
                - recognize: Recognize the current command.
                - status: Display the current status.
                - power: Toggle fullscreen mode.
                - trans-ir: Translate transcript to Persian.
                - trans-en: Translate transcript to English.
                - dl <url>: Download the file from the provided URL.
                - info: Show device specs and location.
                - help: Show this help message.`);
                addLog(`Available commands:
                - start: Begin speech recognition.
                - stop: End speech recognition.
                - clear: Clear the logs.
                - copy: Copy the transcript to clipboard.
                - fullscreen: Toggle fullscreen mode.
                - switch: Switch language between Persian and English.
                - recognize: Recognize the current command.
                - status: Display the current status.
                - power: Toggle fullscreen mode.
                - trans-ir: Translate transcript to Persian.
                - trans-en: Translate transcript to English.
                - dl <url>: Download the file from the provided URL.
                - info: Show device specs and location.
                - help: Show this help message.`);
                break;
            default:
                setStatus(`Unknown command: ${command}`);
                addLog(`Unknown command: ${command}`);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const command = event.target.value.trim();
            if (command) {
                handleCommand(command);
            }
            event.target.value = '';
        } else if (event.key === 'ArrowUp') {
            if (historyIndex === -1) {
                setHistoryIndex(history.length - 1);
            } else if (historyIndex > 0) {
                setHistoryIndex((prevIndex) => prevIndex - 1);
            }
            if (history[historyIndex]) {
                event.target.value = history[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex < history.length - 1) {
                setHistoryIndex((prevIndex) => prevIndex + 1);
            } else {
                setHistoryIndex(-1);
                event.target.value = '';
            }
            if (history[historyIndex]) {
                event.target.value = history[historyIndex];
            }
        }
    };

    const getDeviceSpecs = () => {
        return `Platform: ${navigator.platform}, User Agent: ${navigator.userAgent}`;
    };

    const getLocation = async () => {
        if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    },
                    (error) => {
                        reject(`Location access denied: ${error.message}`);
                    }
                );
            });
        } else {
            return 'Geolocation is not supported by this browser.';
        }
    };

    const translateText = async (text, targetLang) => {
        // You should implement this function to translate text using an API or library
        // For example, you can use Google Translate API or any other translation service
        // For now, it's just a placeholder
        return text; // This should be replaced with actual translation logic
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        document.title = `Status: ${status}`; // تغییر عنوان صفحه به وضعیت کنونی
    }, [status]);

    return (
        <div ref={terminalRef} style={{
            backgroundColor: '#222',
            color: '#0f0',
            padding: '20px',
            borderRadius: '5px',
            height: '100vh',
            overflowY: 'auto'
        }}>
            {/*<h3>Speech to Text Terminal</h3>*/}
            <div style={{marginTop: '10px',paddingBottom:'40px', whiteSpace: 'pre-wrap'}}>
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
            <div className={'fixed bottom-0 left-0 w-full'}>
                <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command..."
                    className={''}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#333',
                        color: '#0f0',
                        border: 'none',
                        borderRadius: '5px',
                        outline: 'none',
                    }}
                />
            </div>
        </div>
    );
};

export default SpeechToTextTerminal;
