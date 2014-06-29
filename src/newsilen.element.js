//依赖S.data
(function(S){
	function element(elem){
		this.elem = elem;
	}

	S.extend(elem);
	S.extend(elem,{
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
		},
		on:function(type,listener){
			this.elem.addEventListener(type,listener);
		},off:function(){

		}
	});

})(newsilen);