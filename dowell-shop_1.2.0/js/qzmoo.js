/**
 * qzmoo 是轻知商务整理的一套最基础的实用函数集
 * @author qzmoo.cn
 * @version 1.0.0
 */
var qzmoo = {
	
	config: {
		host: 'http://cs002.zkeerp.net/pok/apis/apizb/',
		web: 'http://cs002.zkeerp.net/pok/weixin/',
		page: 1,
		pagesize: 10
	},
	
	isEmail: function(str) {
		/**
		* 该方法用于检测邮箱格式。
		* @author qzmoo.cn
		* @param str 要检查的邮箱字符串
		*/
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return reg.test(str);
	},
	
	isPhone: function(str) {
		/**
		* 该方法用于检测手机号码格式。
		* @author qzmoo.cn
		* @param str 要检查的手机号字符串
		*/
		var reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/; 
		if (!reg.exec(str)) { 
			return false; 
		}else{
			return true; 
		}
	},
	
	isTel: function(str) {
		/**
		* 该方法用于检测座机号码格式。
		* @author qzmoo.cn
		* @param str 要检查的座机号字符串
		*/
		var reg = /^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$/;
		if(reg.test(num)){
			return true;
		}else{
			return false;
		}
	},
	
	isImg: function(a) {
		/**
		* 该方法用于判断是不是图片地址。
		* @author qzmoo.cn
		* @param a 需要判断的字符串
		*/
		if(a.indexOf('.jpg') > 0 || a.indexOf('.png') > 0 || a.indexOf('.gif') > 0 || a.indexOf('.jpeg') > 0 || a.indexOf('.bmp') > 0){
			return true;
		}else{
			return false;
		}
	},
	
	ckeNum: function(a) {
		/**
		* 该方法强制只能输入数字和小数点。
		* @author qzmoo.com
		* @param a 参数名称
		*/
		var _this = a
		_this.value = _this.value.replace(/\D/g, '')
	},
	
	ckedNum: function(a) {
		/**
		* 该方法强制只能输入数字和小数点。
		* @author qzmoo.com
		* @param a 参数名称
		*/
		var _this = a
		_this.value = _this.value.replace(/[^\d.]/g, '')
	},
	
	getParam: function(a) {
		/**
		* 该方法用于获取地址栏后的get参数。
		* @author qzmoo.cn
		* @param a 参数名称
		*/
		var reg = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},
	
	addPath: function(a, b) {
		/**
		* 该方法用于增加前缀地址。
		* @author qzmoo.cn
		* @param a 增加的字符串
		* @param b 需要增加前缀的字符串
		*/
		var http_url = a || "http://www.qzmoo.cn";
		var tem = b;
		
		if(b){
			if(tem.toLowerCase().indexOf("http://") != -1){
				return b;
			}else{
				b = "/" + b;
				b = b.replace("//","/");
				return http_url + b;
			}
		}else{
			return http_url;
		}
	},
	
	a: function(a){
		var b = a.substr(1, a.length);
		return a.indexOf('#') >= 0 ? document.getElementById(b) : document.querySelector(a);
	},
	
	delTrim: function(a, b) {
		/**
		* 该方法用于去掉字符串的所有空格。
		* @author qzmoo.cn
		* @param a 需要去空格的字符串
		*/
		var reg = a.replace(/(^\s+)|(\s+$)/g,"");
		if(b.toLowerCase() == "g"){
		   reg = reg.replace(/\s/g,"");
		}
		return reg;
	},
	
	curTime: function() {
		/**
		* 该方法用于获取当前unix时间戳(秒)。
		* @author qzmoo.cn
		* @return <int>  unix时间戳(秒)  
		*/
		return Date.parse(new Date());
	},
	
	countdownTime: function(st) {
		/**              
		 * 倒计时
		 * @param <st> 2014-01-01 20:20:20  日期格式              
		 * @return <int>        unix时间戳(秒)              
		 */
		var t = (new Date(st)) - (new Date()); //计算剩余的毫秒数  
		
		if(t < 1){
			return '0天 - 00:00:00';
		}
		
        var d = parseInt(t / 1000 / 60 / 60 / 24, 10); //计算剩余的天数  
        var h = parseInt(t / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数  
        var m = parseInt(t / 1000 / 60 % 60, 10); //计算剩余的分钟数  
        var s = parseInt(t / 1000 % 60, 10); //计算剩余的秒数  
        d = (d < 10) ? ('0' + d) : d;  
        h = (h < 10) ? ('0' + h) : h;
        m = (m < 10) ? ('0' + m) : m;
        s = (s < 10) ? ('0' + s) : s;
        
        return d + '天 - ' + h + ':' + m + ':' + s;
	},
	
	replaceall: function(a, b) {
		/**              
		 * 字符全部替换              
		 * @param <a> string    原始字符串              
		 * @param <b> string    需要替换的字符                          
		 */
		var reg = new RegExp(a, "gm");
		return this.replace(reg, b);   
	},
	
	clearInput: function(o) {
		obj = document.querySelectorAll('input,textarea');
		for (var i = 0; i < obj.length; i++) {
			obj[i].value = ''
		}
	},
	
	sortjson: function(array, field, reverse) {
		/**              
		 * json 数据排序              
		 * @param <array> array    原始json字符串              
		 * @param <field> string    排序字段             
		 * @param <reverse>  string   倒序              
		 */
		//数组长度小于2 或 没有指定排序字段 或 不是json格式数据
		if(array.length < 2 || !field || typeof array[0] !== "object") return array;
		//数字类型排序
		if(typeof array[0][field] === "number") {
			array.sort(function(x, y) { return x[field] - y[field]});
		}
		//字符串类型排序
		if(typeof array[0][field] === "string") {
			array.sort(function(x, y) { return x[field].localeCompare(y[field])});
		}
		//倒序
		if(reverse) {
			array.reverse();
		}
		return array;
	},
	
	loading: function() {
		var load = document.createElement('div');
		load.setAttribute('id', 'load');
		
		load.innerHTML = '<div class="spinner">'+
			'<div class="spinner-container container1">'+
		    '<div class="circle1"></div>'+
		    '<div class="circle2"></div>'+
		    '<div class="circle3"></div>'+
		    '<div class="circle4"></div>'+
		  '</div>'+
		  '<div class="spinner-container container2">'+
		    '<div class="circle1"></div>'+
		    '<div class="circle2"></div>'+
		    '<div class="circle3"></div>'+
		    '<div class="circle4"></div>'+
		  '</div>'+
		  '<div class="spinner-container container3">'+
		    '<div class="circle1"></div>'+
		    '<div class="circle2"></div>'+
		    '<div class="circle3"></div>'+
		    '<div class="circle4"></div>'+
		  '</div>'+
		  '</div>';
		
		document.body.appendChild(load);
	},
	
	loaded: function() {
		var load = qzmoo.a('#load');
		if(load){
			document.body.removeChild(load);
		}
	},
	
	downVeri: function(a, b, c) {
		var obj = qzmoo.a(a);
		obj.style.backgroundColor = '#ccc';
		obj.innerHTML = '还剩' + b + '秒';
		b--;
		
		setTimeout(function(){
			if(b < 0){
				obj.style.backgroundColor = c;
				obj.innerHTML = '获取验证码';
				b = 60;
				return;
			}else{
				qzmoo.downVeri(a, b, c);
			}
		},998)
	},
	
	showPop: function(mask, pop, animin, animout, cb) {
		mask.classList.remove('dis');
		pop.classList.remove('dis');
		pop.classList.add(animin);
		
		pop.addEventListener('click', function(e){
			if(e.target.getAttribute('data-ty') == 'close'){
				qzmoo.hidePop(mask, pop, animout)
			}else if(e.target.getAttribute('data-ty') == 1){
				cb && cb(mask, pop, animout)
			}
		})
	},
	
	hidePop: function(mask, pop, animout) {
		pop.classList.add(animout);
		setTimeout(function() {
			pop.classList.add('dis')
			pop.classList.remove(animout)
			mask.classList.add('dis')
		}, 200)
	},
	
	showToast: function(tip) {
		var _tip = tip ? tip : '操作成功'
		var toast = document.createElement('div')
		toast.className = 'toast anim fade-in'
		toast.innerHTML = _tip
		
		document.body.appendChild(toast);
		toast.style.marginLeft = -(toast.offsetWidth / 2) + 'px'
		setTimeout(function(){
			toast.classList.remove('fade-in')
			toast.classList.add('fade-out')
			setTimeout(function(){
				document.body.removeChild(toast);
			}, 200)
		}, 2000)
	},
	
	showConfirm: function(tip, cb) {
		var _tip = tip ? tip : '确认操作?'
		var confirmmask = document.createElement('div')
		confirmmask.className = 'mask'
		var confirm = document.createElement('div')
		confirm.className = 'confim anim fade-in'
		confirm.innerHTML = '<div class="confim-con">'+ _tip +'</div>'+
			'<div class="confim-bot">'+
				'<a href="javascript:void(null)" data-ty="close">取消</a>'+
				'<a href="javascript:void(null)" data-ty="ok">确定</a>'+
			'</div>'
		
		document.body.appendChild(confirmmask);
		document.body.appendChild(confirm);
		confirm.style.marginTop = -(confirm.offsetHeight / 2) + 'px'
		confirm.style.marginLeft = -(confirm.offsetWidth / 2) + 'px'
		confirm.addEventListener('click', function(e){
			if(e.target.getAttribute('data-ty') == 'close'){
					confirm.classList.remove('fade-in')
					confirm.classList.add('fade-out')
					setTimeout(function(){
						document.body.removeChild(confirmmask);
						document.body.removeChild(confirm);
					}, 200)
			}else if(e.target.getAttribute('data-ty') == 'ok'){
				cb && cb(confirmmask, confirm, 'fade-out')
			}
		})
	}

};
