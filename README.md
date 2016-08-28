# transproxy

TCP transparent proxy

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
ExecStart=transproxy

[Install]
WantedBy=multi-user.target
```
