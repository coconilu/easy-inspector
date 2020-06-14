import common from "./common";
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

export default { filter, opt_extraInfoSpec, intercept };
