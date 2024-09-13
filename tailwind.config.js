/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './grindflow/*.njk',
    './aspect-ratio-calculator/*.njk',
    './_includes/*.njk',
    './_includes/components/*.njk',
    './js/*.js}',
    './index.njk',
  ],

  theme: {
    extend: {
      aspectRatio: {
        '21/9': '21 / 9',
      },
      fontSize: {
        xxs: ['0.65rem', { lineHeight: '0.65rem' }],
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
      }
  
    },
  },
  plugins: [],
}

