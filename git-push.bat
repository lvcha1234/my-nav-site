@echo off
chcp 65001 >nul
title 一键提交并推送代码到Git

echo ==============================================
echo  正在提交并推送代码到仓库...
echo ==============================================
echo.

echo [1/3] 添加所有修改文件...
call git add .
if %errorlevel% neq 0 (
    echo ❌ 添加文件失败，请检查Git配置！
    pause
    exit /b 1
)

echo [2/3] 提交代码...
set /p commit_msg=请输入本次提交说明（直接回车使用默认说明）：
if "%commit_msg%"=="" (
    set commit_msg=自动更新代码
)
call git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ❌ 提交失败（可能没有修改文件），跳过推送。
    pause
    exit /b 0
)

echo [3/3] 推送到远程仓库...
call git push origin main
if %errorlevel% neq 0 (
    echo ❌ 推送失败，请检查网络或远程仓库配置！
    pause
    exit /b 1
)

echo.
echo ==============================================
echo ✅ 代码已成功提交并推送！
echo 等待 Cloudflare Pages 自动构建部署...
echo ==============================================
pause