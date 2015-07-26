'use strict';


angular.module('app', ['ngEditor'])
	.controller('AppController', ['$rootScope', '$scope', 'NgEditor', function($rootScope, $scope, NgEditor) {
		$scope.doc = {content: ''};
		$scope.editor = new NgEditor({
			top: 0,
			uploadUrl: '/apis/image',
			uploadHeaders: {
				'Authorization': 'Bearer ' + '',
				'uid': ''
			}
		});

		$scope.editor.onContentChanged = function (content) {
			console.info('content',content)
		};

		$scope.editor.onCatalogChanged = function (catalogs) {
			console.info('catalogs',catalogs)
		};


	}]
);