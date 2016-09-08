#!/usr/bin/env node

"use strict";

const os = require("os");
const net = require("net");
const cluster = require("cluster");
const original = require("./original-dst");

const conf = {
	listen: 14514,
	allowPorts: null,
	allowAddress: null,	
};

if(process.argv.length > 2){
	const userConf = JSON.parse(process.argv[2]);
	for(const key in conf){
		if(key in userConf){
			conf[key] = userConf[key];
		}
	}
}

if(cluster.isMaster){
	console.log(conf);
	
	cluster.on("exit", _ => cluster.fork());
	for(let i = 0; i < os.cpus().length; i++){
		cluster.fork();
	}
}else{
	net.createServer(src => {
		const origDest = original(src);
		if(
			conf.allowPorts != null && !conf.allowPorts.some(port => port == origDest.port) ||
			conf.allowAddress != null && !conf.allowAddress.some(addr => addr == origDest.host)
		){
			console.log(`DENY ${src.remoteAddress}:${src.remotePort} -> ${origDest.host}:${origDest.port}`);
			src.destroy();
			return;
		}
		
		const dst = net.connect(origDest, _ => {
			src.pipe(dst);
			dst.pipe(src);
		});
	}).listen(conf.listen);
}
