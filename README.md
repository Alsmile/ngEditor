# angular ngEditor

Angular ngEditor is a module for the AngularJS framework. 


#Required dependancies

* AngularJS
* Font Awesome

# Installation
Install each dependancy to your AngularJS project.

Add 'ngEditor' to your main angular.module like so

 * angular.module('app', ['ngEditor'])


#Usage
```html
<ng-editor ng-model="doc.content" editor="editor"></ng-editor>
```

More to see the "demo".

#Opitons
##NgEditor

top : default 0. 工具栏变为fixed的高度。

uploadUrl: 上传图片请求的url。

uploadHeaders： 上传图片请求头。比如用于身份认证。

fonts： 可选的字体。

fontSizes： 可选的字体大小。只支持以下值：  '10px','12px','16px','18px','24px','32px’,'48px'。

fontColors： 可用的字体颜色值。

backColors： 可用的背景颜色值。

toolbar： 自定义工具栏按钮。只支持以下值：title，bold，italic，underline...。（具体查看源码中：toolbarButtons的可用值）

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

* onCatalogChanged：On catalogs changed. 编辑器内容改变重新计算文章目录后触发。

* 其他，待扩展。