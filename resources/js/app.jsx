import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        const page = pages[`./pages/${name}.jsx`] || pages[`./pages/${name.split('/').pop()}.jsx`];

        if (!page) {
            throw new Error(`Page not found: ./pages/${name}.jsx`);
        }

        return page.default;

    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});


