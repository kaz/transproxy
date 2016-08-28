"use strict";
const native = require("./build/Release/native");
module.exports = socket => native.getOriginalDst(socket._handle.fd);
