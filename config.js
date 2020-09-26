module.exports = {
  root: process.cwd(),
  port: 3000,
  hostname: "localhost",
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true,
  },
};
