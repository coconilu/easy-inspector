import reqHeaderInterceptor from "./reqHeader";
import resHeaderInterceptor from "./resHeader";
import completeHeaderInterceptor from "./completeHeader";
import conf from "./config";

console.log("easy-interceptor start");

const extendName = "easy-interceptor";
let config = conf;

// load config
function loadConfig() {
  chrome.storage.sync.get(extendName, (res) => {
    if (res[extendName]) {
      console.log("load new config", res[extendName]);
      Object.assign(config, res[extendName]);
    }
  });
}

loadConfig();

// reload config
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === "updateConfig") {
    loadConfig();
  }
});

// intercept reqHeaders
chrome.webRequest.onBeforeSendHeaders.addListener(
  reqHeaderInterceptor.intercept(config),
  reqHeaderInterceptor.filter,
  reqHeaderInterceptor.opt_extraInfoSpec
);

// intercept resHeaders
chrome.webRequest.onHeadersReceived.addListener(
  resHeaderInterceptor.intercept(config),
  resHeaderInterceptor.filter,
  resHeaderInterceptor.opt_extraInfoSpec
);

// send record
chrome.webRequest.onCompleted.addListener(
  completeHeaderInterceptor.intercept(config),
  completeHeaderInterceptor.filter,
  completeHeaderInterceptor.opt_extraInfoSpec
);
