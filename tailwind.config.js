/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#2F5249',
        'accent-green': '#437057',
        'lime-green': '#97B067',
        'yellow-highlight': '#E3DE61',
        'orange-accent': '#E67E22',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      height: {
        '90vh': '90vh',
      }
    },
  },
  plugins: [],
}
