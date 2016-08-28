# transproxy

TCP transparent proxy

[![NPM](https://nodei.co/npm/transproxy.png?compact=true)](https://nodei.co/npm/transproxy/)

## install

```
npm i -g transproxy
```

## launch

```
transproxy
```

## routing

```
iptables -t nat -F
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport  80 -j REDIRECT --to-port 14514
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 14514
```

## as a service

```
[Unit]
Description=TCP transparent proxy
After=syslog.target network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/bin/transproxy

[Install]
WantedBy=multi-user.target
```
