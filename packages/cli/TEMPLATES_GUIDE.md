# EreactThohir Templates Guide

This guide describes all available templates and their features.

## Available Templates

### 1. None (Blank)
The simplest template with minimal setup. Perfect for developers who want complete control over the project structure.

**Includes:**
- Basic project structure
- Core dependencies
- Development scripts
- Empty routes

**Use Case:** Custom projects, experiments, learning

---

### 2. Mobile App Starter
A production-ready mobile application template with navigation, API integration, and state management.

**Includes:**
- React Native setup
- Zustand for state management
- Axios for API calls
- Mobile navigation
- Mobile-specific routes
- Example screens (Home, Profile, Settings)

**Features:**
- `useAppStore` - Global app state (user, loading, notifications)
- API service with request/response interceptors
- Pre-built UI patterns for mobile
- Authentication token handling

**Dependencies Added:**
- `react-native` ^0.72.0
- `react-native-navigation` ^7.0.0
- `axios` ^1.4.0
- `zustand` ^4.4.0
- `react-router-dom` ^6.14.0

**Use Case:** iOS/Android apps, mobile-first applications

---

### 3. Admin Dashboard
A powerful admin panel template with statistics, user management, and charts.

**Includes:**
- Zustand store for admin state
- Dashboard with statistics cards
- User management page with table
- Chart placeholders
- Admin-specific routes
- API integration

**Features:**
- Real-time stats loading
- User list with CRUD actions
- Responsive grid layouts
- Admin middleware protection
- Advanced state management

**Pre-built Components:**
- StatCard - Display statistics
- ChartSection - Chart containers
- Users Table - Manage users
- Dashboard Overview

**Dependencies Added:**
- `axios` ^1.4.0
- `zustand` ^4.4.0
- `react-router-dom` ^6.14.0
- `recharts` ^2.8.0
- `lucide-react` ^0.263.0

**Use Case:** Admin panels, dashboards, management systems

---

### 4. Authentication Starter
A complete authentication system with login, registration, and auth guards.

**Includes:**
- Auth store with login/register/logout
- API service with auth interceptors
- Login page with form validation
- Registration page
- Password management
- Auth routes
- Error handling

**Features:**
- Automatic token refresh on 401
- Session persistence
- Form validation
- Error notifications
- Protected routes
- JWT token handling

**Pre-built Pages:**
- Login page
- Registration page
- Password reset (template ready)

**Dependencies Added:**
- `axios` ^1.4.0
- `zustand` ^4.4.0
- `react-router-dom` ^6.14.0
- `jsonwebtoken` ^9.0.2
- `bcryptjs` ^2.4.3

**Use Case:** Apps with authentication, SaaS platforms, secure apps

---

### 5. Enterprise App Template
Production-grade application with advanced features like RBAC, modules, hooks, and persistence.

**Includes:**
- Advanced API service with queue management
- Zustand store with persistence
- Module-based architecture
- Role-Based Access Control (RBAC)
- Custom hooks (useApi)
- Enterprise routes
- Advanced interceptors

**Features:**
- Token refresh queue management
- LocalStorage persistence
- Permission checking
- Module-based routing
- Custom API hooks
- Email verification middleware
- Advanced error handling

**Pre-built Architecture:**
- Dashboard module
- Users module
- RBAC system
- Settings management

**Dependencies Added:**
- `axios` ^1.4.0
- `zustand` ^4.4.0
- `react-router-dom` ^6.14.0
- `lodash` ^4.17.21
- `date-fns` ^2.30.0
- `react-hook-form` ^7.45.0

**Use Case:** Large-scale applications, enterprise systems, complex dashboards

---

### 6. SaaS Template
Complete SaaS platform template with subscription management, pricing, and invoices.

**Includes:**
- Subscription service
- SaaS store with Zustand
- Pricing page
- Subscription management page
- Invoice management
- Plan upgrade/downgrade
- SaaS-specific routes

