/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/tw-elements/dist/js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                "king": "#07beb8",
                "queen": "#fc2f00",
                "dark": "#121c2d",
                "light": "#f6f6f6",
                "danger": "#d90429",
                "success": "#008000",
                "warning": "#f7b801",
                "info": "#2e3192",
            },
        },
    },
    plugins: [require("tw-elements/dist/plugin")],
    darkMode: 'class',
}

