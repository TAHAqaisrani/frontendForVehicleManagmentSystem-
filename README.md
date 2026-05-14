# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin & Management Features

### Staff Management
- **Identity Management**: Admins can now add, edit, and remove staff members (Advisors, Technicians) directly from the `Users` page.
- **Secure Access**: All staff accounts are created with hashed passwords and role-based access control.

### Operational Controls
- **Delete Capabilities**: Admins and Advisors can remove redundant or incorrect bookings and job cards.
- **Return Workflow**: 
  - **Technician**: Can return a job to the advisor if additional information or parts are needed.
  - **Status Updates**: New statuses `Returned to Advisor` and `Returned to Customer` for clear communication.
- **Real-time Analytics**: Admin dashboard with live telemetry and business metrics.

## Demo Credentials

- **Admin**: `admin@vsc.com` / `admin123`
- **Advisor**: `advisor@vsc.com` / `advisor123`
- **Technician**: `tech@vsc.com` / `tech123`
- **Customer**: `customer@vsc.com` / `customer123`