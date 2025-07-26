import React, { useState, useEffect } from 'react';

// This component generates and displays summaries of chat history.
const History = ({ chatHistory, theme, apiKey, apiURL }) => {
    const [summaries, setSummaries] = useState({});
    const [isSummarizing, setIsSummarizing] = useState(false);

    // Function to get a summary for a single piece of text from the API.
    const getSummary = async (text) => {
        const prompt = `Summarize the following user query in 5 words or less, providing only the summary text:\n\n"${text}"`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) return "Could not summarize.";
            const data = await response.json();
            return data.candidates[0]?.content?.parts[0]?.text || "Summary unavailable.";
        } catch (error) {
            console.error("Error fetching summary:", error);
            return "Summary failed.";
        }
    };

    // Effect to generate summaries for new user messages in the chat history.
    useEffect(() => {
        const generateSummaries = async () => {
            setIsSummarizing(true);
            const userMessages = chatHistory.filter(msg => msg.role === 'user');
            const newSummaries = { ...summaries };
            let hasNewSummaries = false;

            for (const message of userMessages) {
                if (!newSummaries[message.text]) { // Only fetch if summary doesn't exist
                    newSummaries[message.text] = await getSummary(message.text);
                    hasNewSummaries = true;
                }
            }

            if (hasNewSummaries) {
                setSummaries(newSummaries);
            }
            setIsSummarizing(false);
        };

        if (apiKey) {
            generateSummaries();
        }
    }, [chatHistory, apiKey, apiURL]);

    const userChats = chatHistory.filter(msg => msg.role === 'user');

    return (
        <div className="p-8">
            <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>Chat History</h2>
            {userChats.length === 0 ? (
                <p className={theme.secondaryIcon}>No chat history yet. Start a conversation in the Playground!</p>
            ) : (
                <div className="space-y-4">
                    {userChats.map((message, index) => (
                        <div key={index} className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${theme.chatAiBubble}`}>
                            <h3 className={`font-semibold text-lg ${theme.text}`}>
                                {summaries[message.text] || 'Generating summary...'}
                            </h3>
                            <p className={`text-sm opacity-60 mt-1 truncate ${theme.text}`}>
                                You asked: "{message.text}"
                            </p>
                        </div>
                    ))}
                    {isSummarizing && <p className={`text-sm ${theme.secondaryIcon}`}>Updating summaries...</p>}
                </div>
            )}
        </div>
    );
};

export default History;
