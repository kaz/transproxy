#!/usr/bin/env node

"use strict";

const os = require("os");
const net = require("net");
const cluster = require("cluster");
const original = require("./original-dst");

if(cluster.isMaster){
	cluster.on("exit", _ => cluster.fork());
	for(let i = 0; i < os.cpus().length; i++){
		cluster.fork();
	}
}else{
	net.createServer(src => {
		const dst = net.connect(original(src), _ => {
			const close = _ => {
				src.end();
				dst.end();
			};
			src.on("end", close);
			dst.on("end", close);
			src.on("data", data => dst.write(data));
			dst.on("data", data => src.write(data));
		});
	}).listen(14514);
}
