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

export default config;
