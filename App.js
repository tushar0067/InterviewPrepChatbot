import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Settings from './Setting';
import Dashboard from './Dashboard';
import History from './Histroy';
import About from './About';

// --- Helper Components ---
const Typewriter = ({ text, onComplete, chatContainerRef }) => {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [displayedText, chatContainerRef]);

    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        const parts = fullText.split(/(\s+|<br>)/).filter(part => part.length > 0);
        let i = 0;
        let isCancelled = false;

        const intervalId = setInterval(() => {
            if (i < parts.length && !isCancelled) {
                setDisplayedText(parts.slice(0, i + 1).join(''));
                i++;
            } else {
                clearInterval(intervalId);
                if (onComplete && !isCancelled) {
                    onComplete();
                }
            }
        }, 50); // Typing speed

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, [fullText, onComplete]);

    return <p classNamee="text-sm" dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

// --- Main App Component ---
function App() {
    // --- State Management ---
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('base'); // sm, base, lg
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activePage, setActivePage] = useState('playground');
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'ai',
            text: "Hello! I am your Interview Prep Coach . Ask me anything about Interview Prep.!"
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [pdfTextContext, setPdfTextContext] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const abortControllerRef = useRef(null);


    // --- API Configuration ---
    // FIX: API key is now loaded securely from an environment variable
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const SYSTEM_INSTRUCTION = `You are a  Interview Preparation Coach . You have to only answer correctly to any interview  related problem only like  'Practice behavioral questions with feedback.
System design whiteboarding sessions.
Resume suggestions from uploaded PDF.
Tracks user progress + gives custom advice.' and you can answer naming problem like twosum threesum or djikstra or course schedule problem  . If anyone asks about anything other than interview prep, you have to behave politely and say something like ' You asked me an irrelevant question. Ask me about Interview Prep only, I am an Interview Prep Coach!'.  Use more examples like this yourself  everytime  create a new similiar example  but don't be rude. Give a medium-length answer, not too short, not too long. Give me back the answer.`;

    // --- Effects ---
    useEffect(() => {
        if (chatContainerRef.current && !isLoading) { // Only scroll on history change if not loading
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        const styleId = 'sidebar-dynamic-styles';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.innerHTML = `
            :root {
                --sidebar-width-expanded: 16rem;
                --sidebar-width-collapsed: 5rem;
            }
            main {
                margin-left: ${isSidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)'};
                transition: margin-left 0.3s ease-in-out;
            }
        `;
    }, [isSidebarCollapsed]);

    // --- Handlers & Logic ---
    const handlePageChange = (page) => setActivePage(page);

    const handleFileSelect = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        setIsFileUploaderOpen(false);
        setChatHistory(prev => [...prev, { role: 'user', text: `Processing file: ${file.name}` }]);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            try {
                const pdfData = new Uint8Array(reader.result);
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }

                setPdfTextContext(fullText);
                setUploadedFileName(file.name);
                setChatHistory(prev => [...prev, { role: 'ai', text: `I've finished reading "${file.name}". What would you like to know about it?` }]);

            } catch (error) {
                console.error("Error processing PDF:", error);
                setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't read the content of that PDF." }]);
            }
        };

        reader.onerror = () => {
            console.error("File reading error:", reader.error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, there was an error reading the file." }]);
        };
    };


    const handleDragEvents = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const getGeminiResponse = async (prompt) => {
        abortControllerRef.current = new AbortController();
        const payload = {
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("API Error Response:", errorBody);
                return `Error: The API call failed with status ${response.status}. Check the console for details.`;
            }
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else if (data.promptFeedback) {
                console.error("API Feedback:", data.promptFeedback);
                return "The response was blocked due to safety settings. Please check the console.";
            }
            return "Sorry, I couldn't get a response. Please try again.";
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log("API request was aborted.");
                return "Response generation stopped.";
            }
            console.error("Fetch Error:", error);
            return "A network error occurred. Please check your connection and the console.";
        }
    };

    const handleUserRequest = async () => {
        const userText = userInput.trim();
        if (!userText || isLoading) return;
        if (!API_KEY) {
            setChatHistory(prev => [...prev, { role: 'ai', text: "ERROR: API key is missing. Please create a .env file and add your API key to enable live responses." }]);
            return;
        }
        
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
        setUserInput('');

        let finalPrompt = userText;
        if (pdfTextContext) {
            finalPrompt = `Based on the following document text, please answer the user's question.\n\n--- DOCUMENT TEXT ---\n${pdfTextContext}\n\n--- USER'S QUESTION ---\n${userText}`;
        }

        try {
            const aiResponse = await getGeminiResponse(finalPrompt);
            setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Error in API response flow:", error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "A critical error occurred. Check the console for details." }]);
            setIsLoading(false);
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserRequest();
        }
    };

    // --- Render Methods ---
    const renderHeaderTitle = () => {
        const titles = { playground: 'Interview Preparation Coach', dashboard: 'Dashboard', history: 'Chat History', settings: 'Settings', about: 'About' };
        return <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{titles[activePage]}</h1>;
    };

    const navLinks = [
        { id: 'dashboard', icon: 'fa-tachometer-alt', text: 'Dashboard' },
        { id: 'history', icon: 'fa-history', text: 'History' },
        { id: 'playground', icon: 'fa-laptop-code', text: 'Playground' },
        { id: 'settings', icon: 'fa-cog', text: 'Settings' },
        { id: 'about', icon: 'fa-info-circle', text: 'About' },
    ];

    const lightTheme = {
        bg: 'bg-gray-50',
        text: 'text-gray-800',
        sidebarBg: 'bg-white/80',
        sidebarText: 'text-gray-800',
        sidebarLink: 'text-gray-600',
        sidebarLinkHover: 'hover:bg-indigo-100 hover:text-indigo-600',
        sidebarLinkActive: 'bg-indigo-100 text-indigo-600',
        headerBorder: 'border-gray-200',
        chatBg: 'bg-white',
        chatUserBubble: 'bg-indigo-600 text-white',
        chatAiBubble: 'bg-indigo-100',
        inputBg: 'bg-gray-100',
        inputText: 'text-gray-800',
        button: 'bg-indigo-600 text-white hover:bg-indigo-500',
        icon: 'text-indigo-600',
        secondaryIcon: 'text-gray-500 hover:text-gray-900',
        upgradeBg: 'bg-indigo-50/50',
        contextBg: 'bg-indigo-100',
        contextText: 'text-indigo-800',
        contextIcon: 'text-indigo-600 hover:text-indigo-800',
    };

    const darkTheme = {
        bg: 'bg-slate-900',
        text: 'text-slate-200',
        sidebarBg: 'bg-slate-800/50',
        sidebarText: 'text-white',
        sidebarLink: 'text-slate-400',
        sidebarLinkHover: 'hover:bg-slate-700 hover:text-white',
        sidebarLinkActive: 'bg-slate-700 text-white',
        headerBorder: 'border-slate-700',
        chatBg: 'bg-slate-800',
        chatUserBubble: 'bg-indigo-600 text-white',
        chatAiBubble: 'bg-slate-700',
        inputBg: 'bg-slate-700',
        inputText: 'text-white',
        button: 'bg-indigo-600 text-white hover:bg-indigo-500',
        icon: 'text-indigo-500',
        secondaryIcon: 'text-slate-400 hover:text-white',
        upgradeBg: 'bg-slate-700/50',
        contextBg: 'bg-slate-700',
        contextText: 'text-slate-200',
        contextIcon: 'text-slate-400 hover:text-white',
    };
    
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const fontSizeClass = `text-${fontSize}`;

    return (
        <div className={`h-screen ${currentTheme.bg} ${currentTheme.text} font-sans ${fontSizeClass}`}>
            <aside className={`sidebar fixed top-0 left-0 h-full ${currentTheme.sidebarBg} backdrop-blur-sm flex flex-col p-4 border-r ${currentTheme.headerBorder} transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                <div className={`sidebar-header flex items-center gap-3 mb-8 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                    <i className={`fas fa-terminal text-2xl ${currentTheme.icon}`}></i>
                    {!isSidebarCollapsed && <h1 className={`sidebar-header-text text-xl font-bold ${currentTheme.sidebarText} whitespace-nowrap`}>Interview Pro</h1>}
                </div>
                <nav className="flex flex-col gap-2">
                    {navLinks.map(link => (
                        <a key={link.id} href="#" className={`sidebar-link flex items-center gap-3 p-3 rounded-lg transition-colors ${currentTheme.sidebarLinkHover} ${activePage === link.id ? currentTheme.sidebarLinkActive : currentTheme.sidebarLink} ${isSidebarCollapsed ? 'justify-center' : ''}`} onClick={(e) => { e.preventDefault(); handlePageChange(link.id); }}>
                            <i className={`fas ${link.icon} w-5 text-center`}></i>
                            {!isSidebarCollapsed && <span className="whitespace-nowrap">{link.text}</span>}
                        </a>
                    ))}
                </nav>
                <div className={`mt-auto ${isSidebarCollapsed ? 'hidden' : ''}`}>
                    <div className={`upgrade-box p-4 ${currentTheme.upgradeBg} rounded-lg`}>
                        <h3 className={`font-bold ${currentTheme.sidebarText}`}>Upgrade to Pro</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-3">Get unlimited access to all features.</p>
                        <button className={`w-full ${currentTheme.button} py-2 rounded-lg transition-colors`}>Upgrade</button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen">
                <header className={`flex items-center p-4 border-b ${currentTheme.headerBorder} flex-shrink-0`}>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`${currentTheme.secondaryIcon} mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700`}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div id="header-title" className="text-center flex-1">{renderHeaderTitle()}</div>
                    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`${currentTheme.secondaryIcon} ml-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700`}>
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto relative">
                    {/* Page Content: Conditionally render using CSS 'hidden' class */}
                    <div className={activePage === 'dashboard' ? '' : 'hidden'}>
                        <Dashboard chatHistory={chatHistory} theme={currentTheme} />
                    </div>
                    <div className={activePage === 'history' ? '' : 'hidden'}>
                        <History chatHistory={chatHistory} theme={currentTheme} apiKey={API_KEY} apiURL={API_URL} />
                    </div>
                    <div className={activePage === 'settings' ? '' : 'hidden'}>
                        <Settings theme={theme} setTheme={setTheme} currentTheme={currentTheme} fontSize={fontSize} setFontSize={setFontSize} />
                    </div>
                     <div className={activePage === 'about' ? '' : 'hidden'}>
                        <About theme={currentTheme} />
                    </div>
                    <div className={`w-full max-w-4xl mx-auto p-4 h-full flex-col ${activePage === 'playground' ? 'flex' : 'hidden'}`}>
                        <div className={`${currentTheme.chatBg} rounded-2xl shadow-lg flex flex-col flex-1`}>
                            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto chat-container space-y-4">
                                {chatHistory.map((msg, index) => {
                                    const isLastMessage = index === chatHistory.length - 1;
                                    return (
                                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            {msg.role === 'ai' && <div className={`p-2 rounded-full flex-shrink-0 ${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}`}><i className={`fas fa-robot ${currentTheme.icon}`}></i></div>}
                                            <div className={`${msg.role === 'user' ? currentTheme.chatUserBubble : currentTheme.chatAiBubble} rounded-lg p-3 max-w-lg`}>
                                                {msg.role === 'ai' && isLastMessage && isLoading ? 
                                                    <Typewriter text={msg.text} onComplete={() => setIsLoading(false)} chatContainerRef={chatContainerRef} /> :
                                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') }} />
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                                {isLoading && chatHistory[chatHistory.length - 1].role === 'user' && (
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full flex-shrink-0 ${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}`}><i className={`fas fa-robot ${currentTheme.icon}`}></i></div>
                                        <div className={`${currentTheme.chatAiBubble} rounded-lg p-3 max-w-lg`}><div className="loader"></div></div>
                                    </div>
                                )}
                            </div>
                            <div className={`p-4 border-t ${currentTheme.headerBorder} ${currentTheme.chatBg} sticky bottom-0`}>
                                {uploadedFileName && (
                                    <div className={`flex items-center justify-between ${currentTheme.contextBg} ${currentTheme.contextText} p-2 rounded-lg mb-2 text-sm`}>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <i className="fas fa-file-alt flex-shrink-0"></i>
                                            <span className="truncate">Ready: <strong>{uploadedFileName}</strong></span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPdfTextContext('');
                                                setUploadedFileName(null);
                                            }}
                                            className={`${currentTheme.contextIcon} flex-shrink-0`}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}
                                <div className={`flex items-center gap-3 ${currentTheme.inputBg} rounded-lg p-2`}>
                                    <button
                                        className={`${currentTheme.secondaryIcon} p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600`}
                                        onClick={() => setIsFileUploaderOpen(true)}
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-paperclip"></i>
                                    </button>
                                    <textarea id="userInput" className={`flex-1 bg-transparent ${currentTheme.inputText} focus:outline-none resize-none p-2`} rows="1" placeholder="Ask a question or upload your resume..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyPress} disabled={isLoading} />
                                    <button 
                                        className={`${currentTheme.button} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 btn-glow disabled:opacity-50 disabled:cursor-not-allowed`} 
                                        onClick={isLoading ? handleStopGeneration : handleUserRequest}
                                    >
                                        {isLoading ? <i className="fas fa-stop"></i> : <i className="fas fa-paper-plane"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* File Uploader Drawer */}
                    {isFileUploaderOpen && (
                        <div 
                            className="fixed inset-0 bg-gray-800/50 backdrop-blur-md flex items-center justify-center z-20"
                            onClick={() => setIsFileUploaderOpen(false)}
                        >
                            <div 
                                className="p-4 max-w-2xl w-full mx-auto relative"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            >
                                <button onClick={() => setIsFileUploaderOpen(false)} className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg text-gray-600 hover:text-gray-900 z-10">
                                    <i className="fas fa-times fa-lg"></i>
                                </button>
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-900/50' : 'border-gray-600'}`}
                                    onDragEnter={handleDragEvents}
                                    onDragOver={handleDragEvents}
                                    onDragLeave={handleDragEvents}
                                    onDrop={handleDrop}
                                >
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf"
                                        onChange={(e) => handleFileSelect(e.target.files[0])}
                                    />
                                    <i className="fas fa-file-pdf text-5xl text-gray-500 mb-4"></i>
                                    <p className="text-lg font-semibold text-white">Drag & drop your resume here</p>
                                    <p className="text-gray-400">or</p>
                                    <button 
                                        className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        Browse Files
                                    </button>
                                    <p className="text-xs text-gray-500 mt-4">Only PDF files are accepted</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- Mount the App to the DOM ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
