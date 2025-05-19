
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag programmatically to ensure proper mobile scaling
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.head.appendChild(meta);

// Apply theme from local storage or system preference
const initializeTheme = () => {
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
