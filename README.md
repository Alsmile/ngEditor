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

top : default 0. ��������Ϊfixed�ĸ߶ȡ�

uploadUrl: �ϴ�ͼƬ�����url��

uploadHeaders�� �ϴ�ͼƬ����ͷ���������������֤��

fonts�� ��ѡ�����塣

fontSizes�� ��ѡ�������С��ֻ֧������ֵ��  '10px','12px','16px','18px','24px','32px��,'48px'��

fontColors�� ���õ�������ɫֵ��

backColors�� ���õı�����ɫֵ��

toolbar�� �Զ��幤������ť��ֻ֧������ֵ��title��bold��italic��underline...��������鿴Դ���У�toolbarButtons�Ŀ���ֵ��

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
* onContentChanged: On content changed. �༭�����ݸı�󴥷���

* onCatalogChanged��On catalogs changed. �༭�����ݸı����¼�������Ŀ¼�󴥷���

* ����������չ��