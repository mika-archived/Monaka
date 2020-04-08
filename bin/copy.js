/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs-extra");

fs.copySync("./src", "./dist", {
  filter(src, _) {
    if (fs.statSync(src).isDirectory()) {
      return true;
    }

    return src.endsWith(".css");
  },
});
