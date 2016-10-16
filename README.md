# kuanglong
# 狂龙 - an markdown editor 

![狂龙图标](images/KuangLong.png)
# Welcome-狂龙

### 自动文档索引
一个自动建立索引的东东就叫`[toc]`，注意使用前行前面要有个空行，否则解释器解释不了这个东西

[TOC]

@(文章大分类)[文章tag1|文章tag2|文章tag...]

@(文章大分类)[仅仅第一个是有效的,所以这条是无效的，其余的会被当做文章的内容，多个tags用|分割]

## Markdown简介
> Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成格式丰富的HTML页面。    -》-》 [维基百科](https://zh.wikipedia.org/wiki/Markdown) 

## 文本编辑器的特技


### 支持原生html代码转义

当然除了`link`,`script`,`iframe`这几个危险的标签之外，你完全可以使用更有力量的编辑`HTML`代码，比如说酱：<strong>原生HTML</strong>，所以有些比如视频啊音频啊, 是可以展示出来:

<embed src="http://player.youku.com/player.php/sid/XMzA0MzIwMDgw/v.swf" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>

### React.js的VTree对比

由于从编辑到展现都是实时的，也就是说，从左到右，整个页面重新渲染的代价会非常大，比如失败的图片会重新请求，embed标签，表格，公式，都会重新被渲染，看着都替浏览器累，所以看了看react的VTree的概念，就直接把对比部分的代码给拿过来了，目前效果显著，除了段落内的内容会重新再右侧重新渲染外，其余的段落都不会多次渲染，以降低上面带来的问题；

### ElasticSearch-支持全局索引技术

对于文章内容搜索实在是没好招了，MySQL和NoSQL都不是最好的索引方案,于是开始寻找简单一些的替代方案，开始映入眼帘的是Lucene，表示玩了两周各种坑，没人没财力的，为了出项目，果断的看到更简单的ElasticSearch模型，容易搭建与使用；

### 基于Double-Array Trie的敏感词过滤

基于lib库trie_filter的敏感词过滤系统,php有个php-ext-trie-filter扩展，原始的库地址在这里-&gt;[原始库](https://github.com/wulijun/php-ext-trie-filter "原始库")，不过目前不支持php7,在issue中发现了其他人的一个分支，分支地址如下：[php-ext-trie-filter](https://github.com/zzjin/php-ext-trie-filter/tree/php7 "支持php7的扩展地址")

###图片粘贴
我觉得吧，网页对于图片还一直是个挺难搞的个事儿，我们可以用QQ截图(这个有个组合键，打开QQ后`Control+Alt+A`)，到这里直接粘贴，这个已经想办法弄到服务器了，使用的是[paste.js](http://gh-pages.micy.in/paste.js/ "paste.js")这个插件，截图最大支持200M，功能还是挺好用的，毕竟君子善假于物也嘛；

## 基本技能
### 文字
文字其实挺少的，会有**加粗**，*斜体*，***粗斜体***，<u>下划线</u>，~~中间线~~，还有超链接[连接测试](http://test "连接测试")，连接其实还有另一种形式就是`[连接文字][连接序号]`,在后面随便一个地方写`[连接序号]: http:xxxxx`，也可以作为超链接使用,甚至是一个脚注[^demo]；

啥？你还想要字体啥啥啥和颜色啥啥啥？出门直接原生的HTML右拐不送，html是最简单高效的渲染类文档模型；


### 图片
这个就直接使用人家原生格式`![]()`，目测真心凑合，图片这个地方有时候会拿不到正确的引用地址，目前的策略是`png`,`jpg`,`jpeg`,`bmp`,`apng`这些后缀结束的链接变成默认图，否则变成一个下载文件，我们来举栗子，我就直接动用了剪切功能了昂（这个是从百度复制来的）：
![来自剪切板图片](../Data/ClipboardImg/2016-10-14/1476445172000_128x128.png)
![来自剪切板图片](../Data/ClipboardImg/2016-10-14/1476445172000_128x12.png)
![来自剪切板图片](../Data/ClipboardImg/2016-10-14/1476445172000_128x12.bat)

其中第一个图是原始图，后来我把原始图的名字去掉了个0，触发了imgError就是个颜文字的图了,最后面的扩展名都变了，不再是那些标准的图片格式，所以就是文档图标这个东西了来示人了；

### 引用
使用`>`开头的行，多行引用就是每一行前面都加一个`>`就好，当然除了一般的markdown语法的引用外，我还使用了`->->`或（`-》-》`）这种方式来添加footer标签使其右对齐，样式来自于`bootsrtap`，下面举例如下：

#### 右对齐的footer
> hello world, 欢迎来到狂龙后台，对齐这个事儿吧，你怎么顺眼怎么来，昂右对齐用`-》-》`或者`->->`，当然只有最后的一个才生效;
> ->->右对齐的footer

####相应的就有左对齐的footer
> hello world, 欢迎来到狂龙后台!
> -《-《左对齐的footer



### 定义
定义头，也就是html里的`<dt></dt>`
: 定义解释，也就是html里的`<dd></dd>`，召唤出这个需要冒号+空格+文本，冒号支持中文和英文下的两种；
： 多解释，反正你就再来一行冒号开头的就行，没啥大不了；
： 一定不要忘记了冒号`：`后面的空格呀亲！

### 定义代码块
行内代码请使用<code>\`</code>（由于这个点号不好表示只能酱紫用原生的HTML包裹了，其实这个点儿还是挺不常用的）这个英文下的符号进行包裹，就像酱`行内代码`；其实重点妥妥的是行外整块的代码块，下面介绍几种整块代码的风格：


#### 缩进风格
这个就是直接使用缩进或者四个空格(首行需要空出一行，解析器太傲娇了没驯服导致的)，注意保持所有的代码前面都有类似的缩进，就能渲染出一个代码块出来；

	<?php
		echo 'hello wordl';


#### 可配置的风格
使用<code>```</code>包裹一段代码，就像下面那样，OK你看代码出来了：
```
<?php
	echo 'hello wordl';
```
为什么叫**可配置风格**呢，是酱这个后台其实是所有的语言都弄成一种代码高亮，不同语言由于关键字不同，代码高亮八成不一样呀，所以为了区分不同的语言，我们可以在第一个<code>```</code>后面加上语言信息，就像酱：

```php-long
<?php
	echo 'hello wordl';
```
前面的语言用小写，后面是使用长代码格式还是短代码格式来渲染到目标页，总共有两个关键词`long`和`sort`并且是可选的，如果有long或sort属性，请和语言属性用`-`或`，`来分开，但是我们在右边没有看到渲染发生任何变化，突然会不会觉的一脸懵x呢，咳这个就是个预览页，不是真正呈现时候的页面，所以don't worry，预览页你会看到真正不同的东西哒昂！

长代码风格
： ![来自剪切板图片](../Data/ClipboardImg/2016-10-14/1476440769000_842x360.png)，这是为了显示很多代码而准备的长代码格式，有行号并且代码长度过长不折行，右边超出的部分会有滚动条支持展示全部；




短代码风格
： ![来自剪切板图片](../Data/ClipboardImg/2016-10-14/1476440724000_834x518.png)，这是为了显示一小段代码而准备的，没有行号，代码超长会折行；


### 表格
我觉得表格其实MD的并不好，但既然人家支持，我也就支持下吧，不知道咋弄的看菜单栏昂菜单栏里有，关于对齐方式还得熟悉下MD的表格模型；

| Item      |    Value | Qty  |
| :-------- | --------:| :--: |
| Computer  | 1600 USD |  5   |
| Phone     |   12 USD | 112 |
| Pipe      |    1 USD | 234  |

### 流程图
就是块级代码的表示形式，但是语言的关键字是flow，具体的flow流程图语法请看[flow](http://adrai.github.io/flowchart.js/ "flow")，我就用的这个插件；

```flow
st=>start: User login
op=>operation: Operation
cond=>condition: is Yes or No?
e=>end: Into admin

st->op->cond
cond(yes)->e
cond(no)->op
```




以及时序图:

```sequence
Title: Here is a title 
A->B: Normal line 
B-->C: Dashed line 
C->>D: Open arrow 
D-->>A: Dashed open arrow
```


> **提示：**想了解更多，请查看**流程图**[语法][2]以及**时序图**[语法][3]。

### LaTeX 公式
可以创建行内公式，例如 $$\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$$。或者块级公式：

$$ x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

------------------

## 高级功能。

### 复选框

使用 `- [ ]` 和 `- [x]` 语法可以创建复选框，实现 todo-list 等功能。例如：

- [x] 已完成事项
- [ ] 待办事项1
- [ ] 待办事项2

> **注意：**目前支持尚不完全，不会记录状态.....这是个坑....

## 关于编辑器

**狂龙编辑器**是利用业余的时间开发出来的一个MD在线编辑器，基于浏览器会广泛推广，**开源**为一个开放平台，不管是用于盈利项目还是非盈利项目都请放心使用。现在吹牛逼的太多，有些简单的东西各种保密般的玄学化。大道至简，希望你们利用手里的这个编辑器能创造出容易让人理解的东西;

## 反馈与建议

- 有什么问题请直接邮箱：<shirongqi@126.com>

----------------------------

感谢阅读这份帮助文档。

[^demo]: 这是一个示例脚注。使用方法请查阅 [MultiMarkdown 文档](https://github.com/fletcher/MultiMarkdown/wiki/MultiMarkdowafsdfn-Syntax-Guide#footnotes) 关于脚注的说明。

[1]: http://test.html
[2]: http://adrai.github.io/flowchart.js/
[3]: http://bramp.github.io/js-sequence-diagrams/

