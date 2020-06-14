const extendName = "easy-interceptor";

const defaultConfig = {
  switch: false,
  rules: [],
};

let appConfig = defaultConfig;

const resourceTypes = [
  "all",
  "main_frame",
  "sub_frame",
  "stylesheet",
  "script",
  "image",
  "font",
  "object",
  "xmlhttprequest",
  "ping",
  "csp_report",
  "media",
  "websocket",
  "other",
];

const urlTypes = ["include", "reg"];

const headerType = ["add", "delete"];

const defaultRule = {
  urlType: "include", // ["include", "reg"]
  urlString: "",
  resourceType: "all",
  switch: true,
  reqHeaders: [],
  resHeaders: [],
};

const defaultHeader = {
  name: "",
  value: "",
  type: "add",
};

const routes = [
  { route: "/rules", title: "规则" },
  { route: "/records", title: "记录" },
];

function saveOptions(config, cb) {
  runAtExtension() &&
    chrome.storage.sync.set({ [extendName]: config }, () => {
      chrome.runtime.sendMessage({ type: "updateConfig" });
      console.log("save new config", config);
      cb && cb();
    });
}

function restoreOptions(cb) {
  runAtExtension() &&
    chrome.storage.sync.get([extendName], (res) => {
      if (res[extendName]) {
        appConfig = res[extendName];
      }
      cb && cb(appConfig);
    });
}

function receiveRecord(cb) {
  runAtExtension() &&
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message);
      if (message.type === "addRecord") {
        cb && cb(message.payload);
      }
    });
}

function runAtExtension() {
  return !!chrome.storage;
}

function newRule() {
  return Object.assign({}, defaultRule);
}

function newHeader() {
  return Object.assign({}, defaultHeader);
}

function Header() {
  this.name = "";
  this.value = "";
}

function combineHeaders(reqHeaders, resHeaders) {
  const length = Math.max(reqHeaders.length, resHeaders.length);
  const headers = new Array(length);
  let i = 0;
  while (i < headers.length) {
    headers[i] = {
      reqHeader: reqHeaders[i] || new Header(),
      resHeader: resHeaders[i] || new Header(),
    };
    i++;
  }
  return headers;
}

export {
  resourceTypes,
  urlTypes,
  headerType,
  routes,
  saveOptions,
  restoreOptions,
  runAtExtension,
  newRule,
  newHeader,
  combineHeaders,
  receiveRecord,
};
