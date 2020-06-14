import { createAction } from "redux-actions";

const addRecords = createAction("ADDRECORDS");
const cleanRecords = createAction("cleanRecords");

export { addRecords, cleanRecords };
