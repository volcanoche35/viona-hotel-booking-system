/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        viona: {
          bg: '#F4EDE4',
          accent: '#D9835D',
          text: '#3E3C3A',
          detail: '#8A9A9B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      borderRadius: {
        'viona': '2.5rem'
      }
    }
  },
  plugins: [],
}

