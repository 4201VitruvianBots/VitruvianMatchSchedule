import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
                colors: {
                        barGreen: '#38761d',
                        buttonOuterGreen: "#499529",
                        buttonInnerGreen: "#6aa84f",
                },
        },
    },
    plugins: [
        plugin(({matchVariant}) => {
            matchVariant('theme', theme => `.theme-${theme} &`, {
                values: Object.fromEntries(['gdark', 'vlight', 'vdark'].map(e => [e, e])),
            })
        }),
    ],
}
