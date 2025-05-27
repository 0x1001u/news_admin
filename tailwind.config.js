// tailwind.config.js

module.exports = {
  darkMode: 'class', // 启用基于 class 的暗色模式
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { // 定义一个自定义的 primary 颜色
          DEFAULT: '#DC2626', // 红色 (Tailwind red-600) 作为默认主色
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#FB7171',
          500: '#EF4444',
          600: '#DC2626', // 用于按钮、选中状态等
          700: '#B91C1C', // 用于 hover 状态或更深色的强调
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        // 可以根据需要定义其他自定义颜色
      },
      // ... 其他扩展
    },
  },
  plugins: [],
}

