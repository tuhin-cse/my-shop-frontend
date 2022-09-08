module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js", "./layouts/**/*.js"],
  theme: {
    extend: {
      colors: {
        main: '#5753C9',
        main2: '#3D4E81',
        sidebar: '#283C6D',
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
