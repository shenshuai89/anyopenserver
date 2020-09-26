const http = require("http");
const chalk = require("chalk");
const open = require("open");
// let root = process.cwd(); //会随着node执行命令的路径不同变化
const conf = require("./config");
const path = require("path");

let route = require("./route.js");
const openUrl = require("./utils/openUrl");

// 配置cli工具
class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }
  start() {
    let server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      route(req, res, filePath, this.conf);
    });
    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.log(`server running at ${chalk.blue(addr)}`);
      // openUrl(addr);
      open(addr);
    });
  }
}

module.exports = Server;
