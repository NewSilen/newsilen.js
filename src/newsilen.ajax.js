/**
Ajax 
@deps : Pool.
*/
(function(S){
	//serialize the pojo.
	S.serialize=function(arg){
		var cache=[];
		if(arg){
			for(var k in arg){
				cache.push(k+'='+arg[k]);
			}
		}
		return cache.join('&');
	};

	function ajax(opts){
		opts=opts||{url:''};
		var url = opts.url;
		var xhr=S.xhr();
		if(!xhr)return false;
		var isTimeout=0,timer=null;
		if(opts.async && opts.timeout){
			timer = setTimeout(function(){
				xhr.abort();isTimeout=1;
				S.ajax.xhrPool.push(xhr);
			},opts.timeout);
		}
		xhr.onreadystatechange=function(){
			/**
		 		状态 		描述 
				0 		请求未初始化（在调用 open() 之前）
				1 		请求已提出（调用 send() 之前）
				2 		请求已发送（这里通常可以从响应得到内容头部）
				3		请求处理中（响应中通常有部分数据可用，但是服务器还没有完成响应） 
				4 		请求已完成（可以访问服务器响应并使用它）
	 		*/
	 		switch(xhr.readyState){
	 			case 1: break;
	 			case 2: break;
	 			case 3: break;
	 			case 4:
	 				if(xhr.status==200 || xhr.status==304){
		 				if(!isTimeout){
		 					clearTimeout(timer);
							opts.success && opts.success(xhr.responseText,xhr.status,xhr);
		 				}else if(isTimeout){
							clearTimeout(timer);
						}
	 				}else{
	 					opts.error && opts.error();
	 				}
					S.ajax.xhrPool.push(xhr);
	 			break;
	 			default:
	 			break;
	 		}
	 	};
		
		//PAD the params to the url.
		var serialized=S.serialize(opts.data);
		//打开连接： opts.async 未设置 则为false
		if(opts.method && opts.method.toUpperCase()==='POST'){
			xhr.open('POST',url,opts.async);
			xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.send(serialized);
		}else{
			if(serialized){
				url += '&'+serialized;
			}
			xhr.open('GET',url,opts.async);
			xhr.send(null);
		}
	}
	function _newInstance(){
		var xmlHttp;
		try {
			xmlHttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					//alert("您的浏览器不支持AJAX！");
					throw new Error('the browser does not support ajax!');
					return null;
				}
			}
		}
		return xmlHttp;
	};
	S.ajax.config={poolSize:1,timeout:0};
	
	S.ajax.setup=function(conf){
		S.extend(this.config,conf);
	};
	
	S.ajax.xhrPool=new S.pool({
		poolSize:1,
		newInstance:_newInstance
	});
	
	S.xhr = S.ajax.xhrPool.get();
	S.ajax = ajax;
})(newsilen);