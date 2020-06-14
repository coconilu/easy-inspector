import React from "react";
import reactDOM from "react-dom";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { replaceConfig } from "./actions/config";
import { restoreOptions, receiveRecord } from "./utils";
import { HashRouter as Router } from "react-router-dom";
import { addRecords } from "./actions/record";

import store from "./store";
import App from "./App";

restoreOptions((config) => {
  console.log("loaded config", config);
  store.dispatch(replaceConfig(config));
});

store.subscribe(() => {
  console.log("store: ", store.getState());
});

receiveRecord((records) => {
  store.dispatch(addRecords(records));
});

reactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.querySelector("#app")
);
