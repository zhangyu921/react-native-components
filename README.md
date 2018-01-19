# React Native components
RN组件收集，提供思路。

## listViewChat

类似微信聊天界面，列表功能的实现。
当item不足一屏高度，显示正常列表。当超出一屏时，通过transform scale属性，翻转列表和item。
优点是，在大量的地方不需要进行手动 scrollToEnd, 最优先加载的就是最新的消息。当键盘弹出和隐藏时也是适时调整的。

