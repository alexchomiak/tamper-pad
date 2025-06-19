// ==UserScript==
// @name         Command Prompt Macro Launcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open a command prompt with CTRL + . to run custom macros/functions
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let promptVisible = false;
    let inputBox = null;

    // Create the command prompt input box
    function createPrompt() {
        inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Enter command...";
        inputBox.style.position = "fixed";
        inputBox.style.top = "20px";
        inputBox.style.left = "50%";
        inputBox.style.transform = "translateX(-50%)";
        inputBox.style.zIndex = 10000;
        inputBox.style.padding = "10px";
        inputBox.style.fontSize = "16px";
        inputBox.style.border = "2px solid #888";
        inputBox.style.borderRadius = "5px";
        inputBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
        inputBox.style.backgroundColor = "#fff";
        inputBox.style.color = "#000";
        inputBox.style.width = "300px";

        inputBox.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const command = inputBox.value.trim();
                inputBox.remove();
                promptVisible = false;
                handleCommand(command);
            } else if (e.key === "Escape") {
                inputBox.remove();
                promptVisible = false;
            }
        });

        document.body.appendChild(inputBox);
        inputBox.focus();
    }

    // Hotkey listener: CTRL + .
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === ".") {
            e.preventDefault();
            if (!promptVisible) {
                promptVisible = true;
                createPrompt();
            }
        }
    });

    // Macro/function handler
    function handleCommand(command) {
        switch (command.toLowerCase()) {
            case "hello":
                alert("Hi there!");
                break;
            case "date":
                alert("Today's date is: " + new Date().toLocaleString());
                break;
            case "reload":
                location.reload();
                break;
            default:
                alert(`Unknown command: "${command}"`);
        }
    }
})();
