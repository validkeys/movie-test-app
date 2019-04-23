// The lab-babel transform skips files
// where the filename begins with node_modules.
// In our monorepo case, however, the path to node_modules can start
// with ../../ so just wrapping the lab-babel script
// to test for the existance of node_modules and not just whether it's
// at the beginning of a line

var labBabel = require('lab-babel')
var newLabBabel = labBabel.map(({ ext, transform }) => {
  const fnc = (content, filename) => {
    if (/node_modules/.test(filename)) {
      return content
    }

    return transform.call(transform, content, filename)
  }
  return {
    ext,
    transform: fnc
  }
})
module.exports = newLabBabel
