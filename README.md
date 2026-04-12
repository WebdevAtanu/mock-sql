# Data Generate

A small React + TypeScript + Vite app for generating sample data and previewing query output.

## What it does

- Provides a form-based UI to configure data generation parameters.
- Uses `@faker-js/faker` for generating random data.
- Displays generated output values and query text in the browser.
- Built with React 19, Vite, TypeScript, and Tailwind CSS.

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser at the URL shown by Vite, typically `http://localhost:5173`.

## Project structure

- `src/` - application source code
- `src/components/` - UI components such as form controls, table builder, and output view
- `src/utils/dataGenerator.ts` - data generation helper logic
- `vite.config.ts` - Vite configuration
- `eslint.config.js` - linting rules

## Dependencies

- `react` / `react-dom`
- `vite`
- `typescript`
- `@faker-js/faker`
- `tailwindcss`

## Notes

This README is intentionally short and focused on running the app. For UI or data generation behavior, review the components under `src/components/` and `src/utils/dataGenerator.ts`.
