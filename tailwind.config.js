/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,njk}"],
  theme: {
    extend: {
      aspectRatio: {
        '21/9': '21 / 9',
      },
      fontSize: {
        xxs: ['0.65rem', { lineHeight: '0.65rem' }],
      },
  
    },
  },
  plugins: [],
}

