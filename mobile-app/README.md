# CommodityX Mobile App

A futuristic, cyberpunk-styled commodities trading platform with stunning 3D UI effects, glassmorphism, and neon glows.

## Features

✨ **Modern UI/UX**
- Cyberpunk/Binance-inspired design
- Glassmorphism effects
- Neon glows and animations
- Smooth transitions with Framer Motion
- Fully responsive mobile-first design

📊 **Trading Features**
- Real-time commodity prices
- Interactive charts with Recharts
- Buy/Sell orders
- Portfolio management
- Order history tracking
- Watchlist functionality

🔐 **Authentication**
- Secure JWT-based authentication
- User registration and login
- Protected routes
- Persistent sessions

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **Axios** - HTTP client
- **React Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# Edit .env file if needed
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## Project Structure

```
mobile-app/
├── public/
│   └── index.html
├── src/
│   ├── components/     # Reusable UI components
│   │   └── Navbar.js
│   ├── context/        # React Context providers
│   │   └── AuthContext.js
│   ├── screens/        # Main app screens
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Charts.jsx
│   │   ├── Trading.jsx
│   │   └── Orders.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── tailwind.config.js  # Tailwind configuration
├── package.json
└── README.md
```

## Features Overview

### Dashboard
- Portfolio value overview
- Live LIVE indicator
- Quick stats
- Recently active commodities

### Portfolio
- Holdings overview
- Total value calculation
- P&L tracking
- Animated cards with glassmorphism

### Charts
- Interactive price charts
- Multiple timeframes (1H, 1D, 1W, 1M, 3M, 1Y)
- Real-time price updates
- Search and filter commodities

### Trading
- Buy/Sell orders
- Real-time price display
- Order calculation
- Available balance tracking

### Orders
- Order history
- Filter by status (all, pending, completed, cancelled)
- Cancel pending orders
- Detailed order information

## Design System

### Colors
- **Cyber Dark**: `#0a0e17` - Main background
- **Neon Cyan**: `#0dccf2` - Primary accent
- **Neon Green**: `#00ffa3` - Success/Buy
- **Neon Red**: `#ff3b3b` - Danger/Sell
- **Profit Green**: `#10B981` - Positive values
- **Loss Red**: `#EF4444` - Negative values

### Effects
- **Glassmorphism**: Semi-transparent backgrounds with blur
- **Neon Glows**: Box shadows for cyberpunk aesthetic
- **Pulse Animations**: Breathing effects on important elements
- **Smooth Transitions**: Framer Motion for fluid animations

## Backend Integration

The app connects to the backend API at `http://localhost:5000/api` by default.

### API Endpoints Used:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `GET /commodities` - Get all commodities
- `GET /commodities/:id/history` - Get price history
- `POST /trading/order` - Place order
- `GET /trading/orders` - Get user orders
- `DELETE /trading/orders/:id` - Cancel order
- `GET /trading/portfolio` - Get user portfolio

## Development Tips

1. **Hot Reload**: The app supports hot module replacement - changes appear instantly
2. **Mobile Testing**: Use browser DevTools to test responsive design
3. **API Testing**: Ensure backend is running before starting the app
4. **Styling**: All custom styles are in `src/index.css` and `tailwind.config.js`

## Troubleshooting

### App won't start
- Ensure Node.js 14+ is installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Can't connect to backend
- Check that backend server is running on port 5000
- Verify `REACT_APP_API_URL` in `.env` file
- Check browser console for CORS errors

### Styling issues
- Clear browser cache
- Rebuild Tailwind CSS: `npm run build:css` (if configured)
- Check that PostCSS is properly configured

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment

The production build can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## License

Private - Part of the Commodities Exchange Platform

## Credits

Built with ❤️ using React and modern web technologies.
Inspired by cyberpunk aesthetics and crypto exchange UIs like Binance.
