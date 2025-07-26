import React from 'react';

// This component displays information about the application.
const About = ({ theme }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>About AI Interview Coach</h2>
            
            <div className="space-y-8">
                {/* App Description */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold mb-2 ${theme.icon}`}>🔹 App Description</h3>
                    <p className={`${theme.text} leading-relaxed`}>
                        AI Interview Coach is your smart companion for acing job interviews. It helps you practice behavioral questions, system design, and coding interviews with real-time AI feedback.
                    </p>
                </div>

                {/* Key Features */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold mb-3 ${theme.icon}`}>🔹 Key Features</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>📄 PDF Resume analysis with instant feedback</li>
                        <li>🤖 Real-time AI interview questions & coaching</li>
                        <li>📊 Track your progress and improve answers</li>
                        <li>🧠 Powered by Google Gemini</li>
                    </ul>
                </div>

                {/* Mission Statement */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold mb-2 ${theme.icon}`}>🔹 Mission Statement</h3>
                    <p className={`${theme.text} leading-relaxed`}>
                        Our mission is to make interview preparation accessible, efficient, and personalized for everyone, whether you're a student or a working professional.
                    </p>
                </div>

                {/* Team / Creator Info */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold mb-2 ${theme.icon}`}>🔹 Creator Info</h3>
                    <p className={`${theme.text} leading-relaxed`}>
                        Built by Tushar Gupta, a Computer Science student passionate about AI, full-stack development, and helping peers crack top tech interviews.
                    </p>
                </div>

                {/* Tech Stack */}
                <div className={`${theme.chatBg} p-6 rounded-lg shadow-md`}>
                    <h3 className={`text-xl font-semibold mb-3 ${theme.icon}`}>🔹 Tech Stack</h3>
                     <div className="flex flex-wrap gap-2">
                        {['React.js', 'Tailwind CSS', 'Gemini API', 'Node.js'].map(tech => (
                            <span key={tech} className={`px-3 py-1 text-sm rounded-full ${theme.sidebarLinkActive}`}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Contact / Feedback */}
                <div className="text-center mt-12">
                    <p className={`text-sm ${theme.secondaryIcon}`}>
                        Have feedback or want to connect? Reach out on <a href="#" className={`underline ${theme.icon}`}>LinkedIn</a>.
                    </p>
                    <p className={`text-xs mt-4 ${theme.secondaryIcon}`}>
                        © {new Date().getFullYear()} Made by Tushar. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
