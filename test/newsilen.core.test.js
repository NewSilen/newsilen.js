module('newsilen.core');
test( "newsilen exists", function() {
	ok(!!newsilen, "Exists!" );
	ok(!!S, "Exists!" );
});
test( "isFunc", function() {
	ok(S.isFunc(function(){}), "isFunc  ok!" );
});
test( "isArray", function() {
	ok(S.isAry([]), "isArray!" );
});
test( "isString", function() {
	ok(S.isStr(''), "is String !" );
});
test( "newsilen OOP", function() {
	function animal(n){
		this.name = n.name;
	}

	S.extend(animal);
	var flag = true;
	S.push(function(){
		return flag;
	},animal);
	var c = S({name:'cat'});
	ok(c,'exists.');
	equal(c.name ,'cat','name == cat.');
	flag = false;
});
