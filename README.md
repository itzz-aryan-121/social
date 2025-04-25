# 🧠 RealEcho – Real Stories. Real Impact.

**RealEcho** is a social awareness platform where people can share real-life stories of suffering, survival, and justice. Inspired by the theme of shows like *Crime Patrol*, this platform is built to raise awareness—not through fiction, but through actual user experiences. We believe that stories have the power to bring change, spread awareness, and create a support system for those who need it most.

> 🚨 Strict moderation | 🔐 Anonymity and confidentiality | 🫂 Empathetic community

---

## 📌 Key Features

- 📢 **Real Story Sharing** – Users can publish text/audio/video stories about real events they’ve lived through.
- 🧑‍🤝‍🧑 **Support Groups** – Users can join or create safe, private groups based on topics (e.g., abuse, cyberbullying, recovery).
- 🧩 **Anonymous Posting** – Post stories or comments while keeping identity hidden (admins still verify authenticity).
- 🔒 **Strict Moderation System** – Hateful or insensitive comments are automatically flagged and can lead to a permanent ban.
- 📚 **Awareness Resources** – Users can access legal info, support helplines, NGO links, and more.
- ❤️ **Empathy Reactions** – Instead of “likes,” users can react with supportive emotions like "I relate", "I support", or "Stay strong".

---

## 🛠 Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| Frontend    | React / React Native, Tailwind CSS                                   |
| Backend     | Node.js with Express / Django (optional), REST API                   |
| Database    | MongoDB / PostgreSQL                                                 |
| Auth        | Firebase Authentication / Auth0                                      |
| Moderation  | Google Perspective API / OpenAI moderation models                    |
| Hosting     | Vercel (Frontend), Railway or Render (Backend)                       |

---

## 🚀 Getting Started

### 🧩 Prerequisites

- Node.js >= 16.x
- MongoDB or PostgreSQL instance
- Firebase/Auth0 account (for authentication)
- Optional: Perspective API key (for comment moderation)

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/RealEcho.git
cd RealEcho

# Install dependencies (frontend)
cd client
npm install

# Install dependencies (backend)
cd ../server
npm install
