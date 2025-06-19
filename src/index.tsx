import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getHostnameFromUrl } from './util';


(function runDeferredMacros() {
    const location = window.location.href;
	const k = `exec__${getHostnameFromUrl(location)}`
    const raw = GM_getValue(k, '[]')
    let pending: any[] = [];

    try {
        pending = JSON.parse(raw);
    } catch (e) {
        console.warn('[Macro] Failed to parse deferred macro storage:', e);
    }


    const remaining = []
    for (const p of pending) {
        if (getHostnameFromUrl(location) == getHostnameFromUrl(p.origin)) {
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
        } else {
            remaining.push(p)
        }
    }

    GM_setValue(k, JSON.stringify(remaining));
})();

const container = document.createElement('div');
document.body.appendChild(container);
createRoot(container).render(<App />);
