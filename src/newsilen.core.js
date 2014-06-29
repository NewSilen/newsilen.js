//New Silen Core
(function(window){
	//Core
	var typeList=[],count=0;
	function newsilen(arg){
		// return self when no arguments passed.
		if (arguments.length === 0) return newsilen;
		// arg has been an instance of newsilen's root.
		if(arg instanceof root)return arg;
		//if the argument is a string, seen as the id of the target element.
		if(isStr(arg))arg = document.getElementById(arg);

		for(var i=count-1;i>=0;i--){
			if(typeList[i].check(arg)===true){
				return new typeList[i].constctor(arg);
			}
		}
		// No class is mapped.
		return arg;
	}

	newsilen.push = function(check,constctor){
		//check must be a function and constctor must be an instance of  newsilen's root.
		if(!isFunc(check) || !constctor instanceof root)return false;
		typeList.push({
			'check':check,
			'constctor':constctor
		});
		count++;
	};
	/*************************************************************/
	//Type Check
	function isFunc(foo){
		return typeof foo === 'function';
	}
	function isAry(ary){
		return ary.constructor === Array;
	}
	function isStr(str){
		return typeof str === 'string';
	};

	newsilen.isFunc = isFunc;
	newsilen.isAry = isAry;
	newsilen.isStr = isStr;
	/*************************************************************/
	//JS OOP
	//@Private : Root object. All class is an instance of root.
	function root(){}
	root.prototype.constructor = root;
	// 子类subClass继承超类superClass，只作为类继承使用，所以要求subClass必须是function
	function extend(subClass,superClass){
		if(!isFunc(subClass))throw new Error('subClass is not a function.');
		//extends from root as default.
		if(!superClass)superClass = root;

		if(typeof superClass ==='object'){// extend prototype from an object.
			for(var k in superClass){
				subClass.prototype[k]=superClass[k];
			}
			return subClass;
		}
		if(typeof superClass === 'function'){// extend from superClass
			var foo = function() {};
			foo.prototype = superClass.prototype;
			subClass.prototype = new foo();
			subClass.prototype.constructor = subClass;// set constructor here.
			if(superClass.prototype.constructor!==superClass){
				throw new Error('superClass.prototype.constructor does not equal to superClass,is it a final class?');
			}
			subClass.prototype.superClass=superClass.prototype.constructor;
		}
	}

	newsilen.extend = extend;
	/*************************************************************/
	newsilen.version = 1.0;
	// Global API
	window.newsilen = window.S = newsilen;
})(window);