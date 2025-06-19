import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getHostnameFromUrl } from './util';


(function runDeferredMacros() {
    const raw = GM_getValue('__deferred_macro_exec__', '[]');
    let pending: any[] = [];

    try {
        pending = JSON.parse(raw);
    } catch (e) {
        console.warn('[Macro] Failed to parse deferred macro storage:', e);
    }

    const location = window.location.href

    for (const p of pending) {
        if (getHostnameFromUrl(location) == p.origin) {
            try {
                GM_addElement('script', {
                    textContent: `
                ${p.code};
                try {
                    main(${JSON.stringify(p.args || [])});
                } catch (e) {
                    alert('[Macro] Deferred macro error: ' + e.message);
                }
                `,
                });
            } catch (err) {
                //@ts-ignore
                alert('[Macro] Deferred macro error: ' + err.message);
            }
        }
    }

    GM_setValue('__deferred_macro_exec__', '[]');
})();

const container = document.createElement('div');
document.body.appendChild(container);
createRoot(container).render(<App />);
