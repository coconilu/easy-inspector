import common from "./common";
const filter = { urls: ["<all_urls>"] };
const opt_extraInfoSpec = ["responseHeaders", "extraHeaders"];

const intercept = (config) => (details) => {
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

export default { filter, opt_extraInfoSpec, intercept };
