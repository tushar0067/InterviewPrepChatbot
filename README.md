AI Interview Coach 🤖
Welcome to the AI Interview Coach, a smart, web-based application designed to help you ace your job interviews. This tool leverages the power of Google's Gemini API to provide real-time feedback, practice sessions, and resume analysis, all within a sleek, modern interface.

🚀 Key Features
🧠 Real-time AI Coaching: Engage in a dynamic conversation with an AI coach that provides interview questions and feedback.

📄 PDF Resume Analysis: Upload your resume (PDF) and ask for detailed suggestions, keyword optimization, and formatting advice.

🎨 Dual Theme Interface: Seamlessly switch between a light and dark theme to suit your preference.

📊 Progress Dashboard: Get a quick overview of your preparation with dummy analytics on questions asked and topics covered.

📜 Chat History Summary: The "History" tab provides concise summaries of your past conversations for quick review.

⚙️ Accessibility Controls: Adjust the font size for comfortable reading in the settings panel.

🚫 Stop Generation: Interrupt the AI's response at any time with a convenient stop button.

✨ Modern UI: A clean, responsive, and intuitive user interface built with React and Tailwind CSS.

🛠️ Tech Stack
This project is built with a modern, front-end tech stack:

React.js: For building the dynamic and component-based user interface.

Tailwind CSS: For utility-first styling and creating a responsive design.

Google Gemini API: Powers the AI chat and analysis capabilities.

Parcel: Used as a web application bundler for a fast, zero-config development experience.

Mozilla's pdf.js: For client-side text extraction from PDF documents.

⚙️ Setup and Installation
To run this project on your local machine, follow these simple steps.

Prerequisites
Node.js and npm (or yarn) installed on your system.

A valid Google Gemini API Key.

1. Create Project Files
Create a new folder for your project and place the following files inside it:

index.html

App.js

History.js

Dashboard.js

Settings.js

About.js

2. Initialize the Project
Open your terminal in the project folder and run the following command to create a package.json file:

npm init -y

3. Install Dependencies
Install React, ReactDOM, and Parcel:

npm install react react-dom parcel

4. Configure package.json
Open your package.json file and add the following start and build scripts:

"scripts": {
  "start": "parcel src/index.html",
  "build": "parcel src/build index.html",
  "test": "echo \"Error: no test specified\" && exit 1"
},

5. Create .env for API Key
Create a new file in your project's root directory named .env. Inside this file, add your API key like this (Parcel requires the PARCEL_ prefix):

PARCEL_GEMINI_API_KEY=YOUR_API_KEY_HERE

6. Create .gitignore
Create another file named .gitignore in the root directory and add the following lines to it. This is a crucial step to ensure your secret key is not uploaded to GitHub.

.env
node_modules/
dist/
.parcel-cache/

7. Run the Application
You're all set! Start the development server by running:

npm start

Parcel will bundle the application and provide you with a local server address (usually http://localhost:1234). Open this link in your browser to see the app live. For a production build, run npm run build.

📁 File Structure
The project is organized into modular components for better maintainability:

/project-root
├── 📄 App.js           # Main application component, state management, and logic
├── 📄 Dashboard.js      # Component for the analytics dashboard page
├── 📄 History.js        # Component for the chat history summary page
├── 📄 Settings.js       # Component for the user settings page
├── 📄 About.js          # Component for the about page
├── 📄 index.html        # The entry point that loads the React app
├── 📄 .env              # Stores the secret API key (Do
 
© Creator
Built with passion by Tushar Gupta.

© 2024 All Rights Reserved.

