import './bootstrap';
import '../css/app.css';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { AuthStateHandler } from './components/AuthStateHandler'
import { LaravelDataHandler } from './components/LaravelDataHandler';

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
    return pages[`./Pages/${name}.tsx`]
  },
  setup({ el, App, props }: { el: HTMLElement, App: React.ComponentType, props: any }) {
    createRoot(el).render(
      <AppProvider i18n={enTranslations}>
        <LaravelDataHandler {...props}>
          <AuthStateHandler {...props}>
            <App {...props} />
          </AuthStateHandler>
        </LaravelDataHandler>
      </AppProvider>
    )
  },
})