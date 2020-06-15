(function () {
  'use strict';

  function matchType(type, details_type) {
    return type === "all" ? true : details_type === type;
  }

  function matchURL(url, rule) {
    if (rule.urlType === "reg") {
      return RegExp(rule.urlString, "i").test(url);
    } else if (rule.urlType === "include") {
      return url.indexOf(rule.urlString) >= 0;
    }
    return true;
  }

  function modifyHeaders(targetHeaders, ruleHeaders) {
    const targetHeaderKeys = targetHeaders.reduce((acc, cur) => {
      acc.push(cur.name);
      return acc;
    }, []);
    let existIndex = 0;
    ruleHeaders.forEach((header) => {
      existIndex = targetHeaderKeys.indexOf(header.name);
      if (existIndex >= 0) {
        // replace or delete for existence
        if (header.type === "add") {
          targetHeaders[existIndex].value = header.value;
        } else if (header.type === "delete") {
          targetHeaders.splice(existIndex, 1);
          targetHeaderKeys.splice(existIndex, 1);
        }
      } else {
        // add for inexistence
        if (header.type === "add") {
          targetHeaders.push({ name: header.name, value: header.value });
          targetHeaderKeys.push(header.name);
        }
      }
    });
  }

  function Record(id, url, method, resourceType, ruleType, urlString) {
    this.id = id || "";
    this.url = url || "";
    this.method = method || "";
    this.resourceType = resourceType || "";
    this.ruleType = ruleType || "";
    this.urlString = urlString || "";
    this.reqHeaders = [];
    this.resHeaders = [];
  }

  const recordManager = ((map) => {
    return {
      collectRecord: (id, record) => {
        const _rec = map.get(id) || {};
        Object.assign(_rec, record);
        map.set(id, _rec);
      },
      getRecord: (id) => {
        return map.get(id) || {};
      },
      deleteRecord: (id) => {
        map.delete(id);
      },
    };
  })(new Map());

  function sendRecords(records) {
    const _rec = Array.isArray(records) ? records : [records];
    chrome.runtime.sendMessage({ type: "addRecord", payload: _rec });
  }

  var common = {
    matchType,
    matchURL,
    modifyHeaders,
    Record,
    sendRecords,
    recordManager,
  };

  const filter = { urls: ["<all_urls>"] };
  const opt_extraInfoSpec = ["requestHeaders", "blocking", "extraHeaders"];

  const intercept = (config) => (details) => {
    const rules = config.rules;
    const headers = details.requestHeaders || [];
    if (!config.switch) return;
    rules.forEach((rule) => {
      if (
        rule.switch &&
        common.matchURL(details.url, rule) &&
        common.matchType(rule.resourceType, details.type)
      ) {
        console.log("req details", details);
        common.modifyHeaders(headers, rule.reqHeaders);
        common.recordManager.collectRecord(details.requestId, {
          id: details.requestId,
          url: details.url,
          method: details.method,
          resourceType: details.type,
          reqHeaders: headers,
          urlType: rule.urlType,
          urlString: rule.urlString,
        });
      }
    });
    return { requestHeaders: headers };
  };

  var reqHeaderInterceptor = { filter, opt_extraInfoSpec, intercept };

  const filter$1 = { urls: ["<all_urls>"] };
  const opt_extraInfoSpec$1 = ["responseHeaders", "blocking", "extraHeaders"];

  const intercept$1 = (config) => (details) => {
    const rules = config.rules;
    const headers = details.responseHeaders || [];
    if (!config.switch) return;
    rules.forEach((rule) => {
      if (
        rule.switch &&
        common.matchURL(details.url, rule) &&
        common.matchType(rule.resourceType, details.type)
      ) {
        console.log("res details", details);
        common.modifyHeaders(headers, rule.resHeaders);
      }
    });
    return { responseHeaders: headers };
  };

  var resHeaderInterceptor = { filter: filter$1, opt_extraInfoSpec: opt_extraInfoSpec$1, intercept: intercept$1 };

  const filter$2 = { urls: ["<all_urls>"] };
  const opt_extraInfoSpec$2 = ["responseHeaders", "extraHeaders"];

  const intercept$2 = (config) => (details) => {
    const rules = config.rules;
    const headers = details.responseHeaders || [];
    if (!config.switch) return;
    rules.forEach((rule) => {
      if (
        rule.switch &&
        common.matchURL(details.url, rule) &&
        common.matchType(rule.resourceType, details.type)
      ) {
        console.log("complete details", details);
        common.recordManager.collectRecord(details.requestId, {
          resHeaders: headers,
        });
        common.sendRecords(common.recordManager.getRecord(details.requestId));
        common.recordManager.deleteRecord(details.requestId);
      }
    });
  };

  var completeHeaderInterceptor = { filter: filter$2, opt_extraInfoSpec: opt_extraInfoSpec$2, intercept: intercept$2 };

  const config = {
    switch: false,
    rules: [
      {
        urlType: "include", // ["include", "reg"]
        urlString: "",
        resourceType: "all",
        switch: true,
        reqHeaders: [
          { name: "Referer", value: "https://www.tp8.com/", type: "add" },
        ],
        resHeaders: [{ name: "test", value: "test1", type: "add" }],
      },
    ],
  };

  console.log("easy-interceptor start");

  const extendName = "easy-interceptor";
  let config$1 = config;

  // load config
  function loadConfig() {
    chrome.storage.sync.get(extendName, (res) => {
      if (res[extendName]) {
        console.log("load new config", res[extendName]);
        Object.assign(config$1, res[extendName]);
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
    reqHeaderInterceptor.intercept(config$1),
    reqHeaderInterceptor.filter,
    reqHeaderInterceptor.opt_extraInfoSpec
  );

  // intercept resHeaders
  chrome.webRequest.onHeadersReceived.addListener(
    resHeaderInterceptor.intercept(config$1),
    resHeaderInterceptor.filter,
    resHeaderInterceptor.opt_extraInfoSpec
  );

  // send record
  chrome.webRequest.onCompleted.addListener(
    completeHeaderInterceptor.intercept(config$1),
    completeHeaderInterceptor.filter,
    completeHeaderInterceptor.opt_extraInfoSpec
  );

}());
