module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
    	colors: {
    		primary: '#5222d0',
    		secondary: '#ec615b'
    	},
      gridAutoColumns: {
        '270': '270px',
        '220': '220px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
