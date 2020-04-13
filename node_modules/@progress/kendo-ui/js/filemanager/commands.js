module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1001);
	module.exports = __webpack_require__(1001);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 20:
/***/ (function(module, exports) {

	module.exports = require("../kendo.core");

/***/ }),

/***/ 1001:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (f, define) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(20)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function () {

	    (function ($, undefined) {
	        var kendo = window.kendo,
	            extend = $.extend,
	            Class = kendo.Class;

	        var Command = Class.extend({
	            init: function (options) {
	                this.options = options;
	                this.filemanager = options.filemanager;
	            }
	        });

	        var CreateFolderCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    filemanager = that.filemanager,
	                    dataSource = filemanager._viewDataSource || filemanager.dataSource;

	                    dataSource.add();
	            }
	        });

	        var RenameCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    target = that.options.target,
	                    viewItem = that.filemanager._view.widgetComponent.dataItem(target);

	                if(target && viewItem){
	                    that.filemanager._view.edit(target);
	                } else {
	                    that._renameTreeViewItem(target);
	                }
	            },
	            _renameTreeViewItem: function(target){
	                var that = this,
	                    uid = target.data("uid"),
	                    item = that.filemanager.treeView.widgetComponent.dataSource.getByUid(uid),
	                    realItem = that.filemanager.dataSource.get(item.id);

	                that.filemanager._prompt({
	                    type: "rename",
	                    defaultInput: realItem.name,
	                    target: target
	                }).done(function(newName){
	                    realItem.set("name", newName);
	                });
	            }
	        });

	        var DeleteCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    target = that.options.target,
	                    filemanager = that.filemanager,
	                    items = filemanager.getSelected(),
	                    viewItem = that.filemanager._view.widgetComponent.dataItem(target),
	                    itemsToRemove;

	                if(target && target.is(".k-state-selected") && items && items.length) {
	                    itemsToRemove = items;
	                } else if(target && viewItem) {
	                    itemsToRemove = viewItem;
	                } else if(target) {
	                    var uid = target.data("uid");
	                    var item = that.filemanager.treeView.widgetComponent.dataSource.getByUid(uid);
	                    var realItem = that.filemanager.dataSource.get(item.id);

	                    itemsToRemove = realItem;
	                }

	                filemanager._confirm({
	                    type: "delete",
	                    target: target
	                })
	                .done(function () {
	                    that.removeItems(itemsToRemove);
	                });
	            },
	            removeItems: function(items) {
	                var itemsToRemove = Array.isArray(items) ? items : [items];

	                for (var i = 0; i < itemsToRemove.length; i++) {
	                    this.filemanager.dataSource.remove(itemsToRemove[i]);
	                }
	            }
	        });

	        var CopyCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                filemanager = that.filemanager,
	                dataSource = filemanager.dataSource,
	                items = that.options.items,
	                target = dataSource.get(that.options.target),
	                targetDataSource = target.children;

	                for (var i = 0; i < items.length; i++) {
	                    var item = dataSource.get(items[i]).toJSON();
	                    item.fileManagerNewItem = true;
	                    targetDataSource.add(item);
	                }
	            }
	        });

	        var MoveCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    filemanager = that.filemanager,
	                    dataSource = filemanager.dataSource,
	                    items = that.options.items,
	                    target = dataSource.get(that.options.target),
	                    targetDataSource = target.children;

	                for (var i = 0; i < items.length; i++) {
	                    var item = dataSource.get(items[i]);
	                    var cloning = item.toJSON();
	                    cloning.fileManagerNewItem = true;
	                    targetDataSource.add(cloning);
	                    dataSource.remove(item);
	                }
	            }
	        });

	        var SortCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    options = that.options,
	                    filemanager = that.filemanager,
	                    sortOptions = filemanager.defaultSortOption;

	                extend(sortOptions, {
	                    dir: options.dir,
	                    field: options.field
	                });

	                filemanager._view.widgetComponent.dataSource.sort([ filemanager.folderSortOption, sortOptions ]);
	            }
	        });

	        var SearchCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    options = that.options,
	                    filemanager = that.filemanager,
	                    filter = {
	                        field: options.field,
	                        operator: options.operator,
	                        value: options.value
	                    };

	                filemanager._view.widgetComponent.dataSource.filter(filter);
	            }
	        });

	        var ChangeViewCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    options = that.options,
	                    filemanager = that.filemanager;

	                filemanager.view(options.value);
	                filemanager.resize(true);
	            }
	        });

	        var OpenDialogCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function () {
	                var that = this,
	                    filemanager = that.filemanager,
	                    dialog = filemanager[that.options.type];

	                if (dialog) {
	                    dialog.open();
	                } else {
	                    window.console.warn(kendo.format("The {0} dialog is not available!", that.options.type));
	                }
	            }
	        });

	        var TogglePaneCommand = Command.extend({
	            init: function (options) {
	                Command.fn.init.call(this, options);
	            },
	            exec: function() {
	                var that = this,
	                    filemanager = that.filemanager,
	                    pane = filemanager[that.options.type],
	                    resizable = that.getResizable();

	                if (pane) {
	                    pane.toggle();

	                    if (resizable) {
	                        filemanager.wrapper
	                            .find(resizable.options.handle)
	                            .toggle();
	                    }
	                }
	            },
	            getResizable: function() {
	                var that = this,
	                    filemanager = that.filemanager,
	                    type = that.options.type;

	                if (!filemanager._resizeDraggable) {
	                    return;
	                }

	                return filemanager._resizeDraggable[type];
	            }
	        });

	        extend(kendo.ui, {
	            filemanager: {
	                FileManagerCommand: Command,
	                commands: {
	                    CreateFolderCommand: CreateFolderCommand,
	                    RenameCommand: RenameCommand,
	                    DeleteCommand: DeleteCommand,
	                    MoveCommand: MoveCommand,
	                    CopyCommand: CopyCommand,
	                    SortCommand: SortCommand,
	                    SearchCommand: SearchCommand,
	                    ChangeViewCommand: ChangeViewCommand,
	                    OpenDialogCommand: OpenDialogCommand,
	                    TogglePaneCommand: TogglePaneCommand
	                }
	            }
	        });

	    })(window.kendo.jQuery);

	    return window.kendo;

	}, __webpack_require__(3));

/***/ })

/******/ });