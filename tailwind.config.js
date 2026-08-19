/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f4f4f4',
        },
        primary: {
          DEFAULT: '#0f62fe',
          hover: '#0043ce',
        },
        text: {
          primary: '#161616',
          secondary: '#525252',
          placeholder: '#a8a8a8',
        },
        border: {
          DEFAULT: '#e0e0e0',
          strong: '#8d8d8d',
        },
        danger: {
          DEFAULT: '#da1e28',
          hover: '#b81922',
        },
        success: {
          DEFAULT: '#198038',
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
