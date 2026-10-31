/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1D416D',
          deep: '#142C4E',
        },
        'blue-light': '#EAF2FC',
        'bg-light': '#F7F9FC',
        'text-main': '#182638',
        'text-secondary': '#66758A',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
};
