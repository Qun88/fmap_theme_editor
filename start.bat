@echo off
echo Start ThemeEditor Service
rem 以下部分的路径改为编辑器程序所在的文件夹
call node c:\webroot\themeEditor\server\server.js
pause
exit