## 简介

使用 [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/) 集成方案版本开发的留言板管理端，提供如下功能：


- 用户管理
    
    允许管理员查看用户列表，根据姓名、性别、手机号、邮箱、账号状态等进行检索，并允许 `禁用|启用` 用户账号

- 留言管理

    允许管理员查看留言列表，根据姓名、性别、手机号、邮箱、标题等进行检索，并允许删除留言

- 评论管理

    允许管理员查看指定留言的评论列表，并允许删除评论
    
## 安装

- 克隆代码

    ```
    git clone git@github.com:jormin/message-backend.git
    ```

- 安装扩展

    ```
    yarn install
    ```

- 修改配置

    ```
    # 修改接口地址
    vim config/xxx.js
    ```

- 启动服务

    ```
    # 开发时编译及热加载
    npm run dev
    
    # 编译生产版本
    npm run build:[prod:site]    
    ```
