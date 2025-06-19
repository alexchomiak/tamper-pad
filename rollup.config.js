const typescript = require('@rollup/plugin-typescript');
const replace = require('@rollup/plugin-replace');
const banner2 = require('rollup-plugin-banner2');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const fs = require('fs');

module.exports = {
  input: 'src/index.tsx',
  output: {
    file: 'dist/script.js',
    format: 'iife',
    name: 'MacroLauncher',
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    banner2(() => fs.readFileSync('public/banner.user.js', 'utf8')),
  ],
};
