import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import styles from "rollup-plugin-styles";
import filesize from 'rollup-plugin-filesize';

export default commandLineArgs => [
  {
    input: "src/interceptor/index.js",
    output: {
      file: "dist/interceptor.js",
      format: "iife",
    },
  },
  {
    input: "src/option/index.js",
    output: {
      file: "dist/option.js",
      format: "iife",
    },
    onwarn (warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
    },
    watch: {
      exclude: "node_modules/**",
    },
    plugins: [
      styles(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      resolve(),
      commonjs(),
      replace({
        "process.env.NODE_ENV": "'production'",
      }),
      filesize(),
      commandLineArgs.dev && serve({ open: true, contentBase: "./" }),
      commandLineArgs.dev && livereload("dist"),
    ],
  },
];
