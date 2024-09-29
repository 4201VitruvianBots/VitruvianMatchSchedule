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
                        barGreen: '#005F00',
                        buttonOuterGreen: "#499529",
                        buttonInnerGreen: "#6aa84f",
                        allianceDarkBlue: "#004172",
                        allianceLightBlue: "#0066b3",
                        allianceDarkRed: "#830e12",
                        allianceLightRed: "#ec1d23",
                        allianceDarkGray: "#231e1f",
                        allianceLightGray: "#eeeeee",
                },
                dropShadow: {
                    '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
                    '4xl': [
                        '0 35px 35px rgba(0, 0, 0, 0.25)',
                        '0 45px 65px rgba(0, 0, 0, 0.15)'
                    ]
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
