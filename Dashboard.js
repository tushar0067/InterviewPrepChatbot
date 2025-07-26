import React from 'react';

// This component displays dummy analytics based on the chat history.
const Dashboard = ({ chatHistory, theme }) => {
    // Dummy analysis logic
    const userMessages = chatHistory.filter(msg => msg.role === 'user');
    const aiMessages = chatHistory.filter(msg => msg.role === 'ai');

    const totalQuestions = userMessages.length;
    const avgResponseLength = aiMessages.length > 0
        ? Math.round(aiMessages.reduce((acc, msg) => acc + msg.text.split(' ').length, 0) / aiMessages.length)
        : 0;

    // Dummy topic extraction
    const topics = ['Resume Review', 'System Design', 'Behavioral Questions', 'Algorithms'];

    return (
        <div className="p-8">
            <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Questions Card */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>Total Questions Asked</h3>
                    <p className={`text-4xl font-bold mt-2 ${theme.icon}`}>{totalQuestions}</p>
                </div>

                {/* Average Response Length Card */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>Avg. Response Length</h3>
                    <p className={`text-4xl font-bold mt-2 ${theme.icon}`}>{avgResponseLength} words</p>
                </div>

                {/* Topics Covered Card */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1`}>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>Topics Covered</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {topics.map(topic => (
                            <span key={topic} className={`px-3 py-1 text-sm rounded-full ${theme.sidebarLinkActive}`}>
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
