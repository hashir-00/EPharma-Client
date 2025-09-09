# EPharma Client

A modern, responsive React-based client application for the EPharma platform - an online pharmacy and healthcare marketplace.

## 🌟 Features

### Core Functionality
- **Product Marketplace**: Browse and search pharmaceutical products
- **User Authentication**: Secure registration, login, and profile management
- **Shopping Cart**: Add products, manage quantities, and checkout
- **Order Management**: View order history and track deliveries
- **Prescription Upload**: Upload and manage medical prescriptions
- **Pharmacy Integration**: Browse products from different pharmacies
- **Payment Processing**: Secure payment integration

### Technical Features
- **Mock Mode**: Development mode with mock data for testing
- **Responsive Design**: Mobile-first, responsive UI
- **Real-time Updates**: Live cart and inventory updates
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit for predictable state
- **Modern UI**: shadcn/ui components with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and builds
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios for API communication
- **Development**: ESLint, Prettier, and TypeScript for code quality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EPharma/EPharma-Client
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp .env.development.example .env.development
   ```

4. **Start development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using bun
   bun run dev
   ```

The application will be available at `http://localhost:5173`

## 🔧 Environment Configuration

### Environment Variables

Create `.env` and `.env.development` files in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_UPLOAD_URL=http://localhost:3000/uploads

# Mock Mode (true/false)
VITE_MOCK_MODE=false

# App Configuration
VITE_APP_NAME=EPharma
VITE_APP_VERSION=1.0.0
```

### Mock Mode

The application supports a mock mode for development and testing:

- **Enable**: Set `VITE_MOCK_MODE=true` in your environment file
- **Disable**: Set `VITE_MOCK_MODE=false` to use real API

**Toggle Scripts:**
```bash
# Toggle mock mode on/off
./toggle-mock.sh    # Linux/Mac
./toggle-mock.bat   # Windows
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── Layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── mocks/              # Mock data and API simulation
├── pages/              # Page components
├── store/              # Redux store and slices
│   └── slices/         # Redux state slices
└── types/              # TypeScript type definitions
```

### Key Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component with routing
- `src/store/store.ts` - Redux store configuration
- `src/mocks/` - Mock data and API simulation
- `vite.config.ts` - Vite configuration

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:

- **Form Components**: Input, Button, Select, Checkbox
- **Navigation**: Command menu, navigation menus
- **Layout**: Card, Sheet, Dialog, Tabs
- **Feedback**: Toast, Alert, Loading states
- **Data Display**: Table, Badge, Avatar

## 🛒 Key Features

### Marketplace
- Product browsing with pagination
- Advanced search and filtering
- Category-based navigation
- Pharmacy-specific product listings
- Stock availability indicators

### User Management
- Secure authentication flow
- Profile management
- Address management
- Order history and tracking

### Shopping Experience
- Intuitive cart management
- Guest and user checkout
- Multiple payment methods
- Order confirmation and tracking

### Prescription Management
- Secure prescription upload
- Prescription verification process
- Prescription-based ordering

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Mock Data Development

When `VITE_MOCK_MODE=true`:
- All API calls are intercepted and return mock data
- Mock data is located in `src/mocks/`
- Simulates real API responses and timing
- Useful for UI development and testing

See `src/mocks/README.md` for detailed mock data documentation.

### Code Style

The project follows strict TypeScript and ESLint rules:
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **Imports**: Organized with path aliases

## 🚀 Build and Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

1. **Static Hosting** (Vercel, Netlify, GitHub Pages)
2. **CDN Deployment** (AWS S3 + CloudFront)
3. **Container Deployment** (Docker with Nginx)

### Environment-Specific Builds

- **Development**: Hot reload, source maps, mock mode
- **Staging**: Production optimizations, real API
- **Production**: Full optimizations, real API, analytics

## 🔐 Security Features

- **Input Validation**: Zod schemas for form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: Encrypted local storage for sensitive data
- **API Security**: JWT token authentication

## 🌐 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Features**: ES2020, CSS Grid, Flexbox, Fetch API

## 📋 API Integration

### Endpoints
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **Products**: `/products`, `/products/:id`, `/products/search`
- **Cart**: `/cart`, `/cart/add`, `/cart/update`, `/cart/remove`
- **Orders**: `/orders`, `/orders/:id`, `/orders/create`
- **Users**: `/users/profile`, `/users/addresses`
- **Prescriptions**: `/prescriptions/upload`, `/prescriptions/:id`

### Error Handling
- Centralized error handling with Redux
- User-friendly error messages
- Retry mechanisms for failed requests
- Offline state management

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the code style guidelines
4. **Run tests**: `npm run test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure responsive design

## 📖 Additional Documentation

- [Main Project README](../README.md) - Overall project information
- [Backend API Documentation](../EPharma-Backend/README.md)
- [Admin Panel Documentation](../EPharma-Admin/README.md)
- [Mock Data Guide](src/mocks/README.md)
- [Component Storybook](./storybook) (Coming Soon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For questions and support:
- **Issues**: GitHub Issues tracker
- **Documentation**: Project wiki
- **Community**: Discord/Slack channel (if available)

---

**Built with ❤️ for better healthcare accessibility**