**Features:**
- Multiple pricing plans
- Subscription lifecycle management
- Invoice tracking
- Billing cycle management
- Plan switching
- Payment integration ready

**Pre-built Pages:**
- Pricing page with plan comparison
- Subscription dashboard
- Invoice list and details

**Dependencies Added:**
- `axios` ^1.4.0
- `zustand` ^4.4.0
- `react-router-dom` ^6.14.0
- `stripe` ^12.10.0
- `date-fns` ^2.30.0
- `react-hook-form` ^7.45.0

**Use Case:** SaaS platforms, subscription services, billing systems

---

## UI Framework Integration

All templates automatically adapt to your chosen UI framework:

- **Tailwind CSS** - Utility-first styling (default)
- **Bootstrap 5** - Component-based styling
- **Material UI** - Google Material Design
- **Ant Design** - Enterprise design system
- **Chakra UI** - Accessible components
- **Shadcn/ui** - High-quality React components
- **JokoUI** - Modern UI library
- **Rice UI** - Official EreactThohir UI library

All template components use basic CSS classes that work with any framework.

---

## Project Structure

### Common Directories

```
app/
├── Controllers/        # Business logic
├── Services/          # Service classes
├── Models/            # Data models
├── Middleware/        # Request middleware
└── Providers/         # Service providers

resources/
├── pages/             # Page components
├── components/        # Reusable components
├── stores/            # Zustand stores
├── hooks/             # Custom React hooks
├── services/          # API & business services
└── assets/            # Static assets

routes/
├── web.ts             # Web routes
├── api.ts             # API routes
├── mobile.ts          # Mobile routes
├── auth.ts            # Auth routes
├── admin.ts           # Admin routes
├── enterprise.ts      # Enterprise routes
└── saas.ts            # SaaS routes

database/
├── migrations/        # Database migrations
├── seeders/          # Database seeders
└── factories/        # Model factories

config/
└── app.json          # App configuration
```

---

## Getting Started with Templates

### 1. Create a new project
```bash
ereact create my-app
```

### 2. Select template during setup
```
Choose a starter template:
  1. None (Blank)
  2. Mobile App Starter
  3. Admin Dashboard
  4. Authentication Starter
  5. Enterprise App Template
  6. SaaS Template
```

### 3. Select UI Framework
```
UI Style:
  1. Rice UI (default, official)
  2. Tailwind CSS
  3. Bootstrap 5
  4. Material UI
  5. Ant Design
  6. Chakra UI
  7. Shadcn/ui
  8. JokoUI
  9. None (Custom CSS)
```

### 4. Install & run
```bash
cd my-app
npm install
npm run dev
```

---

## Template Features Comparison

| Feature | Blank | Mobile | Admin | Auth | Enterprise | SaaS |
|---------|-------|--------|-------|------|------------|------|
| API Integration | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| State Management | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Authentication | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| UI Components | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forms | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Charts | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Subscription | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| RBAC | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Examples | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Customizing Templates

All templates are fully customizable. After project creation, you can:

### Add new pages
```bash
ereact make:component MyComponent
```

### Add new routes
Edit `routes/web.ts` or template-specific route files

### Modify stores
Extend Zustand stores in `resources/stores/`

### Customize API service
Update `resources/services/api.ts`

---

## Best Practices

1. **Use Zustand for state** - Already integrated in all templates
2. **Implement error handling** - Check API service interceptors
3. **Use TypeScript** - Templates are fully typed
4. **Follow the module structure** - Organize code logically
5. **Protect admin routes** - Use auth middleware
6. **Validate forms** - Use react-hook-form in Enterprise/SaaS
7. **Handle loading states** - Use isLoading from stores
8. **Persist auth tokens** - Handled by API interceptors

---

## Next Steps

- Read the [GETTING_STARTED guide](../../docs/GETTING_STARTED.md)
- Check [ARCHITECTURE guide](../../docs/ARCHITECTURE.md)
- Learn about [Semouth authentication](../../docs/SEMOUTH.md)
- Review [SECURITY guide](../../docs/SECURITY.md)
