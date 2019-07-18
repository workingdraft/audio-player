module.exports = process.env.NODE_ENV === 'test' ? {
  presets: [
    '@babel/preset-env',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
} : {
  // Configuration suitable for your targets.
  // Possibly including `@babel/plugin-transform-runtime`.
}
