(function(S){
	function array(ary){
		this.ary = ary;
	};
	S.extend(array);
	S.extend(array,{
		get:function(i){
			// 没有参数返回数组
			// i 是负的返回倒数第几个 -1返回最后一个 ？TODO
			return arguments.length===0 ? this.ary : this.ary[i];
		},
		//distanct
		unique : function() {
			var res = [], hash = {},a=this.ary;
			for(var i=0, elem; (elem = a[i]) != null; i++){
				if (!hash[elem]){
					res.push(elem);
					hash[elem] = true;
				}
			}
			return new array(res);
		},
		// In the handler,this means the current element.
		// 推荐使用I,N方式，因为对于数字，字符串之类的类型，用call方法会使其变成object
		// It takes three args.  handler(index,currentElem,theArray);
		// If the handler return false, the loop will be break.
		each:function(handler){
			for(var i=0,a=this.ary,l=a.length;i<l;i++){
				if(handler.call(a[i],i,a[i],a)===false)break;
			}
			return this;
		},
		length:function(){
			return this.ary.length;
		},
		first:function(){
			return this.ary[0];
		},
		last:function(){
			return this.ary[this.length()-1];
		},
		clear:function(){
			this.ary.length=0;
			return this;
		}
	});

	S.push(function(arg){
		return S.isAry(arg);
	},array);

	S.Array = array;
})(newsilen);