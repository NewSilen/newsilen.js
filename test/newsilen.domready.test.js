module('newsilen.domready');
(function(){
	var order=[];

	// loaded check.
	test('newsilen.domready exist',function(){
		ok(!!newsilen, "newsilen exists!" );
		ok(!!S, "S exists!" );
		ok(!!S.ready, "S.ready exists!" );
		ok(!!S.isFunc(S.ready), "S.ready is an function!" );
	});

	function makeHandler(testId){
		return function(arg){
			order.push(testId);
		}
	}

	document.addEventListener('DOMContentLoaded',makeHandler('before'));
	window.addEventListener('load',makeHandler('load'));
	S.ready(makeHandler('A'));
	S.ready(makeHandler('B'));
	S.ready(makeHandler('C'));
	document.addEventListener('DOMContentLoaded',makeHandler('after'));

	var noEarlyExecution = order.length === 0;

	test('newsilen.domready',function(){
		expect(2);
		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready.");
		deepEqual(order, ["A","B","C","before","after","load"], "Bound DOM ready handlers should execute in on-order.");

	});
})();