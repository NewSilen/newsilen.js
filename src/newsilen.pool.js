(function(S){
	//JS Pool
	// The param conf is an object as {poolSize:3,newInstance:function(){return new instance();}}
	// auto gc is required.
	function pool(conf){
		this.pool=[];
		if(!conf || !conf.newInstance && (typeof conf.newInstance !== 'function')){
			throw new Error('the factory function is required。');
		}
		this.poolSize=conf.poolSize||1;
		this._newInstance=conf.newInstance;
	};
	S.extend(pool,{
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

	S.pool=pool;
})(newsilen);