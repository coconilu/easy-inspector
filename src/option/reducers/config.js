import { handleActions } from "redux-actions";
import { addRule, delRule, changeRule, replaceConfig } from "../actions/config";

const initState = {
  switch: false,
  rules: [
    {
      urlType: "include", // ["include", "reg"]
      urlString: "",
      resourceType: "all",
      switch: true,
      reqHeaders: [
        { name: "Referer", value: "www.baidu.com", type: "add" },
      ],
      resHeaders: [{ name: "test", value: "test1", type: "add" }],
    },
  ],
};

export default handleActions(
  {
    [addRule().type]: (state, action) => {
      return Object.assign({}, state, {
        rules: state.rules.concat([action.payload]),
      });
    },
    [delRule().type]: (state, action) => {
      return Object.assign({}, state, {
        rules: state.rules.filter(
          (rule, index) => index !== action.payload.index
        ),
      });
    },
    [changeRule().type]: (state, action) => {
      return Object.assign({}, state, {
        rules: state.rules.map((rule, index) => {
          return index === action.payload.index ? action.payload.rule : rule;
        }),
      });
    },
    [replaceConfig().type]: (state, action) => {
      return Object.assign({}, state, action.payload);
    },
  },
  initState
);
