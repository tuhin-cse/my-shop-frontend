module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js", "./layouts/**/*.js"],
  theme: {
    extend: {
      colors: {
        main: '#626fe6',
        main2: '#525fd6',
        light: '#F3F4F9',
      },
      spacing: {
        sidebar: 250,
        'sidebar-mini': 65,
      }
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
