import { handleActions } from "redux-actions";
import { addRecords, cleanRecords } from "../actions/record";

const initState = {
  records: [],
};

export default handleActions(
  {
    [addRecords().type]: (state, action) => {
      return Object.assign({}, state, {
        records: state.records.concat(action.payload),
      });
    },
    [cleanRecords().type]: (state, action) => {
      return Object.assign({}, state, initState);
    },
  },
  initState
);
