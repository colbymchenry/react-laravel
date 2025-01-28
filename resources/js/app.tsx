import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext';

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
    return pages[`./Pages/${name}.tsx`]
  },
  setup({ el, App, props }: { el: HTMLElement, App: React.ComponentType, props: any }) {
    createRoot(el).render(
      <AuthProvider initialAuth={props.auth}>
        <App {...props} />
      </AuthProvider>
    )
  },
})