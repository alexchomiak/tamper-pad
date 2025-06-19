const typescript = require('@rollup/plugin-typescript');
const banner2 = require('rollup-plugin-banner2');
const fs = require('fs');


module.exports = {
    input: "src/main.ts",
    output: {
        file: "dist/script.js",
        format: "iife", // Immediately-invoked function expression (Tampermonkey-friendly)
    },
    plugins: [
        typescript(),
        banner2(() => {
            const banner = fs.readFileSync("src/banner.user.js", "utf8");
            return banner;
        }),
    ],
};