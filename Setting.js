import React from 'react';

// This component provides UI controls for application settings.
const Settings = ({ theme, setTheme, currentTheme, fontSize, setFontSize }) => {
    const fontSizes = [
        { id: 'sm', name: 'Small' },
        { id: 'base', name: 'Medium' },
        { id: 'lg', name: 'Large' },
    ];

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${currentTheme.text}`}>Settings</h2>
            
            <div className="space-y-8">
                {/* Theme Switcher */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Appearance</h3>
                        <p className={`text-sm ${currentTheme.secondaryIcon}`}>Switch between light and dark mode.</p>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Language Selection */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Language</h3>
                        <p className={`text-sm ${currentTheme.secondaryIcon}`}>Choose your preferred language.</p>
                    </div>
                    <select className={`${currentTheme.inputBg} ${currentTheme.inputText} rounded-md p-2 border ${currentTheme.headerBorder} focus:ring-2 focus:ring-indigo-500`}>
                        <option>English</option>
                        <option disabled>Español (coming soon)</option>
                        <option disabled>Français (coming soon)</option>
                    </select>
                </div>

                {/* Font Size Control */}
                <div className="flex items-center justify-between">
                     <div>
                        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Font Size</h3>
                        <p className={`text-sm ${currentTheme.secondaryIcon}`}>Adjust for better readability.</p>
                    </div>
                    <div className={`flex items-center gap-1 p-1 rounded-lg ${currentTheme.inputBg}`}>
                        {fontSizes.map(size => (
                             <button 
                                key={size.id}
                                onClick={() => setFontSize(size.id)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${fontSize === size.id ? currentTheme.sidebarLinkActive : ''}`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
