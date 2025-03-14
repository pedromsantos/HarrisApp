module.exports = {
  plugins: {
    tailwindcss: require.resolve('tailwindcss'),
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead'],
    },
  },
};
