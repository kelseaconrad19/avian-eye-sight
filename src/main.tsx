
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag programmatically to ensure proper mobile scaling
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.head.appendChild(meta);

createRoot(document.getElementById("root")!).render(<App />);
