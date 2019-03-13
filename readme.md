# 蜂鸟地图主题文件编辑工具

提供一个所见即所得的主题编辑工具，目前的版本还非常简单，仅仅是修改主题文件后提交到后端进行备份保存并应用更新。

## 使用方法

* 下载安装 Node.js 环境 [Windows](https://nodejs.org/dist/v10.15.3/node-v10.15.3-x64.msi)
* 下载安装 Git 环境 [Windows](https://git-scm.com/download/win)
* 拷贝工具代码到磁盘目录
* 运行目录中的 start.bat
* 在浏览器中输入 http://localhost:3000/ 启动即可
* 每次修改主题后，点击 `预览` 按钮即可生效

## 清除和还原备份主题

由于每次保存预览主题改动都会生成一个备份文件，随着时间越长可能会导致备份文件数量增加，使用目录中的 `clean.bat` 命令清除备份的主题。备份的主题存放在 `server` 目录下的 `bak` 文件夹。