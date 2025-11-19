/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'matrix-black': '#0D0208',
                'matrix-green': '#00FF41',
                'matrix-dark-green': '#008F11',
                'matrix-dim': '#003B00',
            },
            fontFamily: {
                'matrix': ['"Courier Prime"', 'monospace'],
            },
        },
    },
    plugins: [],
}
