(function(window) {
	// factory and namespace. transport the argument object to an instance of the mapping class in newsilen.
	function S(args) {
		// return S when no arguments passed.
		if (arguments.length === 0) return S;
		// if an instance of S's class passed,return itself.
		if(args instanceof S.Root) return args;
		/*// more than one argument,the first argument is the constructor,others are parameters.
		if (arguments.length > 1) {
			var a = Array.prototype.slice.call(arguments, 1);
			return new args(a); TODO a is an array but the arguments we need.
		}*/
		// an array was passed.
		if (S.isArray(args)) {
			return new S.Array(args);
		}

		//for the doms,this is our main purpose.
		//if the argument is a string, seen as the id of the target element.
		if (typeof args === 'string') {
			args = window.document.getElementById(args);
		}
		// switch the type of the element and return mapping object.
		if (args.nodeType === 1) {//element
			switch (args.nodeName) {//toUpperCase
			case 'INPUT':
				return new S.Input(args);
			case 'SELECT':
				return new S.Select(args);
			case 'FORM':
				return new S.Form(args);
			default:
				return new S.Element(args);
			}
		}
		// if there is no class matching with the element, return itself.
		return args;
	}
	var expando='NS'+('1.0'+Math.random()).replace(/\D/g,''),
		uuid=0,
		cache={};
	// Type checking.
	S.inFunction=function(foo){
		return typeof foo === 'function';
	};
	S.isArray=function(ary){
		return ary.constructor === Array;
	};
	S.isString=function(str){
		return typeof str === 'string';
	};
	/*cache data for a dom element.*/
	S.data=function(elem,name,data){
		if(data===undefined){//get data.
			var uid = elem.getAttribute(expando);
			return cache[uid][name];
		}
		//set data.
		var uid = elem.getAttribute(expando);
		if(!uid){//set an unique uuid.
			uid = ++uuid;
			elem.setAttribute(expando,uid);
		}
		if(!cache[uid]){//init the cahce when no data cached before.
			cache[uid]={};
		}
		cache[uid][name]=data;//cache the data.
	};
	S.removeData=function(elem,name){
		var uid = elem.getAttribute(expando);
		if(!uid || !cache[uid])return;
		delete cache[uid][name];
	};
	
	//浏览器检查
	S.browser=(function(ua){
		ua = ua.toLowerCase();// RegExp copyed from jQuery.
		var rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
		br={},
		match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];
		if(match[1]){
			br[match[1]]=true;
			br.version = match[2]||'0';
		}
		return br;
	})(navigator.userAgent);
	
	/*get event any where.*/
	S.event=function(event) {
		var ev = event || window.event;
		if (!ev) {
			var c = this.event.caller;
			while (c) {
				ev = c.arguments[0];
				if (ev && (Event == ev.constructor || MouseEvent == ev.constructor)) {
					break;
				}
				c = c.caller;
			}
		}
		return ev;
	};
	
	S.Root = function(){};
	S.Root.prototype.constructor=S.Root;
	// JS extend object or class.
	S.extend = function(subClass, superClass){
		if(typeof superClass ==='object'){// extend an object.
			for(var k in superClass){
				subClass[k]=superClass[k];
			}
		}else if(typeof superClass === 'function' && typeof subClass === 'function'){// extend from superClass
			var foo = function() {};
			foo.prototype = superClass.prototype;
			subClass.prototype = new foo();
			subClass.prototype.constructor = subClass;// set constructor here.
			if(superClass.prototype.constructor!==superClass){
				throw new Error('superClass.prototype.constructor does not equal to superClass,is it a final class?');
			}
			subClass.prototype.superClass=superClass.prototype.constructor;
		}
	};

	/**
	 * 将orgi中的属性复制到dest对象中，如果dest中已经存在此属性则覆盖
	 */
	S.copy=function(dest,orgi){
		for(var k in orgi){
			dest[k]=orgi[k];
		}
	};
	
	S.transfer=function(){
	
	};
	
	S.impl = function(/*String*/ Interface,/*Object*/ impl,/*Object*/ namespace){
		namespace = namespace || window;
		namespace[Interface]=impl;
	};

	S.abstr = function() {

	};

	S.Array = function(ary) {
		this.ary = ary;
	};
	S.extend(S.Array, S.Root);
	S.extend(S.Array.prototype,{
		get:function(){
			return this.ary;
		},
		//distanct
		unique : function() {
			var res = [], hash = {},a=this.get();
			for(var i=0, elem; (elem = a[i]) != null; i++){
				if (!hash[elem]){
					res.push(elem);
					hash[elem] = true;
				}
			}
			return new S.Array(res);
		},
		// In the handler,this means the current element.推荐使用I,N方式，因为对于数字，字符串之类的类型，用call方法会使其变成object
		// It takes three args.  handler(index,currentElem,theArray);
		// If the handler return false, the loop will be break.
		each:function(handler){
			for(var i=0,a=this.get(),l=a.length;i<l;i++){
				if(handler.call(a[i],i,a[i],a)===false)break;
			}
			return this;
		},
		length:function(){
			return this.get().length;
		},
		first:function(){
			return this.get()[0];
		},
		last:function(){
			return this.get()[this.length()-1];
		},
		clear:function(){
			this.get().length=0;
			return this;
		}
	});
	S.Element = function(elem) {
		this.elem = elem;
	};
	S.extend(S.Element, S.Root);
	S.extend(S.Element.prototype, {
		get:function($) {//$ is a wrapper like jQuery.
			return $ ? $(this.elem) : this.elem;
		},
		width:function(w) {
			return this.elem.offsetWidth;
		},
		position:function() {
			
		},
		attr:function(atr,val){
			if(val){
				this.get()[atr]=val;
				return this;
			}
			return this.get()[atr];
		},
		data:function(name,d){
			return S.data(this.get(),name,d);
		}
	});

	// INPUT
	S.Input = function(ipt) {
		this.superClass.call(this, ipt);
	};
	S.extend(S.Input, S.Element);
	S.extend(S.Input.prototype,{
		val:function(v) {
			if (v) {
				this.get().value = v;
				return this;
			} else {
				return this.get().value;
			}
		}
		,getCursorPsn:function(){
			if (document.selection) {	//for IE
				/*//ipt.focus();
				var sel = document.selection.createRange();
				sel.moveStart('character', -ipt.value.length);
				position = sel.text.length;*/
				function f(){
					var currentRange = document.selection.createRange();
					var workRange = currentRange.duplicate();
					this.get().select();
					var allRange = document.selection.createRange();
					var len = 0;
					while (workRange.compareEndPoints("StartToStart", allRange) > 0) {
						workRange.moveStart("character", -1);
						len++;
					}
					currentRange.select();
					return len;
				}
				return f;
			}
			function f2(){
				var ipt = this.get();
				if (ipt.selectionStart || ipt.selectionStart == '0') {
					return ipt.selectionStart;
				}
			}
			return f2;
			
		}()
		,getSelectText:function(){
			if (document.selection) {// IE
				function f(){
					return document.selection.createRange().text;
				}
				return f;
			}
			if (window.getSelection) {// chrome,firefox,opera
				function f2(){
					//return window.getSelection().toString();
					var e = this.get();
					if (e.selectionStart != undefined && e.selectionEnd != undefined) { 
				        var start = e.selectionStart; 
				        var end = e.selectionEnd; 
				        return e.value.substring(start, end); 
				    }
					return "";
				}
				return f2;
			}
			if (document.getSelection) {
				return function(){
					return document.getSelection();
				};
			}
		}()
		,getForeEntry : function() {
			var evt=S.event();
			var k = evt.keyCode||evt.which||evt.charCode;
			var kv = String.fromCharCode(k);
			var o = this.get().value;
			var cPsn = this.getCursorPsn();
			var sTxt = this.getSelectText();
			var s1 = o.substring(0, cPsn);
			if (sTxt.length !== undefined) {
				cPsn += sTxt.length;
			}
			var s2 = o.substring(cPsn);
			return s1 + kv + s2;
		}
	});
	// SELECT
	S.Select = function(slt) {
		this.superClass.call(this, slt);
	};
	S.extend(S.Select, S.Element);
	S.extend(S.Select.prototype, {
		hasValue:function(value){
			var opts =this.get().options;
			var i,n=opts.length;
			for(i=0;i<n;i++){
				if(opts[i].value==value){
					return true;
				}
			}
			return false;
		}
	});

	// FORM
	S.Form = function(fm) {
		this.superClass.call(this, fm);
	};
	S.extend(S.Form, S.Element);

	/**JS AOP normal.*/
	S.aop={
		before:function(who,when,what){
			var original = who[when];
			who[when]=function(){
				what.apply(this,arguments);
				original.apply(this,arguments);
			};
		},
		after:function(who,when,what){
			var original = who[when];
			who[when]=function(){
				what.apply(this,arguments);
				original.apply(this,arguments);
			};
		},
		round:function(who,when,what){
			var original = who[when];
			who[when]=function(){
				what(original);
			};
		}
	};
	
	// Pool.
	// The param conf is an object as {poolSize:3,newInstance:function(){return new instance();}}
	// auto gc is required.
	S.pool=function(conf){
		this.pool=[];
		if(!conf || !conf.newInstance && (typeof conf.newInstance !== 'function')){
			throw new Error('the factory function is required。');
		}
		this.poolSize=conf.poolSize||1;
		this._newInstance=conf.newInstance;
	};
	S.extend(S.pool.prototype,{
		get:function(){
			if(!this.pool.length){
				this.pool=this.pool.concat(this._initPool());
			}
			return this.pool.shift();
		},
		free:function(o){
			this.pool.push(o);
		},
		_initPool:function(){
			var pool=[],l=this.poolSize,i=0;
			for(;i<l;i++){
				pool.push(this._newInstance());
			}
			return pool;
		}
	});
	
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
	//ajax.
	S.ajax=function(opts){
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
		var serialized=$NS.serialize(opts.data);
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
	};
	S.ajax._newInstance=function(){
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
		newInstance:S.ajax._newInstance
	});
	
	S.xhr = S.ajax.xhrPool.get();
	
	if(window.clipboardData){//Will not apply this service when the browser does not support.
		S.Clipboard={
			//返回剪贴板的内容 
			get:function(){
				return(window.clipboardData.getData('Text'));
			},
			//返回是否成功
			set:function(maintext){
			  return (window.clipboardData.setData("Text", maintext)); 
			}
		};
	}
	
	
	// add S and the shortcut S to window.
	window.S = window.newsilen = S;
})(window);