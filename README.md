
# Luna AI 💖

**A playful, local AI chatbot with file support built using React + Node.js + Ollama.**  

Luna AI acts like a fun, loving, and interactive assistant while allowing users to send files (PDF, TXT, code files) for analysis. Perfect for testing AI interactions locally with a React frontend and Node.js backend.

---

## Features ✨

- 💬 Chat with a playful AI assistant
- 📂 Upload files (PDF, TXT, code files) for AI analysis
- 📧 Save user emails locally
- 🖥️ Responsive UI with React + Tailwind CSS
- ⚡ Streaming AI responses like a real conversation
- 🛡️ Local storage for emails to maintain privacy

---

## Demo Screenshots

<img width="1351" height="635" alt="image" src="https://github.com/user-attachments/assets/05bbf1a9-4701-4e1d-b197-28fe4aed8041" />


---

## Tech Stack 🛠️

- **Frontend:** React, Tailwind CSS, Lucide icons  
- **Backend:** Node.js, Express, Multer  
- **AI:** Ollama API (GPT-OSS:120B-Cloud model)  
- **File Parsing:** PDF, TXT, Code files  
- **Storage:** Local JSON file for emails

---

## Installation 🔧

1. Clone the repository:
```bash
git clone https://github.com/DeveloperAnuragsrivastav/Luna-Ai.git
cd Luna-Ai
````

2. Install dependencies for frontend and backend:

```bash
npm install
```

3. Run the server:

```bash
node server.js
```

4. Run the React frontend:

```bash
npm run dev
```

5. Open your browser at:

```
http://localhost:5173
```

---

## Usage 📝

* Chat directly with Luna AI in the input box.
* Upload a file to let Luna analyze it.
* First-time users can enter their email to get access to full features.
* Stop AI streaming response by clicking the stop button.

---

## Project Structure 📁

```
local-chatbot/
├─ src/                   # React frontend source
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ App.css
│  └─ assets/
├─ server.js              # Node.js backend
├─ emails/                # Local email storage
│  └─ emails.json
├─ public/                # Static assets
└─ package.json
```

---

## Contributing 🤝

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License 📄

This project is **MIT licensed**. See [LICENSE](LICENSE) for details.

---

## Contact 💌

Developer: Anurag Srivastav
GitHub: [DeveloperAnuragsrivastav](https://github.com/DeveloperAnuragsrivastav)
Email: develoepr.anuragsrivastav@gmail.com



---
