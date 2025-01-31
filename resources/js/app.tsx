import './bootstrap';
import '../css/app.css';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { DialogHandler } from './components/dialog-handler';
import { LayoutManager } from './layouts/manager';

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
    const page: any = pages[`./Pages/${name}.tsx`]
    return {
      default: (props: any) => (
        <LayoutManager {...props}>
          {page.default(props)}
          <DialogHandler />
        </LayoutManager>
      ),
    }
  },
  setup({ el, App, props }: { el: HTMLElement, App: React.ComponentType, props: any }) {
    createRoot(el).render(
      <AppProvider i18n={enTranslations}>
        <App {...props} />
      </AppProvider>
    )
  },
})