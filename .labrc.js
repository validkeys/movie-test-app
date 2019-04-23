const Path = require('path')
module.exports = {
  colors: true,
  transform: Path.resolve(__dirname,'tests','utils','lab-babel'),
  verbose: process.env.CI ? false : true,
  leaks: false,
  ignore: "_,__core-js_shared__,node_modules",
  sourcemaps: true,
  environment: "test",
  coverage: false,
  contextTimeout: 10000,
  timeout: 10000,
  assert: "code",
  bail: false,
  dry: false
}
