// var ethWallet = require('ethereumjs-wallet')
var fs = require('fs')
const { exec } = require('child_process');

var alpha = '12345qweasdzxcrfQWEASDZXCRF'
var keyfile = fs.readFileSync('./UTC--2016-09-04T08-48-07.489494500Z--c6b815e636df892e5fad9db286f72447b13bc920').toString()
keyfile = keyfile.toLowerCase()

function getPass(prefix, cb) {
  let chain = Promise.resolve()
  for(let char of alpha) {
    chain.then(() => {
      return cb(prefix + char)
    })
  }
  return chain
}

function deepPass(depth, prefix, cb) {
  if (depth) {
    return getPass(prefix, new_prefix => deepPass(depth - 1, new_prefix, cb))
  } else {
    return getPass(prefix, cb)
  }
}

for(let n = 2; n < 3; n++) {
  console.log(n)
  deepPass(n, process.argv[2] || '', (pass) => {
    return new Promise((resolve, reject) => {
      exec(
        `./cpp-ethereum/build/eth/eth account import UTC--2016-09-04T08-48-07.489494500Z--c6b815e636df892e5fad9db286f72447b13bc920 ${pass}`,
        (err, stdout, stderr) => {
          if (err) {
            if (!stderr.match('Invalid key')) {
              reject(err);
            }
          } else {
            console.log(pass)
            process.exit()
          }
          resolve();
        }
      );
    });
  });
}
