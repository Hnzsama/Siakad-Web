import '../css/app.css';
import './bootstrap';
import 'leaflet/dist/leaflet.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
            root.render(
            <ThemeProvider>
                <App {...props} />
                <Toaster />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
