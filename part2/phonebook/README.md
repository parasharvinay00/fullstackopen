# Phonebook Frontend

The phonebook frontend uses `VITE_API_BASE_URL` for the backend API base URL.

Local development:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

Production deployment:

```bash
VITE_API_BASE_URL=https://phonebook-backend-a96k.onrender.com/api
```

If `VITE_API_BASE_URL` is not set, the app now falls back to:

- `http://localhost:3001/api` on `localhost` / `127.0.0.1`
- `https://phonebook-backend-a96k.onrender.com/api` on non-localhost deployments

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
