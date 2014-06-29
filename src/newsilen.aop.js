(function(S){
	//if(S.aop)return ;
	// 把所有通知全部织入到切入点方法
	function weaveAll(who,when,advices){
		var original = who[when],exceptions=null;
		if(!original || !S.isFunc(original))return;
		who[when]=function(){
			try{
				advices.before && advices.before.apply(this,arguments);
				var rs;
				if(advices.around){
					var invocation = { target: this, args: Array.prototype.slice.call(arguments) };
					rs = advices.around.call(invocation.target,{
						arguments:invocation.args,process:function(){
							return original.apply(invocation.target,invocation.args);
						}
					});	
				}else{
					rs = original.apply(this,arguments);
				}
				
				advices.after && advices.after.call(this,rs);
			}catch(e){
				exceptions = e;
			}
			exceptions && advices.onThrow && advices.onThrow.call(this,exceptions,who,when);

			advices.onFinally && advices.onFinally.call(this,exceptions,who,when);
			return rs;
		};
	}

	// 织入单一类型的通知
	function weaveOne(who,when,type,what){
		var original = who[when];
		if(!original || !S.isFunc(original) || !what || !S.isFunc(what))return;
		switch(type){
			case 1://before
				who[when] = function(){
					what.apply(this,arguments);
					original.apply(this,arguments);
				};
			break;
			case 2://after
				who[when] = function(){
					var rv = original.apply(this,arguments);
					what.call(this,rv);
				};
			break;
			case 3://around
				who[when] = function(){
					var invocation = { target: this, args: Array.prototype.slice.call(arguments) };
					return advices.around.call(invocation.target,{
						arguments:invocation.args,process:function(){
							return original.apply(invocation.target,invocation.args);
						}
					});
				};
			break;
			case 4://onThrow
				who[when] = function(){
					try{
						original.apply(this,arguments);
					}catch(e){
						what.call(this,e,who,when);
					}
				};
			break;
			case 5://finally
				var exc = null;
				who[when] = function(){
					try{
						original.apply(this,arguments);
					}catch(e){
						exc = e;
					}
					what.call(this,exc,who,when);
				};
			break;
			default:break;
		}
	}

	function weave(pointcut,advices){
		var who = pointcut.who,
			when = pointcut.when,
			advices=advices||{};
		if(S.isStr(when)){// 传入字符串即方法名
			weaveAll(who,when,advices);
		}else if(S.isRegExp(when)){// 传入正则
			for(var method in who){
				method.match(when) && weaveAll(who,method,advices);// 对名字满足正则的方法进行织入
			}
		}
	}
	S.aop = weave;

	S.aop.before=function(pointcut,advice){
		weaveOne(pointcut.who,pointcut.when,1,advice);
	};
	S.aop.after=function(pointcut,advice){
		weaveOne(pointcut.who,pointcut.when,2,advice);
	};
	S.aop.around=function(pointcut,advice){
		weaveOne(pointcut.who,pointcut.when,3,advice);
	};
	S.aop.onThrow=function(pointcut,advice){
		weaveOne(pointcut.who,pointcut.when,4,advice);
	};
	S.aop.onFinally=function(pointcut,advice){
		weaveOne(pointcut.who,pointcut.when,5,advice);
	};
})(newsilen);