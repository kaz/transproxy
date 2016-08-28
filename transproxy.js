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
		let dst;
		
		const close = _ => {
			if(src instanceof net.Socket){
				src.destroy();
			}
			if(dst instanceof net.Socket){
				dst.destroy();
			}
		};
		
		process.on("uncaughtException", err => {
			console.error(err);
			close();
		});
		
		const origDest = original(src);
		const route = `${src.remoteAddress}:${src.remotePort} -> ${origDest.host}:${origDest.port}`;
		if(
			conf.allowPorts != null && !conf.allowPorts.some(port => port == origDest.port) ||
			conf.allowAddress != null && !conf.allowAddress.some(addr => addr == origDest.host)
		){
			console.log("NG", route);
			return;
		}
		
		dst = net.connect(origDest, _ => {
			src.on("end", close);
			dst.on("end", close);
			src.on("data", data => dst.write(data));
			dst.on("data", data => src.write(data));
			console.log("OK", route);
		});
	}).listen(conf.listen);
}
