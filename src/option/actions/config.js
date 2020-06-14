import { createAction } from "redux-actions";

const addRule = createAction("ADDRULE");
const delRule = createAction("DELRULE");
const changeRule = createAction("CHANGERULE");
const replaceConfig = createAction("REPLACECONFIG");

export { addRule, delRule, changeRule, replaceConfig };
