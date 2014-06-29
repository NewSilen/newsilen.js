(function(S){
	S.browser=(function(ua){
		ua = ua.toLowerCase();// RegExp copyed from jQuery.
		var rwebkit = /(webkit)[ \/]([\w.]+)/,
		ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
		rmsie = /(msie) ([\w.]+)/,
		rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
		br={},
		match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];
		if(match[1]){
			br[match[1]]=true;
			br.version = match[2]||'0';
		}
		return br;
	})(navigator.userAgent);
})(newsilen);