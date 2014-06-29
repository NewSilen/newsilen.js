(function(S){
	function weave(who,when,type,what){
		if(!who)return;
		who.aop= who.aop|| {};
		var aop = who.aop[when];
		if(!aop){//初始化织入
			aop = function(){
				var before = this.aop[when].before,
					after = this.aop[when].after,
					onFilnally = this.aop[when].onFilnally;
					original = this.aop[when].original,
					i=0;
				for(;i<before.length;i++){
					if(!before[i].apply(this,arguments)) break;
				}
				if(i===before.length){
					original = original || function(){};
					var rv = original.apply(this,arguments);
					for(i=0;i<after.length;i++){
						after[i].call(this,rv);
					}
				} else {
					for(i=0;i<onFilnally.length;i++){
						onFilnally[i].call(this,rv);
					}
				}
			};
			aop.before=[];
			aop.after=[];
			aop.onFilnally=[];
			aop.original=who[when];

			who[when]=function(){
				this.aop[when].call(this,arguments);
			}
		}

		var before = aop.before,after = aop.after,onFilnally = aop.onFilnally;
		switch(type){
			case 1:
				before.push(what);
			break;
			case 2:
				after.unshift(what);
			break;
			case 3:
				onFilnally.unshift(what);
			break;
			default:break;
		}
		who.aop[when] = aop;
	}
	S.aop2 = {
		before : function(pointcut,advice){
			var who = pointcut.who;
			if(!who)return;
			var when = pointcut.when;
			if(!S.isStr(when))return;
			weave(who,when,1,advice);
		},after : function(pointcut,advice){
			var who = pointcut.who;
			if(!who)return;
			var when = pointcut.when;
			if(!S.isStr(when))return;
			weave(who,when,2,advice);
		},onFilnally:function(pointcut,advice){
			var who = pointcut.who;
			if(!who)return;
			var when = pointcut.when;
			if(!S.isStr(when))return;
			weave(who,when,3,advice);
		}
	}
})(newsilen);