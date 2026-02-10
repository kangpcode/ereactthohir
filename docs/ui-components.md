# Rice UI Components

Rice UI is a premium React component library included with EreactThohir. While Rice UI provides the most integrated and "premium" experience, EreactThohir is designed to be **UI Agnostic**.

During project setup, you can choose between:
- **Rice UI** (Default, Premium Glassmorphism)
- **Material UI** (Enterprise Standard)
- **Bootstrap 5** (Classic & Reliable)

## 🏗️ Layout Components

### DashboardLayout
A complete structural layout for enterprise apps.
Features:
- Responsive Sidebar.
- Sticky Navbar.
- Content area with breadcrumbs.

## 📊 Data Visualization

### MetricCard
Beautifully display your KPIs.
```tsx
<MetricCard 
  title="Total Revenue" 
  value="Rp 15.000.000" 
  change={12.5} 
  trend="up" 
/>
```

## 🤖 Interaction

### ChatBox
A ready-to-use UI for AI-powered chat.
Features:
- Auto-scroll to bottom.
- User/Assistant bubbles.
- Loading states for AI response.
- Fully styleable via Tailwind classes.

## ⚙️ Core Components
- `Button`: Multiple variants (Primary, Outline, Ghost).
- `Table`: Advanced data table with sorting.
- `Modal` & `Toast`: Standard interaction patterns.
- `Skeleton`: Loading states.
