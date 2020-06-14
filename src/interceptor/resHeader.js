import common from "./common";
const filter = { urls: ["<all_urls>"] };
const opt_extraInfoSpec = ["responseHeaders", "blocking", "extraHeaders"];

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
      console.log("res details", details);
      common.modifyHeaders(headers, rule.resHeaders);
    }
  });
  return { responseHeaders: headers };
};

export default { filter, opt_extraInfoSpec, intercept };
