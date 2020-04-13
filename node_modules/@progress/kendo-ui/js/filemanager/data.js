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

	__webpack_require__(1004);
	module.exports = __webpack_require__(1004);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 5:
/***/ (function(module, exports) {

	module.exports = require("../kendo.data");

/***/ }),

/***/ 1004:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function($, undefined) {
	    var kendo = window.kendo,
	        extend = $.extend,
	        data = kendo.data,
	        Node = data.Node,
	        HierarchicalDataSource = data.HierarchicalDataSource,
	        DataSource = data.DataSource;

	    extend(true, kendo.data, {
	        schemas: {
	            "filemanager": {
	                data: function(data) {
	                    return data.items || data || [];
	                },
	                model: {
	                    id: "path",
	                    hasChildren: "hasDirectories",
	                    fields: {
	                        name: {editable: true, type: "String", defaultValue: "New Folder" },
	                        size: {editable: false, type: "Number"},
	                        path: {editable: false, type: "String"},
	                        extension: {editable: false, type: "String"},
	                        isDirectory: {editable: false, defaultValue: true, type: "Boolean"},
	                        hasDirectories: {editable: false, defaultValue: false, type: "Boolean"},
	                        created: { type: "Date", editable: false},
	                        createdUtc: { type: "Date", editable: false },
	                        modified: { type: "Date", editable: false},
	                        modifiedUtc: { type: "Date", editable: false }
	                    }
	                }
	            }
	        }
	    });

	    var FileEntry = Node.define({
	        init: function(value){
	            var that = this,
	                isDirectory = this.isDirectory;

	            Node.fn.init.call(this, value);

	            if(typeof isDirectory === "string"){
	            isDirectory = kendo.getter(isDirectory);
	            }

	            if (kendo.isFunction(isDirectory)) {
	                var isDirectoryObject = isDirectory.call(that, that);

	                if(isDirectoryObject && isDirectoryObject.length === 0){
	                    that.isDirectory = false;
	                } else{
	                    that.isDirectory = !!isDirectoryObject;
	                }
	            }

	            if (that.isDirectory) {
	                that._initChildren();
	            }
	        },
	        _initChildren: function() {
	            var that = this;
	            var children, transport, parameterMap;

	            if (!(that.children instanceof kendo.data.FileManagerDataSource)) {
	                children = that.children = new kendo.data.FileManagerDataSource(that._childrenOptions);

	                transport = children.transport;
	                parameterMap = transport.parameterMap;

	                transport.parameterMap = function(data, type) {
	                    if(type === "read" || type === "create") {
	                        data.target = that.id;
	                    }

	                    if (parameterMap) {
	                        data = parameterMap(data, type);
	                    }

	                    return data;
	                };

	                children.parent = function(){
	                    return that;
	                };

	                children.bind("change", function(e){
	                    e.node = e.node || that;
	                    that.trigger("change", e);
	                });

	                children.bind("error", function(e){
	                    var collection = that.parent();

	                    if (collection) {
	                        e.node = e.node || that;
	                        collection.trigger("error", e);
	                    }
	                });

	                that._updateChildrenField();
	            }
	        },
	        isNew: function() {
	            if(this.fileManagerNewItem) {
	                delete this.fileManagerNewItem;
	                return true;
	            }

	            return this.id === this._defaultId;
	        }
	    });


	    var FileManagerDataSource = HierarchicalDataSource.extend({
	        init: function(options) {
	            var fileEntry = FileEntry.define({
	                children: options
	            });

	            if(options.filter && !options.serverFiltering){
	                this._hierarchicalFilter = options.filter;
	                options.filter = null;
	            }

	            DataSource.fn.init.call(this, $.extend(true, {}, { schema: { modelBase: fileEntry, model: fileEntry } }, options));

	            this.isLocalBinding = this.transport instanceof kendo.data.LocalTransport;

	            this._attachBubbleHandlers();
	        },
	        insert: function(index, model) {
	            var parentNode = this.parent();

	            if (parentNode && parentNode._initChildren) {
	                if(model && model.isDirectory) {
	                    parentNode.hasDirectories = true;
	                }
	                parentNode.hasChildren = true;
	                parentNode._initChildren();
	            }

	            return DataSource.fn.insert.call(this, index, model);
	        },
	        remove: function(node){
	            var parentNode = node.parentNode(),
	                dataSource = this,
	                result;

	            if (parentNode && parentNode._initChildren) {
	                dataSource = parentNode.children;
	            }

	            result = DataSource.fn.remove.call(dataSource, node);

	            if (parentNode && (dataSource.data() && !dataSource.data().length)) {
	                parentNode.hasChildren = false;
	            } else if(parentNode && !this._hasDirectories(parentNode)) {
	                parentNode.hasDirectories = false;
	            }

	            return result;
	        },
	        _hasDirectories: function(node){
	            var result;

	            if(!node.children.data()) {
	                return false;
	            }

	            result = node.children.data().filter(function(item){
	                return item.isDirectory;
	            });

	            return !!result.length;
	        }
	    });

	    FileManagerDataSource.create = function(options) {
	        options = options && options.push ? { data: options } : options;

	        var dataSource = options || {},
	            data = dataSource.data;

	        if (data && data._dataSource) {
	            return data._dataSource;
	        }

	        dataSource.data = data;

	        return dataSource instanceof FileManagerDataSource ? dataSource : new FileManagerDataSource(dataSource);
	    };

	    extend(kendo.data, {
	        FileManagerDataSource: FileManagerDataSource,
	        FileEntry: FileEntry
	    });

	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(3));

/***/ })

/******/ });