# BookitAll Web Dashboard

A modern React-based admin dashboard for managing vendors and business operations.

## 🚀 Features

- **Authentication**: Secure login system (ready for API integration)
- **Dashboard**: Modern, responsive dashboard interface
- **Vendor Management**: View and manage pending and verified vendors
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton screens and loading indicators
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
src/
├── api/                    # API service layer
│   ├── axios.js           # HTTP client configuration
│   └── vendors.js         # Vendor API endpoints
├── components/
│   ├── common/            # Reusable UI components
│   │   ├── ErrorBoundary.jsx
│   │   ├── Loading.jsx
│   │   └── Skeleton.jsx
│   └── Table.jsx          # Data table component
├── contexts/              # React contexts
│   └── AuthContext.jsx    # Authentication state
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   ├── useApi.js          # API call hook
│   └── useTable.js        # Table functionality hook
├── pages/                 # Page components
│   ├── PendingVendors.jsx
│   └── VerifiedVendors.jsx
├── routes/                # Route components
│   └── PrivateRoute.jsx   # Protected routes
├── utils/                 # Utility functions
│   ├── constants.js       # App constants
│   ├── helpers.js         # Helper functions
│   └── validators.js      # Validation utilities
├── App.jsx                # Main app component
├── Dashboard.jsx          # Dashboard layout
└── login.jsx              # Login page
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Icons** - Additional icons

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

Currently, the login accepts any credentials for development purposes. When ready to integrate with the backend API:

1. Update `src/login.jsx` to call the authentication API
2. Update `src/api/vendors.js` to use real API endpoints
3. The API service layer is already set up and ready for integration

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development
```

## 🏗️ Architecture

The project follows a production-ready architecture:

- **API Layer**: Centralized API service with axios
- **State Management**: React Context for authentication
- **Custom Hooks**: Reusable logic for API calls and tables
- **Error Handling**: Error boundaries and error states
- **Loading States**: Skeleton screens and loading indicators
- **Constants**: Centralized configuration

## 📚 Key Features

### API Service
- Automatic token injection
- Global error handling
- Request/response interceptors
- Ready for real API integration

### Custom Hooks
- `useApi`: Handles API calls with loading/error states
- `useAuth`: Authentication state management
- `useTable`: Table functionality (pagination, sorting, filtering)

### Error Handling
- Error boundaries for React errors
- API error handling
- User-friendly error messages

## 🚀 Production Deployment

1. Update environment variables for production
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 📖 Documentation

- See `PROJECT_ANALYSIS.md` for detailed project analysis
- See `ARCHITECTURE_REFACTORING_SUMMARY.md` for refactoring details

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established patterns (hooks, API service, etc.)
3. Add error handling and loading states
4. Update constants file for new routes/endpoints

## 📄 License

Private project - All rights reserved
