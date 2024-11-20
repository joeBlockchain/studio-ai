# 🤖 AI Agent Studio

Welcome to **AI Agent Studio**! This platform enables you to create, customize, and interact with AI agents. Build specialized AI assistants with custom system prompts, conversation starters, and knowledge bases from reference files.

## 📖 Table of Contents

- [🤖 AI Agent Studio](#-ai-agent-studio)
  - [📖 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🚀 Getting Started](#-getting-started)
  - [📂 Project Structure](#-project-structure)
  - [🛠️ Development](#️-development)
  - [📄 License](#-license)

## ✨ Features

- **Custom AI Agent Creation**: Design agents with specific system prompts and behaviors
- **Knowledge Base Integration**: Upload reference files to enhance agent capabilities
- **Interactive Chat Interface**: Real-time communication with your agents
- **Agent Management**: Create, edit, and delete agents through an intuitive interface
- **Team Collaboration**: Switch between different team contexts
- **Responsive Design**: Full support for desktop and mobile devices

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/joeBlockchain/studio-ai
   ```

2. **Install Dependencies**
   ```bash
   cd studio-ai
   npm install
   ```

3. **Set up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your OpenAI API key and Supabase credentials in `.env.local`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/src/app/agents/` - Agent-related pages and routing
- `/src/components/` - Reusable UI components
  - `new-agent-form.tsx` - Agent creation form
  - `sidebar-left.tsx` - Navigation and agent listing
  - `sidebar-right.tsx` - Chat interface
- `/public/` - Static assets
- `/styles/` - Global styles and theme configuration

## 🛠️ Development

Built with modern web technologies:
- Next.js 13+ (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI API

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.