const { exec } = require("child_process");
// 自动打开url地址
module.exports = (url) => {
  switch (process.platform) {
    // ios系统
    case "darwin":
      exec(`open ${url}`);
      break;
    case "win32":
      exec(`start ${url}`);
      break;
  }
};
