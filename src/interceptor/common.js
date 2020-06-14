function matchType(type, details) {
  return type === "all" ? true : details.type === type;
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
        targetHeaders.splice(i, 1);
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

export default {
  matchType,
  matchURL,
  modifyHeaders,
  Record,
  sendRecords,
  recordManager,
};
