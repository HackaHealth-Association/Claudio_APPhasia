# Claudio APPhasia - Communication Assistant

## ⚙️ Initial Setup

### 1. Prerequisites (Must be installed)
* **Node.js  install** (https://nodejs.org/en/download)
* **Python 3.10+**

### 2. Environment Setup

```bash
# Terminal 1: Setup (Only run this once)

# Clone the repository
git clone git@github.com:HackaHealth-Association/Claudio_APPhasia.git
cd Claudio_APPhasia

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate 
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
npm install 
cd ..

# --- EXECUTION STARTS HERE ---

# Run this in Terminal 1 (Backend)
# export GEMINI_API_KEY="YOUR_GEMINI_KEY_HERE"
# export XAI_API_KEY="YOUR_GROK_KEY_HERE"
export LLM_PROVIDER=groq
export CARTESIA_API_KEY="YOUR_CARTESIA_KEY_HERE"
export GROQ_API_KEY=”YOUR_GROQ_KEY_HERE”


python backend.py

# Run this in a Terminal 2 (Frontend)
cd frontend
npm run dev