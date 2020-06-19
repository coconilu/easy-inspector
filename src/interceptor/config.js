const config = {
  switch: false,
  rules: [
    {
      urlType: "include", // ["include", "reg"]
      urlString: "",
      resourceType: "all",
      switch: true,
      reqHeaders: [{ name: "Referer", value: "www.test.com", type: "add" }],
      resHeaders: [{ name: "Test", value: "hello-world", type: "add" }],
    },
  ],
};

export default config;
