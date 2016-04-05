#Chat Room

> 基于 meteor.js + react + react-router 实现简易微信聊天功能APP

测试版

[demo地址](http://133.130.90.204:3000/)

测试账号：user1
测试密码：111111
测试账号2：user2
测试密码：111111

btw：
唠下嗑~ 这个简易 App 是一个朋友给我的一个测试demo，前前后后一共两天时间去实现它。
有兴趣的朋友可以参考一下也自己去实现一下，多多推广一下 Meteor 在国内的知名度。

说一下开发过程中遇见的问题：

1.数据库设计，模仿的大部分网站的类似私信的设计。由于对非关系型数据库的不充分理解，只好暂时以关系型数据库的理解去设计了它。

User，Meteor自身有一整套用户系统。

```
meteor add accounts-ui accounts-password
```
> 参考文档链接：https://www.meteor.com/tutorials/react/adding-user-accounts

Msgs，自己简单设计的消息文档：

```
Msgs = {
  _id: String,
  sender: {
    id: String,
    name: String,
  },
  receiver: {
    id: String,
    name: String
  },
  content: String,
  time: Date,
  isUnread: true
}
```
如果需要添加其他功能可以考虑修改这个文档结构，比如需要增加删除私信的功能，则需要添加两个属性：user(obj) 和 friend(obj) 两个属性

2.Meteor + react 学习

之前没有接触过 Meteor 和 react ，但是接触过 express 和 vue，在学习过程中更多是一种类比的思想在学习。

React 和 Vue 都是 mvvm 的客户端框架

Meteor 和 Express 都是基于 Node 实现的服务端框架

但是！ Meteor 作为一项十分牛逼的技术面世(尤大之前从事的Meteor公司出品的技术，可以google一记这个公司，相当牛逼)，其实是作为一个JS的全栈框架设计的。所以之前将 Meteor 和 Express 做类比也并非恰当。

提供一个最简单的demo，可以配合文档，一边阅读一边撸码来感受一下 Meteor 的魅力。

[Todo App With React](https://www.meteor.com/tutorials/react/creating-an-app)

其中遇见了数不清的小坑 ( 主要还是自己阅读API的时候大部分是断章取义的在阅读 ) ：

react 的 `this.refs` 无法获取到其他组件上的 ref 标签

meteor 的 subscribe 貌似只能配合数据库操作 `(xxx.find({}))` 这样来实现，不能直接返回自定义在 `publish` 里的变量。

...

希望大家伙能够更加仔细的阅读官方文档，再投入开发，不然会像我一样，遇见本来不需要面对的无数小坑。

3.发布上线

我的 demo 是通过朋友的服务器进行发布的，并不需要配置mongodb的数据库，因为我用的是 meteor 自带的数据库。如果想要导入生产数据，可以找到 .meteor/local/db 文件，然后更换它。或者直接部署自己的数据库。

当然，meteor 也可以打包成一个 App 的形式，分为 IOS 和 Android ,提供的官方demo里也有相应的教程。

4.体会

短时间的学习当然是浮萍草，很多时候都是一头雾水，只知道试试这样写对不对(运气选手通常走不远~)

日后会更加仔细阅读官方文档以及react的学习

Meteor 的开发是很惊艳的，不用再做`server data JSON client data`的转换。感受一下在react的组件创建之前通过 `createContainer()` 订阅 `/api/xxx.js` 里 `publish`的数据，那么数据库的改变将实时反映在前端UI上，很爽，对不对 ？！

5.bug

demo里目前确认的bug有：

- 收到消息后不会自动滚动滚动条(体验极差)

- isUnread不能区分自己发送的消息(对自己而言自己发送的消息也是未读?)

- 添加好友等功能缺失...

虽然还有那么多需要改进的地方。

不过！让我先完成公司的切图任务再说吧，让我先切几张图压压惊~  



