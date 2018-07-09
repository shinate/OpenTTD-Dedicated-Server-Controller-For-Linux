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

## 添加到全局命令

```
ln -s {your own path}/bin/otds /usr/sbin/otds
```

## 运行

```
otds {list|start|stop|clear|stats|backup}
```

详细说明参见 ```otds -h (--help)```

## TODO

scn开图无法实现，只能制作好图使用sav开图