# Easy-Inspector

Easy-Inspector是一个chrome插件（开发者工具），借助它，你可以修改请求头和响应头，并且把被处理的请求收集起来，方便分析。

## 安装方式

1. 通过chrome网上应用店安装（需要科学上网），搜索Easy-Interceptor，点击安装即可

![image](https://user-images.githubusercontent.com/8131019/85934674-e88b0500-b918-11ea-8b91-b5e76af55ab2.png)

2. 

## 快速开始

1. 进入设置界面。这个工具只有一个设置界面，通过点击插件的选项进入。

![image](https://user-images.githubusercontent.com/8131019/84643928-0af04c00-af31-11ea-83e4-7b7bcf5b3492.png)

2. 插件的界面如下，有两个tab，规则和记录：

![image](https://user-images.githubusercontent.com/8131019/85934647-7aded900-b918-11ea-97d3-fe893702f22c.png)

3. 界面功能

规则tab：

顶部是规则总开关，和两个按钮：保存配置和添加Rule：

1. 在不需要使用Easy-Inspector的时候可以把总开关关闭，将对上网没有任何影响。
2. 每次修改配置都需要保存配置让它生效。
3. 可以同时添加多条Rule，并让它们都生效。

对于每一条规则：

1. URL匹配规则
1.1. 第一个下拉框是选择资源类型，如果你不明确选择哪个，建议你使用all
1.2. 第二个下拉框是选择字符串匹配模式，有include（包含）和reg（正则）两种方式，包含是指只要字符串被包含在URL里就行，底层使用`url.include(str)`匹配，正则是需要匹配正则表达式，底层使用`Reg(/str/, "i").test(url)`匹配
1.3. 第三个输入框是字符串（对应上面的str），依赖第二个下拉框的字符串匹配模式
2. 处理匹配到的url的请求头和响应头，对于每一个请求头，都有add（添加或覆盖）和delete（删除）两种操作

> 资源类型有："main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", or "other"

记录tab：

记录tab是收集了所有被匹配的请求，方便你分析：

![image](https://user-images.githubusercontent.com/8131019/85935461-a9ae7c80-b923-11ea-9b42-bb24ef8dfb5a.png)

## 支持业务场景

### 1. 绕开防盗链

有一些网站会给图片设置防盗措施，大多数的做法是校验`referer`请求头部，使用Easy-Inspector可以很方便绕开。

为了演示方便，我把一张图片放在腾讯云cos上，并设置防盗链：

图片的连接：[https://interceptor-1253621140.cos.ap-nanjing.myqcloud.com/IMG_1380.JPG](https://interceptor-1253621140.cos.ap-nanjing.myqcloud.com/IMG_1380.JPG)，当你直接访问这张图片的时候，服务器会返回错误信息给你：

![image](https://user-images.githubusercontent.com/8131019/85934937-baa7bf80-b91c-11ea-892f-558c5e3bf3b9.png)

这张图片的防盗设置如下：

![image](https://user-images.githubusercontent.com/8131019/85934919-87653080-b91c-11ea-9a11-6fd7a17cb4a8.png)

现在在Easy-Inspector里添加一条规则，如下：

![image](https://user-images.githubusercontent.com/8131019/85934979-59ccb700-b91d-11ea-9bce-82ed08b11d53.png)

再次访问图片，就可以看到图片内容，我们可以通过**记录tab**看看请求头和响应头：

![image](https://user-images.githubusercontent.com/8131019/85935033-348c7880-b91e-11ea-9c15-0a409a039346.png)

### 2. 修改cookie

cookie通常是用来校验登录状态的，比如百度，如果你已经登录过百度，那么百度首页的上方会显示你的头像和名字：

![image](https://user-images.githubusercontent.com/8131019/85935070-c5fbea80-b91e-11ea-952c-2df51a140155.png)

通过在Easy-Inspector里添加一条规则，如下：

![image](https://user-images.githubusercontent.com/8131019/85935128-8eda0900-b91f-11ea-9571-5565bade5ec1.png)

再次访问百度，就会发现没有了登录态：

![image](https://user-images.githubusercontent.com/8131019/85935138-b29d4f00-b91f-11ea-9d84-ea8e21064224.png)

通过**记录tab**可以看到，所有被匹配的请求的请求头都没有带上cookie。

### 3. 绕开同源策略

同源策略是浏览器的安全的策略，借助Easy-Inspector可以方便在开发阶段绕开同源策略，提升开发幸福指数。

为了方便演示，我们继续用百度作为例子，我们在另一个网页（只要不是百度就行，比如豆瓣），然后在控制台输入如下代码：

```javascript
fetch("https://www.baidu.com/").then(function(res) {
    return res.text()
}).then(function(text) {
    console.log(text)
})
```

然后会看到如下错误提示：

![image](https://user-images.githubusercontent.com/8131019/85935303-ca75d280-b921-11ea-81b0-9e2ff596dfb5.png)

通过在Easy-Inspector里添加一条规则，如下：

![image](https://user-images.githubusercontent.com/8131019/85935338-38ba9500-b922-11ea-8966-4f7a2caa04fb.png)

效果如下：

![image](https://user-images.githubusercontent.com/8131019/85935329-158fe580-b922-11ea-9ca2-e70bf20b7c9e.png)


### 4. 更多

互联网世界中HTTP协议占据大头，很多业务场景可以通过处理请求头和响应头完成。

比如通过修改请求头中的`User-Agent`，可以伪装自己的用户代理。

还有更多的使用场景等待你发掘。

## 感谢

这个插件主要依赖Ant Design UI组件。

Logo是借用了阿里云官网的图标([iconfont](https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.de12df413&cid=16472)):

<img src="https://bayes-1253621140.cos.ap-guangzhou.myqcloud.com/logo128.png" align="right" width="120" height="120" />

