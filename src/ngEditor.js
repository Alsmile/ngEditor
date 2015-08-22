(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular);
  }
}(this, function (angular) {
'use strict';
  var module = angular.module('ngEditor', ['angularFileUpload']);

  module.factory('NgEditor', [ '$rootScope', '$compile',
    function($rootScope, $compile) {
      function NgEditor(options) {
        this.options = angular.copy(options);
      }

      NgEditor.prototype._onContentChanged = function(content) {};
      NgEditor.prototype.onContentChanged = function(content) {};

      return NgEditor;
    }
  ]);


  module.directive('contenteditable', ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController,
      scope: {
        editor: '=',
        ngShow: '='
      },
      link: function ($scope, element, attrs, ctrl) {
        if (!ctrl || !$scope.editor) return;

        var timer;

        // view -> model
        var isInputting;
        var getContent = function () {
          var html = element.html();
          if (!html) return;

          isInputting = false;
          ctrl.$setViewValue(html);

          // 获取目录
          var catalogs = [];
          var title, abstract;
          angular.forEach(element.children(), function (val) {
            if (val.nodeName === 'H1') {
              title = angular.element(val).text();
              catalogs.push({
                name: title,
                type: 1,
                elem: val
              });
            }

            if (angular.element(val).hasClass("article-abstract")) {
              abstract = angular.element(val).text();
              catalogs.push({
                name: abstract,
                type: 2,
                elem: val
              });
            }

            switch (val.nodeName) {
              case 'H2':
              case 'H3':
              case 'H4':
              case 'H5':
              case 'H6':
              case 'H7':
                catalogs.push({
                  name: angular.element(val).text(),
                  type: 3,
                  elem: val
                });

                break;
            }
          });

          $scope.editor._onContentChanged(html, catalogs, title, abstract);
        };

        $scope.$watch('ngShow', function (newVal) {
          if (isInputting || !newVal) return;
          getContent();
        });

        element.bind('input', function () {
          if (isInputting) return;

          if (timer) $timeout.cancel(timer);
          timer = $timeout(function () {
            getContent();
          }, 1000);
        });

        element.bind('blur', function () {
          // Ended for inputting and get content right now while it was inputting.
          // Do nothing when it was not inputting. Because has get.
          if (!isInputting) return;

          if (timer) $timeout.cancel(timer);
          getContent();
        });

        // model -> view
        ctrl.$render = function () {
          element.html(ctrl.$viewValue);
        };

        ctrl.$render();

        $scope.$on('$destroy', function () {
          if (timer) $timeout.cancel(timer);
        });
      }
    };
  }]);

  module.directive('ngEditor', ['$rootScope', '$window', '$document', '$http', 'NgEditor', 'FileUploader', function($rootScope, $window, $document, $http, NgEditor, FileUploader) {
    return {
      restrict: 'E',
      template: '<div class="ng-editor">' +
      						'<div class="toolbar" ng-style="getToolbarStyle()">' +
    								'<div class="item rel" ng-repeat="item in toolbarButtons" ng-class="{fr: item.right}">' +
											'<button class="button" ng-if="item.class && !item.dropdown.length" ng-click="command(item.command, false, item.val)" ' +
    										'ng-class="{bk: item.right && !editable}" title="{{::item.tooltip}}">' +
    										'<i class="{{::item.class}}"></i>' +
											'</button>' +
    									'<div class="button" ng-if="item.class && item.dropdown.length" title="{{::item.tooltip}}"' +
    										'ng-mousemove="item.isDown = true" ng-mouseleave="item.isDown = false" ng-class="{down: item.isDown}">' +
    										'<i class="{{::item.class}}"></i>' +
    										'<div class="abs" ng-if="item.dropdown.length && item.isDown" ng-class="{inline:item.inline}">' +
    											'<div ng-repeat="subItem in item.dropdown" class="sub-menu rel" ng-class="{inline:subItem.color}" >' +
    												'<button ng-if="!subItem.separator" ng-click="command(subItem.command, false, subItem.val)" >' +
    													'<label ng-if="subItem.caption">{{::subItem.caption}}</label>' +
    													'<label ng-if="subItem.color" class="fa fa-square" style="color:{{subItem.val}}"></label>' +
    												'</button>' +
    												'<label ng-if="subItem.separator" class="separator-h"></label>' +
    												'<input ng-if="subItem.isUpload" type="file" nv-file-select="" uploader="uploader"  />' +
			                 		'</div>' +
												'</div>' +
											'</div> ' +
										'<div ng-if="!item.class" class="separator"></div> </div> </div>' +
    							'<div ng-show="editable" class="article" contenteditable="true" ng-model="ngModel" editor="editor"></div>' +
    							'<div ng-hide="editable" class="padding-10">' +
    								'<textarea ng-model="ngModel"></textarea>' +
    							'</div>' +
    							'<div ng-if="uploadProgress < 100" class="tip">' +
    								'<div class="abs">' +
      								'<i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>' +
								'  正在上传图片，进度： <label class="progress">{{uploadProgress}}%</label>  </div>  </div>  </div>',
      scope: {
        ngModel:'=',
        editor:'='
      },
      replace: true,
      require: 'ngModel',
      transclude: true,
      link: function($scope, element, attributes){
        if (!($scope.editor instanceof NgEditor)) {
          throw new TypeError('"editor" must be an instance of NgEditor');
        }

        // Default fonts.
        var fonts = {
          '宋体': 'SimSun',
          '微软雅黑':'Microsoft YaHei',
          '楷体': 'SimKai',
          '黑体':'SimHei',
          '隶书':'SimLi',
          'andale mono': 'andale mono',
          'arial': 'arial',
          'arial black':'arial black,avant garde',
          'comic sans ms': 'comic sans ms',
          'helvetica': 'helvetica',
          'impact':'impact,chicago' ,
          'sans-serif': 'sans-serif',
          'times new roman':'times new roman'
        };
        $scope.fonts = [];
        // Set custom fonts.
        if ($scope.editor.options.fonts) {
          angular.forEach($scope.editor.options.fonts, function (val) {
            $scope.fonts.push({
              caption:  val,
              command: 'fontName',
              val: fonts[val] || val
            });
          });
        }
        // Set default fonts.
        else {
          angular.forEach(fonts, function (val, key) {
            $scope.fonts.push({
              caption: key,
              command: 'fontName',
              val: val
            });
          });
        }

        // Default font-sizes.
        var fontSizes = {
          '10px':1,
          '12px':2,
          '16px':3,
          '18px':4,
          '24px':5,
          '32px':6,
          '48px':7
        };
        $scope.fontSizes = [];
        // Set custom font-sizes.
        if ($scope.editor.options.fontSizes) {
          angular.forEach($scope.editor.options.fontSizes, function (val) {
            $scope.fontSizes.push({
              caption: val,
              command: 'fontSize',
              val: fonts[val] || val
            });
          });
        }
        // Set default font-sizes.
        else {
          angular.forEach(fontSizes, function (val, key) {
            $scope.fontSizes.push({
              caption: key,
              command: 'fontSize',
              val: val
            });
          });
        }

        // Default colors.
        var fontColors = ['#c00','#f00','#ffc000','#ff0','#92d050','#00b050','#00b0f0','#0070c0','#002060','#7030a0'];
        // Define font-colors.
        $scope.fontColors = [];
        // Set custom font-colors.
        if ($scope.editor.options.fontColors) {
          angular.forEach($scope.editor.options.fontColors, function (val) {
            $scope.fontColors.push({
              color: true,
              command: 'foreColor',
              val: val
            });
          });
        }
        // Set default font-colors.
        else {
          angular.forEach(fontColors, function (val) {
            $scope.fontColors.push({
              color: true,
              command: 'foreColor',
              val: val
            });
          });
        }

        // Set custom back-colors.
        $scope.backColors = [];
        if ($scope.editor.options.backColors) {
          angular.forEach($scope.editor.options.backColors, function (val) {
            $scope.backColors.push({
              color: true,
              command: 'backColor',
              val: val
            });
          });
        }
        // Set default back-colors.
        else {
          angular.forEach(fontColors, function (val) {
            $scope.backColors.push({
              color: true,
              command: 'backColor',
              val: val
            });
          });
        }

        // Define toolbar buttons.
        var toolbarButtons = {
          'template': {
            class: 'fa fa-newspaper-o',
            tooltip:'模板',
            templates: []
          },
          'separator' :{},
          'title': {
            class: 'fa fa-header',
            tooltip:'标题和文本',
            dropdown: [{
              caption: '标题 1',
              command: 'formatBlock',
              val: 'h1'
            }, {
              caption: '标题 2',
              command: 'formatBlock',
              val: 'h2'
            }, {
              caption: '标题 3',
              command: 'formatBlock',
              val: 'h3'
            }, {
              caption: '标题 4',
              command: 'formatBlock',
              val: 'h4'
            }, {
              caption: '标题 5',
              command: 'formatBlock',
              val: 'h5'
            }, {
              separator:true
            }, {
              caption: '普通文本',
              command: 'formatBlock',
              val: 'div'
            }]
          },
          'bold': {
            class: 'fa fa-bold',
            tooltip:'加粗',
            command: 'bold'
          },
          'italic': {
            class: 'fa fa-italic',
            tooltip:'斜体',
            command: 'italic'
          },
          'underline': {
            class: 'fa fa-underline',
            tooltip:'下划线',
            command: 'underline'
          },
          'strikethrough': {
            class: 'fa fa-strikethrough',
            tooltip:'删除线',
            command: 'strikethrough'
          },
          'separator1' :{},
          'list-ol': {
            class: 'fa fa-list-ol',
            tooltip:'有序列表',
            command: 'insertOrderedList'
          },
          'list-ul': {
            class: 'fa fa-list-ul',
            tooltip:'无序列表',
            command: 'insertUnorderedList'
          },
          'align-left': {
            class: 'fa fa-align-left',
            tooltip:'左对齐',
            command: 'justifyLeft'
          },
          'align-center': {
            class: 'fa fa-align-center',
            tooltip:'居中对齐',
            command: 'justifyCenter'
          },
          'align-right': {
            class: 'fa fa-align-right',
            tooltip:'右对齐',
            command: 'justifyRight'
          },
          'separator2' :{},
          'font': {
            class: 'fa fa-font',
            tooltip:'字体',
            dropdown: $scope.fonts
          },
          'font-size': {
            class: 'fa fa-text-width',
            tooltip:'字体大小',
            dropdown: $scope.fontSizes
          },
          'font-color': {
            class: 'fa fa-eyedropper color-warning',
            tooltip:'字体颜色',
            dropdown: $scope.fontColors,
            inline: true
          },
          'back-color': {
            class: 'fa fa-square color-main',
            tooltip:'背景颜色',
            dropdown: $scope.backColors,
            inline: true
          },
          'eraser-format': {
            class: 'fa fa-eraser',
            tooltip:'清除格式',
            command: 'removeFormat'
          },
          'separator3' :{},
          'link': {
            class: 'fa fa-link',
            tooltip:'插入链接',
            command: 'createLink'
          },
          'image' : {
            class: 'fa fa-photo',
            tooltip:'插入图片',
            dropdown: [
              {
                caption:  '图片链接',
                command: 'insertImage'
              },
              {
                caption:  '本地图片',
                command: 'localImage',
                isUpload: true
              }
            ],
            inline: true
          },
          'quote': {
            class: 'fa fa-quote-right',
            tooltip:'引用',
            command: 'formatBlock',
            val: 'blockquote'
          },
          'separator4' :{},
          'html': {
            right: true,
            class: 'fa fa-html5',
            tooltip:'查看html源码',
            command: 'html'
          }
        };

        var hasTemplate;
        // Set custom toolbar buttons.
        $scope.toolbarButtons = [];
        if ($scope.editor.options.toolbar) {
          angular.forEach($scope.editor.options.toolbar, function (val) {
            if (val !== 'template') $scope.toolbarButtons.push(toolbarButtons[val]);
            else if (!hasTemplate && $scope.editor.options.templateUrl) hasTemplate = true;
          });
        }
        // Set default toolbar buttons.
        else {
          angular.forEach(toolbarButtons, function (val, key) {
            $scope.toolbarButtons.push(val);
          });

          if ($scope.editor.options.templateUrl) hasTemplate = true;
          // Remove template button and separator from toolbar.
          else {
            $scope.toolbarButtons.splice(0,2);
          }
        }

        // Download templates.
        if (hasTemplate) {
          $http.get($scope.editor.options.templateUrl).success(function (data) {
            if (data) {
              toolbarButtons.template.templates = toolbarButtons.template.templates.concat(data);
              console.info($scope.toolbarButtons)
            }
          });
        }

        // Get editor element and toolbar element.
        var editorElem, toolbarElem;
        angular.forEach(element.children(), function (val) {
          if (angular.element(val).attr("contenteditable")) {
            editorElem = val;
          }
          else {
            toolbarElem = val;
          }
        });

        if (!editorElem) {
          throw new TypeError('There is not a contenteditable.');
        }

        // Set toolbar fixed or not.
        var offset;
        var toolbarStyle;
        var fixedScroll = function (ev) {
          if (!offset) offset =  toolbarElem.getBoundingClientRect().top;
          if (this.pageYOffset > offset + $scope.editor.options.top) {
            toolbarStyle = {
              'position' : 'fixed',
              'top' : $scope.editor.options.top + 'px',
              'width': toolbarElem.clientWidth - 10 + 'px'
            };
          }
          else {
            toolbarStyle = {
              'position' : 'relative',
              'top' : 0
            };
          }
          $scope.$apply();
        };
        angular.element($window).bind('scroll', fixedScroll);

        $scope.getToolbarStyle = function () {
          return toolbarStyle;
        };

        document.execCommand('enableobjectresizing', true);
        document.execCommand('styleWithCSS', true);

        $scope.editable = true;
        $scope.command = function (cmd, b, val, event) {
          if (event) event.stopPropagation();
          switch (cmd) {
            case 'createLink':
              val = prompt('请输入链接URL');
              if (!val) return;
              break;
            case 'insertImage':
              val = prompt('请输入图片URL');
              if (!val) return;
              break;
            case 'localImage':

              return;
              break;
            case 'html':
              $scope.editable =  !$scope.editable;
              return;
              break;
          }

          document.execCommand(cmd, b, val);
        };

        // Upload image by FileUploader.
        $scope.uploader = new FileUploader({
          url: $scope.editor.options.uploadUrl,
          headers : $scope.editor.options.uploadHeaders ,
          autoUpload: true
        });

        $scope.uploadProgress = 100;
        $scope.uploader.onBeforeUploadItem = function(item) {
          $scope.uploadProgress = 0;
        };

        $scope.uploader.onProgressItem = function(fileItem, progress) {
          $scope.uploadProgress = progress;
        };

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
          document.execCommand('insertImage', false, response.url);
        };

        // Events of editor.
        $scope.editor._onContentChanged = function (html, catalogs, title, abstract) {
          $scope.ngModel.catalogs = catalogs;
          $scope.ngModel.title = title;
          $scope.ngModel.abstract = abstract;

          // do sth...

          $scope.editor.onContentChanged(html);
        };

        $scope.setArticle = function (article) {
          $scope.ngModel = article;
        };

        // Clear.
        $scope.$on('$destroy', function(){
          angular.element($window).unbind('scroll', fixedScroll);
        });
      }
    };
  }]);

  return module;
}));