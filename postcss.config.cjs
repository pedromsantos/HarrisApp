module.exports = {
  plugins: {
    tailwindcss: require.resolve('tailwindcss'),
    autoprefixer: {
      browsers: ['last 2 versions', '> 1%', 'not dead'],
    },
  },
};
