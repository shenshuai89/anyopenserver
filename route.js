const fs = require("fs");
var urlencode = require("urlencode");
const Handlebars = require("handlebars");
const path = require("path");
const { promisify } = require("util");
let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
const mine = require("mime");
const compress = require("./utils/compress");
// const config = require("./config");
const range = require("./utils/range");
// 判断是否使用缓存
const cache = require("./utils/cache");
const tplPath = path.join(__dirname, "./template/dir2.tpl");

module.exports = async (req, res, filePath, config) => {
  const source = await fs.readFileSync(tplPath);
  const template = Handlebars.compile(`${source.toString()}`);
  // 处理中文命名的文件无法正常显示
  filePath = urlencode.decode(filePath);
  try {
    const stats = await stat(filePath);
    const fileType = mine.getType(path.extname(filePath));
    if (stats.isFile()) {
      res.setHeader("Content-Type", `${fileType}; charset=utf-8`);
      // 将文件按照流的方式返回客户端
      // fs.createReadStream(filePath).pipe(res);

      // 判断缓存
      if (cache(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let result;
      const { code, start, end } = range(stats.size, req, res);
      if (code == 200) {
        res.statusCode = 200;
        result = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        result = fs.createReadStream(filePath, { start, end });
      }
      // 匹配到可以被压缩的文件时，对文件进行压缩
      if (filePath.match(config.compress)) {
        result = compress(result, req, res);
      }
      result.pipe(res);

      // return;
    } else if (stats.isDirectory()) {
      let files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", `${fileType}; charset=utf-8`);
      const dir = path.relative(process.cwd(), filePath);
      const data = {
        files: files.map((file) => {
          return {
            file,
            icon: mine.getType(file) || "文件夹",
          };
        }),
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : "",
        // dir: path.join(__dirname),
      };
      // console.log("filePath", process.cwd(), filePath);
      // console.log("tmp", source.toString());
      res.end(template(data));
      // res.end(files.join(","));
    }
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain;charset=utf-8");
    res.end("访问的路径不存在");
  }
};
