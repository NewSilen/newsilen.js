
(function(window){
	// 全局命名空间
	var global={};
	// 模块定义
	function define(id,dependencies,callback){
		global[id] = callback();
	}

	function require(){
		
	}
})(window);