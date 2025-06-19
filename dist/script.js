// ==UserScript==
// @name         Command Prompt Macro Launcher
// @namespace    http://yourdomain.com/
// @version      0.1
// @description  Custom command launcher for macros via CTRL + .
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_STORAGE_KEY = "tampermonkey_macros";
    let promptVisible = false;
    let inputBox = null;
    // Load macros from localStorage
    function loadMacros() {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    // Save macros to localStorage
    function saveMacros(macros) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(macros));
    }
    // Initialize with default macros if empty
    function initializeDefaults() {
        const macros = loadMacros();
        if (Object.keys(macros).length === 0) {
            macros["hello"] = `alert("Hi there!")`;
            macros["reload"] = `location.reload()`;
            saveMacros(macros);
        }
    }
    // Handle special or regular commands
    function handleCommand(input) {
        const macros = loadMacros();
        const [cmd, ...args] = input.trim().split(" ");
        const argStr = args.join(" ");
        if (cmd === ":add" && argStr) {
            const name = argStr.trim();
            const code = prompt(`Enter code for macro "${name}"`);
            if (code) {
                macros[name] = code;
                saveMacros(macros);
                alert(`Macro "${name}" saved.`);
            }
            return;
        }
        if (cmd === ":del" && argStr) {
            delete macros[argStr.trim()];
            saveMacros(macros);
            alert(`Macro "${argStr}" deleted.`);
            return;
        }
        if (cmd === ":list") {
            const list = Object.keys(macros).join("\n") || "(no macros)";
            alert(`Macros:\n${list}`);
            return;
        }
        if (macros[input]) {
            try {
                new Function(macros[input])();
            }
            catch (err) {
                alert(`Error running macro "${input}": ${err}`);
            }
        }
        else {
            alert(`Unknown command: "${input}"`);
        }
    }
    // UI prompt
    function createPrompt() {
        inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Enter macro or :command";
        Object.assign(inputBox.style, {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "10000",
            padding: "10px",
            fontSize: "16px",
            border: "2px solid #888",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            backgroundColor: "#fff",
            color: "#000",
            width: "300px",
        });
        inputBox.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && inputBox) {
                const command = inputBox.value.trim();
                inputBox.remove();
                promptVisible = false;
                handleCommand(command);
            }
            else if (e.key === "Escape" && inputBox) {
                inputBox.remove();
                promptVisible = false;
            }
        });
        document.body.appendChild(inputBox);
        inputBox.focus();
    }
    // Hotkey: CTRL + .
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === ".") {
            e.preventDefault();
            if (!promptVisible) {
                promptVisible = true;
                createPrompt();
            }
        }
    });
    initializeDefaults();

})();
