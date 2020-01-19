const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.html", "./src/**/*.svelte"],

  whitelistPatterns: [/svelte-/, /items-end/, /bg-gray-200/, /bg-blue-200/],

  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

const production = !process.env.ROLLUP_WATCH;

module.exports = {
  plugins: [require("tailwindcss"), ...(production ? [purgecss] : [])]
};
