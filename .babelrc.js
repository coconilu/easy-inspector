module.exports = function (api) {
  const config = {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3,
          modules: false,
          targets: "since 2018, not dead",
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      ["@babel/plugin-transform-runtime", { useESModules: true, corejs: 3 }],
    ],
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
