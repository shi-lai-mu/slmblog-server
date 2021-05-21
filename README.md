<div align="center">
  <img width="300"src="https://slmblog.com/git_slmblog_logo_mini.png" alt="SLM-BLOG LOGO"/>

  <p align="center">
    <a href="https://github.com/Microsoft/TypeScript">
      <img src="https://img.shields.io/badge/typescript-4.0.3-brightgreen" alt="typescript">
    </a>
    <a href="https://opensource.org/licenses/ISC">
      <img src="https://img.shields.io/badge/License-ISC-blue" alt="ISC License" />
    </a>
  </p>
</div>


## [SLM BLOG SERVER](https://slmblog.com) [此版本暂未上线，处于内测开发阶段]
SLMBLOG 是使用 NuxtJs(前端) + NestJs(后端) + TypeScript(语言) + Redis(缓存) + OSS(存储) + GitHub Actions(自动化) +  等技术开发的个人博客系统，前后端分离扁平化UI。<br>
项目基于模块化开发，最深至2级子模块，模块之间不可互相耦合一级模块移除子模块功能无感移除，模块下独立抽离出依赖文件如当前模块（实体、类声明、入参校验、常量）等。

> 本后端包含了 Swagger 每个接口都经过多次调试，且有详细的字段备注<br>
> 开发环境下启动项目时typeorm会自动 创建/更新 数据库表结构，但须提前创建配置项[database](https://github.com/shi-lai-mu/slmblog-server/blob/master/src/configs/default.cfg.ts#L27)的库名


功能:

 - [x] 文章业务 [[ArticleBusinessModule](https://github.com/shi-lai-mu/slmblog-server/blob/master/src/modules/article/index.module.ts#L13)]
    + [x] 发布文章
        + [x] 文章/标题 敏感词检测
        + [x] 文章设置
    + [x] 获取文章内容
    + [x] 获取文章列表
    + [x] 获取文章简洁信息
    + [x] Redis化处理用户点(赞/踩)行为
    + [x] 类目
        + [x] 新增类目
        + [x] 获取类目信息
        + [x] 获取所有类目列表
    + [x] 评论
        + [x] 发表评论
        + [x] 分页获取文章评
 - [ ] 通知业务 [[NotifyBusinessModule](https://github.com/shi-lai-mu/slmblog-server/blob/master/src/modules/notify/index.module.ts#L12)]
    + [x] 邮件
        + [x] 批量发送邮件
        + [x] 全局邮件白名单
        + [x] 全局邮件冷却
        + [x] 全局邮件日志
        + [x] Redis处理日志
        + [x] 邮件模板读取
    + [ ] 友链
        + [x] 获取友情链接
        + [ ] 提交友情链接
    + [x] 公告
        + [x] 获取置顶的常规公告
- [x] 资源业务 [[ResourcesBusinessModule](https://github.com/shi-lai-mu/slmblog-server/blob/master/src/modules/resources/index.module.ts#L9)]
    + [x] 图像资源
        + [x] 根据昵称生成游客SVG头像
- [ ] 用户业务 [[UserBusinessModule](https://github.com/shi-lai-mu/slmblog-server/blob/master/src/modules/user/index.module.ts#L14)]
    + [x] 注册
        + [x] (找回/注册)发送 账号邮箱验证 邮件通知
    + [x] 登录
        + [ ] QQ登录
        + [ ] 微博登录
        + [x] 邮箱/账号 可作为登录依据
        + [x] 实现多端单点登录
    + [x] 验证 账号邮箱
    + [x] 检测 账号/邮箱 是否可注册
    + [x] 刷新令牌
    + [x] 获取个人信息
    + [x] 获取其他用户数据
    + [x] 配置
        + [x] 保存用户全部配置
        + [x] 获取用户全部配置


-------
喜欢的欢迎 star 或 fork 鼓励一下，谢谢各位大佬!