/**
S.ready(function)
页面加载完DOM后调用，使用最新的DOMContentLoaded事件，未对老版本浏览器做支持
每次调用会将参数中的函数加入任务队列，加载完成后依次执行，如果已经加载完成后调用此方法，立即执行
*/

(function(S){
	// 任务列表
	var taskList = [];
	// 新增任务
	S.ready = function(func,async){
		if(!S.isFunc(func))return S;//必须是函数
		taskList.push(func);
		return S;
	};

	//执行任务
	//setTimeout 一定是在dom ready之后才会执行，所以这里不会有其他任务插入
	//将依次执行所有的任务，之间只会插入UI刷新
	// 如果任务中存在设置ready事件的情况（极少，该不会有人这样写代码吧！？）--也没关系，插入到最后，可以执行的
	// 在其他的都执行过之后，动态加载的或者执行其他什么方法里面出现的代码调用了ready方法，改为立即执行
	function work(){
		if(taskList.length===0){
			S.ready = function(func){
				if(!S.isFunc(func))return S;
				func();
			}
			return;
		};

		while(taskList.length>0){
			var t = taskList.shift();//依次取出方法并执行
			t();
		}
		/*setTimeout(function(){
			var t = taskList.shift();//依次取出方法并执行
			t();
			work();
		},0);//防止UI阻塞*/
	}

	// 确定执行时机
	document.addEventListener('DOMContentLoaded',function () {
		work();
	});
})(newsilen);