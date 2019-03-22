# OpenTTD Dedicated Server Controller For Linux

## 目录结构

```
|- bin/
    |- otds                控制脚本

|- kernel/                 openttd 程序所在目录，可直接下载或源码编译
    |- openttd
    |- ...

|- servers/

    |- 服务器1/
        |- openttd.cfg     配置文件
        |- game/           脚本
            |- library/    脚本库文件
        |- newgrf/         GRF目录

    |- 服务器2/
        |- ...
```

## 设置 SERVER_ROOT

```
vim otds
```

```bash
SERVER_ROOT="{your own path}"
```

## 添加到全局命令

```
ln -s {your own path}/bin/otds /usr/sbin/otds
```

## 运行

```
otds {list|start|stop|clear|stats|backup}
```

详细说明参见 ```otds -h (--help)```

## 关于服务器的配置

### Timing variables for network-play

| Variable | Values | Meaning |
|---|---|---|
| max_join_time | 0-65535 | Maximum amount of time, in game ticks, a client may take to sync up during joining. |
| pause_on_join | true/false | Pause the game when people join. |
| max_download_time | 0-65535 | Maximum amount of time, in game ticks, a client may take to download the map. |
| max_lag_time | 0-65535 | Maximum amount of time, in game ticks, a client may be lagging behind the server. |

Note that all values are in game ticks, that is, 1/74th of a game day (1/30th of a second).
Increase the values until your users can connect normally. If you set them too long however, there is an increased danger that people take too long to connect, and just waste bandwidth.
For larger maps, it is highly recommended to enable the pause_on_join, as it eliminates the need to catch-up with the game after map downloading.

## TODO

scn开图无法实现，只能制作好图使用sav开图