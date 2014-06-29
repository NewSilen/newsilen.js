module('newsilen.array');
test( "newsilen array exists", function() {
	ok(!!newsilen, "newsilen exists!" );
	ok(!!S, "S exists!" );
	ok(!!S.Array, "S.Array exists!" );
});

test('length',function(){
	var ary = [4,5,6];
	var a = S(ary);
	equal(a.length(),3,'length of [4,5,6] is 3.');
});

test('get',function(){
	var ary = [4,5,6];
	var a = S(ary);
	equal(a.get(),ary,'get the array.');
	equal(a.get(2),6,'get the elem by index.');
});
test('unique',function(){
	var ary = [4,5,6,4,5,1];
	var a = S(ary);
	var u = a.unique();//S([4,5,6,1]);
	equal(u.length(),4,'length of [4,5,6] is 3.');
	equal(u.get(0),4);
	equal(u.get(1),5);
	equal(u.get(2),6);
	equal(u.get(3),1);
});

test('clear',function(){
	var ary = [4,5,6];
	var a = S(ary).clear();
	equal(ary.length,0,'the ary is empty after clear.');
	equal(a.length(),0,'the S(ary) is empty after clear.');
});

test('first',function(){
	var ary = [4,5,6];
	var a = S(ary);
	equal(a.first(),4,'the first in [4,5,6] is 4.');
});

test('last',function(){
	var ary = [4,5,6];
	var a = S(ary);
	equal(a.last(),6,'the last in [4,5,6] is 6.');
});