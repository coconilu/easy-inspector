module.exports = function (api) {
  const config = {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3,
          modules: false,
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [],
  };
  if (api.env("production")) {
    // production env
    config.plugins.push(["transform-remove-console"]);
    console.log("babel production env.");
  } else {
    // development env
    console.log("babel development env.");
  }
  return config;
};
