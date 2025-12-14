# 📸 Picstream - Modern Social Media Platform

A full-stack social media application built with **FastAPI** and **React**, featuring real-time interactions, JWT authentication, cloud image storage, and a beautiful dark-themed responsive UI.

![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.123+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

- 🔐 **JWT Authentication** - Secure login/register with FastAPI-Users
- 📷 **Media Upload** - Image & video upload with ImageKit CDN
- ❤️ **Like System** - Like/unlike posts with real-time count
- 💬 **Comments** - Add and delete comments on posts
- 🎨 **Modern UI** - Dark theme with smooth Framer Motion animations
- 📱 **Responsive** - Mobile-first design with Tailwind CSS
- ⚡ **Async** - Fully asynchronous backend with SQLAlchemy 2.0
- 🔄 **Real-time** - Auto-refreshing feed

## 🖼️ Screenshots

<p align="center">
  <img src="screenshots/feed.png" alt="Feed View" width="800">
</p>

<p align="center">
  <img src="screenshots/mobile.png" alt="Mobile View" width="300">
  <img src="screenshots/login.png" alt="Login Modal" width="300">
</p>

## 🛠️ Tech Stack

### Backend

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| **FastAPI**        | High-performance async web framework |
| **SQLAlchemy 2.0** | Async ORM with SQLite/PostgreSQL     |
| **FastAPI-Users**  | Authentication & user management     |
| **ImageKit**       | Cloud-based image/video CDN          |
| **Pydantic**       | Data validation & serialization      |
| **uvicorn**        | ASGI server                          |

### Frontend

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| **React 18**      | UI library with hooks        |
| **TypeScript**    | Type-safe JavaScript         |
| **Vite**          | Fast build tool & dev server |
| **Tailwind CSS**  | Utility-first CSS framework  |
| **Framer Motion** | Animation library            |
| **Lucide React**  | Beautiful icons              |

## 🚀 Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (recommended) or pip

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/picstream.git
cd picstream

# Create virtual environment
uv venv
# or: python -m venv .venv

# Activate environment (Windows)
.venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate

# Install dependencies
uv sync
# or: pip install -e .

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run backend server
uv run uvicorn app.app:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Authentication
SECRET_KEY=your-super-secret-key-change-this-in-production

# ImageKit CDN Configuration
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id

# Database (optional - defaults to SQLite)
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| `POST` | `/auth/register`   | Register new user     |
| `POST` | `/auth/jwt/login`  | Login & get JWT token |
| `POST` | `/auth/jwt/logout` | Logout user           |

### Posts

| Method   | Endpoint      | Description                         |
| -------- | ------------- | ----------------------------------- |
| `GET`    | `/feed`       | Get all posts with likes & comments |
| `POST`   | `/upload`     | Create new post with media          |
| `DELETE` | `/posts/{id}` | Delete own post                     |

### Interactions

| Method   | Endpoint               | Description    |
| -------- | ---------------------- | -------------- |
| `POST`   | `/posts/{id}/like`     | Like a post    |
| `DELETE` | `/posts/{id}/like`     | Unlike a post  |
| `POST`   | `/posts/{id}/comments` | Add comment    |
| `DELETE` | `/comments/{id}`       | Delete comment |

### Users

| Method  | Endpoint    | Description      |
| ------- | ----------- | ---------------- |
| `GET`   | `/users/me` | Get current user |
| `PATCH` | `/users/me` | Update profile   |

## 📁 Project Structure

```
picstream/
├── app/
│   ├── app.py          # FastAPI application & routes
│   ├── db.py           # SQLAlchemy models & database
│   ├── users.py        # Authentication configuration
│   ├── schemas.py      # Pydantic schemas
│   └── images.py       # ImageKit integration
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Feed.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   └── TrendingCard.tsx
│   │   ├── pages/
│   │   │   └── Index.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── main.py             # Entry point
├── pyproject.toml      # Python dependencies
├── .env.example        # Environment template
└── README.md
```

## 🗺️ Roadmap

- [ ] User profiles with avatars
- [ ] Follow/Unfollow system
- [ ] Push notifications
- [ ] Direct messaging
- [ ] PostgreSQL production support
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit & integration tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

<p align="center">
  Made with ❤️ and ☕
</p>
