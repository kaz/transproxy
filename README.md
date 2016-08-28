# transproxy

TCP transparent proxy

[![NPM](https://nodei.co/npm/transproxy.png?compact=true)](https://nodei.co/npm/transproxy/)

## install

```
npm i -g transproxy
```

## launch

#### listen on specified port

```
transproxy '{"listen":14514}'
```

#### allow only http(s)

```
transproxy '{"allowPorts":[80,443]}'
```

#### allow specific server

```
transproxy '{"allowAddress":["8.8.8.8"]}'
```

## routing

```
iptables -t nat -F
iptables -t nat -A PREROUTING -i eth0 -p tcp -j REDIRECT --to-port 14514
```

## as a service

```
[Unit]
Description=TCP transparent proxy
After=syslog.target network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/bin/transproxy '{"listen":14514,"allowPorts":[80,443]}'

[Install]
WantedBy=multi-user.target
```
