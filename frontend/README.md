# Picstream Frontend

Modern React frontend for Picstream social media platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx      # Navigation with auth modals
│   ├── Feed.tsx        # Post list container
│   ├── PostCard.tsx    # Individual post with likes/comments
│   ├── CreatePost.tsx  # New post form
│   └── TrendingCard.tsx # Trending sidebar
├── pages/
│   └── Index.tsx       # Main page
├── lib/
│   └── utils.ts        # Utility functions
├── App.tsx             # App entry
├── main.tsx            # React entry
└── index.css           # Global styles
```

## Environment

The frontend connects to the FastAPI backend at `http://localhost:8000`.

Make sure the backend is running before starting the frontend.
