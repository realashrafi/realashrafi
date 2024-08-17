//@ts-nocheck
'use client'
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SpeechToTextTerminal = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState('fa-IR');
    const [status, setStatus] = useState('Ready');
    const [logs, setLogs] = useState([]);
    const [logCounter, setLogCounter] = useState(1);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const recognitionRef = useRef(null);
    const terminalRef = useRef(null);
    const inputRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
        }, 5000); // بعد از ۵ ثانیه تشخیص را متوقف کرده و دستور را اجرا می‌کند
    };

    const translateText = async (text, targetLang) => {
        try {
            const response = await axios.post('https://libretranslate.de/translate', {
                q: text,
                source: 'auto',
                target: targetLang,
                format: 'text'
            });
            return response.data.translatedText;
        } catch (error) {
            addLog(`Translation error: ${error}`);
            return text;
        }
    };

    const handleCommand = async (command) => {
        if (command.trim() !== '') {
            setHistory((prevHistory) => [...prevHistory, command]);
            setHistoryIndex(-1);
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
            case 'help':
                setStatus(`Available commands:
                    - start: Begin speech recognition.
                    - stop: End speech recognition.
                    - clear: Clear the logs.
                    - copy: Copy the transcript to clipboard.
                    - fullscreen: Toggle fullscreen mode.
                    - switch: Switch language between Persian and English.
                    - recognize: Recognize the current music.
                    - status: Display the current status.
                    - power: Toggle fullscreen mode.
                    - trans-ir: Translate transcript to Persian.
                    - trans-en: Translate transcript to English.
                    - help: Show this help message.`);
                addLog(`Available commands:
                    - start: Begin speech recognition.
                    - stop: End speech recognition.
                    - clear: Clear the logs.
                    - copy: Copy the transcript to clipboard.
                    - fullscreen: Toggle fullscreen mode.
                    - switch: Switch language between Persian and English.
                    - recognize: Recognize the current music.
                    - status: Display the current status.
                    - power: Toggle fullscreen mode.
                    - trans-ir: Translate transcript to Persian.
                    - trans-en: Translate transcript to English.
                    - help: Show this help message.`);
                break;
            default:
                setStatus(`Unknown command: ${command}`);
                addLog(`Unknown command: ${command}`);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = inputRef.current.innerText;
            handleCommand(command);
            inputRef.current.innerText = '';
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHistoryIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHistoryIndex((prevIndex) => Math.min(prevIndex + 1, history.length - 1));
        }
    };

    useEffect(() => {
        const terminalElement = terminalRef.current;
        if (terminalElement) {
            terminalElement.scrollTop = terminalElement.scrollHeight;
        }
    }, [logs, transcript]);

    useEffect(() => {
        if (historyIndex >= 0 && historyIndex < history.length) {
            inputRef.current.innerText = history[historyIndex];
        }
    }, [historyIndex, history]);

    return (
        <div
            ref={terminalRef}
            className={`flex w-full min-h-96 flex-col ${isFullscreen ? 'fixed top-0 left-0' : 'justify-center items-center'}`}
            style={{
                backgroundColor: '#1f2937',
                color: 'white',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {isFullscreen ? (
                <>
                    <div className="w-full bg-gray-900 text-center py-2 rounded-t-md font-mono">
                        Terminal ({language === 'fa-IR' ? 'Persian' : 'English'})
                    </div>
                    <div
                        className="flex-1 bg-black text-green-500 p-4 font-mono text-sm overflow-y-auto"
                        style={{position: 'relative'}}
                    >
                        {logs.map((log, index) => (
                            <p key={index} className="m-0">{log}</p>
                        ))}
                        <div
                            ref={inputRef}
                            contentEditable
                            onKeyDown={handleKeyDown}
                            className="w-full p-2 mt-4 bg-gray-700 text-white rounded-md border border-gray-600"
                            style={{
                                boxSizing: 'border-box',
                                zIndex: 10,
                            }}
                        />
                    </div>
                </>
            ) : (
                <div
                    ref={inputRef}
                    contentEditable
                    onKeyDown={handleKeyDown}
                    className="w-4/5 p-2 bg-gray-700 text-white rounded-md border border-gray-600"
                    style={{
                        boxSizing: 'border-box',
                        zIndex: 10,
                        maxWidth: '800px',
                        maxHeight: '500px',
                        overflow: 'hidden',
                    }}
                />
            )}
        </div>
    );
};

export default SpeechToTextTerminal;
