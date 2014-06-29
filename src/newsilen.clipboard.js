(function(S){
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
})(newsilen);