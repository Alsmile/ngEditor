# angular ngEditor

Angular ngEditor is a module for the AngularJS framework. 

Get started at [ngEditor](http://alsmile.github.io/ngEditor)!
[Demo](http://alsmile.github.io/ngEditor/demo/)!

#Required dependancies

* [AngularJS](https://github.com/angular/angular.js)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
* [angular-file-upload](https://github.com/nervgh/angular-file-upload)

# Installation
Install each dependancy to your AngularJS project.

Add 'ngEditor' to your main angular.module like so

 * angular.module('app', ['ngEditor'])

Angular-file-upload is required if you need upload files.

#Usage
```html
<ng-editor ng-model="doc" editor="editor"></ng-editor>
```

More to see the "demo".

#ngModel - Object

The ngModel is a object. It contains:

title: The title of article. 当文章内容发生变化时，自动获取<H1>内容作为title。建议一个文章有且仅有一个<H1>。

content: The content of article. 整个文章内容的HTML代码。

abstract: The abstract about article. 当文章内容发生变化时，自动获取class为article-abstract内容作为title。建议一个文章有且仅有一个article-abstract。

catalogs: The abstract of article. Includes the abstract. 当文章内容发生变化时，自动获取<H1>、class为article-abstract、<H2>、<H3>、<H4>、<H5>、<H6>、<H7>作为catalogs。

 * Tips: 当停止输入1s或失去焦点时触发计算上述内容，然后通知文章内容改变事件。在单击自定义保存按钮前，请确保计算完毕。（后期计划添加一个人工计算事件，并回调，确保内容正确。如果您有更好的解决方案请告诉我。非常感谢您的贡献。）


#Opitons
##NgEditor

top : default 0. 工具栏变为fixed的高度.

uploadUrl: 上传图片请求的url。

templateUrl: 上传或下载模板所请求的url。 GET: 从服务器获取模板。 POST: 保存模板到服务器。

uploadHeaders: 上传图片请求头。比如用于身份认证。

fonts: toolbar字体菜单可用的字体。

fontSizes: toolbar字体大小菜单可用的字体大小。目前仅支持: '10px','12px','16px','18px','24px','32px','48px'.

fontColors: toolbar字体颜色菜单可用的字体颜色。

backColors: toolbar背景颜色菜单可用的背景颜色。

toolbar: 自定义工具栏按钮。只支持以下值：title, bold, italic, underline...。（具体查看源码中：toolbarButtons的可用值）.

##Example
```javascript

$scope.editor = new NgEditor({
    	top: 0,
			uploadUrl: '/apis/image',
			uploadHeaders: {
				'Authorization': 'Bearer ' + '',
				'uid': ''
			},
            toolbar:['title', 'bold',...]
		});
        
```


#Callbacks
* onContentChanged: On content changed. 编辑器内容改变后触发。

* 其他待扩展。