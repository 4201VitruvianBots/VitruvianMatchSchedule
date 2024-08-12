import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
                backgroundColor: ['odd', 'even'],
                backgroundImage: theme => ({
                    'top-bar': "url('./src/assets/top_bar.png')",
                }),
                colors: {
                        barGreen: '#38761d',
                        buttonOuterGreen: "#499529",
                        buttonInnerGreen: "#6aa84f",
                },
                fontFamily: {
                    'sans': ['Arial', ...defaultTheme.fontFamily.sans],
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
