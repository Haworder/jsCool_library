
(function(){
	function searchElements(selector){

		var addEvent = function(element,type,fn){
			if(element.addEventListener){
				element.addEventListener(type,fn,false);
			}else{
				element.attachEvent("on" + type,fn);
			}
		}

		var removeEvent = function(element,type,fn){
			if(element.removeEventListener){
				element.removeEventListener(type,fn,false);
			}else{
				element.detachEvent("on" + type,fn);
			}
		}

		if(typeof selector == "string"){

			var reg = /[#\.a-zA-Z]/;
			var result =  [];

			if(reg.test(selector)){
				var first = selector[0];
				if(first == "#"){
					var elem = document.getElementById(selector.slice(1));
					result = elem ? [elem] : [];

				}else if(first == "."){

					//因为要兼容IE8，不能用className，所以要先找到所有元素，
					//	再找到相对应的类名进行匹配。

					var elems = document.getElementsByTagName("*");
					var len = elems.length;

					for(i = 0;i < len;i++){
						var name = elems.className[i];
						var string = "###" +　name.split(" ").join("###") + "###";

						//join(""):通过jion括号内的内容将数组连接起来转换为字符串。
						//split(""):通过括号内的内容将字符串切割，然后会返回一个数组，
						//	不是返回切割的元素。
						//str = "div header left"
						//selector = ".header"
						//
						//[div,header,left]
						//div###headerTop###left###
						//str.search(header###)

						if(selector.search("###" + selector.slice(1) + "###") != -1){
							result.push(elems[i]); 
						}
					}
				}else{
					var elems = document.getElementsByTagName(selector);
					result = [].slice.call(elems,0);
				}
			}
			return result;

		}else if(selector.nodeType == 1){
			return [selector];

		// 	//var div = document.getElementById("id");
		// 	//$(div).addClass();

		}else if(selector instanceof Init){
			result = selector;
		}

		
	}

	//存储事件名
	var event = {};
	var only = 0;

	function getStyle(elem,style){
		if(elem.currentStyle){
			return elem.currentStyle[style];
		}else{
			return window.getComputedStyle(elem,false)[style];
		}
	}

	function addPx(property,value){
		var object = {
			"z-index": 1,
			"opacity": 1
		};

		if(!object[property]){
			value += "px";
		}
		//用object来判断是否需要加px，他们的值设置的具体数值是为了让这个属性存在
		//设置成为其他数值也无所谓。

		// var arr = ["z-index","opacity"];

		// for(var i = 0; i < arr.length;i++){ 
		// 	if(property != arr[i]){
		// 		value += "px";
		// 		break;
		// 	}
		// }
		// 用数组方式for循环来判断是否需要加px

		return value;
	}

	function Init(selector){

		var arr = searchElements(selector);

		var len = arr.length;

		this.length = len;
		for(var i = 0; i < len;i++){
			this[i] = arr[i];
		}

	}

	Init.prototype = {

		each : function(callback){

			var len = this.length;
			
			for(var i = 0;i < this.length;i++){
				callback.call(this[i],i,this[i]);
				//$(".div").each(function(i,e))

				//第一个this[i]意义是用call来改变作用域，原本作用域为window，
				//	用call来改变为this[i];第二个i是再html文档中调用该方法时
				//	传入的参数，其意义为第几个;第三个参数this[i]也是html文档中
				//	调用该方法时传入的参数，其意义为当前元素。

			}
		},


		addClass : function(name){

			this.each(function(i,e){

				if($(e).hasClass(name) == false){
					e.className += " " +name;
				}
			});
		},

		removeClass : function(name){

			this.each(function(i,e){

				if($(e).hasClass(name) == true){

					var reg = new RegExp(name+" "+"|"+" "+name+"|"+name);
					e.className = e.className.replace(reg,"");
					// 正则方法
					




				// if($(e).hasClass(name)){
				// 	var className = e.className;
				// 	var newClass = className.replace(name,"");
				// 	e.className = newClass;
				// }
				// 非正则方式

				}
			});
		},

		toggleClass : function(){

			this.each(function(i,e){
				if($(e).hasClass(name)){
					$(e).removeClass(name);
				}else{
					$(e).addClass(name);
				}
			})

		},

		append : function(element){

			this.each(function(i,e){

				if(typeof element === "string"){

					e.insertAdjancetHTML("beforeend",element);

				}else if(element.nodeType == 1){

					var elem = element.cloneNode(true);
					e.appendChild(elem);

				}
			});
		},

		appendTo : function(parent){
			//parent必须是个节点
			//

				var that = this;

				if(parent instanceof Init){

					parent.each(function(i,e){

						if(e.nodeType == 1){

							var elem = that[0].cloneNode(true);
		 					e.insertAdjacentElement("beforeend",elem);
		 					
						}
			 		});
				}


		 }, 

		 previou : function( ){

		 },

		 previouTo : function(){

		 },

		 css : function(property,value){
		 	//样式有三种情况
		 	//有一个参数时，一个是获取样式，一个是一个对象
		 	//有两个参数时，设置样式，当遇到第二参数时，加px
		 	//$("#top").css({background:"yellow"})
		 	//$("#top").css("width",200)
		 	//$("#top").css("blue")


		 	var arg_len = arguments.length;

		 	if(typeof property == "string" && arg_len == 1){
		 		return getStyle(this[0],property);
		 		//获取css属性
		 	}

		 	if(arg_len == 2 && property){
		 		
		 		if(typeof value == "number"){
		 			value = addPx(property,value);
		 		}

		 		this[0].style[property] = value;
		 		//此处的property之前不能加.否则property就会成为
		 		//	style的一个属性而非一个变量。
		 	}

		 	if(typeof property == "object"){
		 		var value;

		 		for(var key in property){

		 			if(typeof property[key] == "number"){
		 				value = addPx(key,value[key]);
		 			}else{
		 				value = property[key];
		 			}

		 			this[0].style[key] = value;
		 		}
		 	}
		 },

		 attr : function(property,value){

		 	//$("#top").attr("title");
		 	//$("#top").attr("title","标题1");
		 	//$("#top").attr({
		 	//	title : "标题1"，
		 	//	name ：“header”
		 	//});

		 	var len = arguments.length;
		 	if(len == 1 && typeof property == "string"){
		 		return this[0].getAttribute(property,value);
		 	}
		 	if(len == 2 && typeof property == "string"){

		 		return this[0].setAttribute(property,value);

		 	}
		 	if(typeof property == "object"){

		 		for(var key in property){
		 			//key为属性名
		 			
		 			this[0].setAttribute(key,property[key]);

		 		}
		 	}

		 },

		 siblings : function(){

		 	var newDom = $("");
		 	var all = this[0].parentNode.children;
		 	var index = 0;

		 	for(var i = 0;i < all.length;i++){



		 		if(all[i] != this[0]){
		 			newDom[index] = all[i];
		 			index++;
		 		}
		 	}
		 	newDom.length = index;

		 	return newDom;

		 },

		 remove : function(){


		 	for(var i = 0;i < this.length;i++){

				var parent = this[i].parentNode;
	
		 		parent.removeChild(this[i]);
		 		
		 	}

		 	return this;

		 },

		 on : function(type,fn){
		 	this.each(function(i,e){
		 		//事件唯一
		 		only++;
		 		var name = "handle" + only;

		 		//把事件添加到events对象
		 		events[name] = fn;
		 		addEvent(e,type,fn);

		 		if(!e.eventName){
		 			e.eventName = {};
		 		}

		 		if(!e.eventName[type]){
		 			e.eventName[type] = [];
		 		}

		 		//把事件名添加到该元素的eventName属性上
		 		//eventName是一个对象
		 		//
		 		//eventName = {
		 		//	"click" : ["handle1"];
		 		//}
		 		
		 		e.eventName[type].push(name);
		 	})
		 },

		 off : function(type){
		 	this.each(function(i,e){
		 		if(e.eventName){

		 			//找到该元素下要删除的事件类型的事件名称
		 			var arr = e.eventName[type];
		 			for(var i = 0;i < arr.length;i++){

		 				//匹配EVENTS对象下的函数
		 				removeEvent(e,type,events[arr[i]]);

		 			}


		 		}
		 	})
		 },

		hasClass : function(name){

			var className = this[0].className;
			var arr = className.split(" ");
			var isExist = false;

			for(var i = 0;i < arr.length;i++){
				if(name == arr[i]){
					isExist = true;
				}
			}

			return isExist;

			//hasClass只能找一个元素的，若是想要查看多个的话要用到
			//	前面所定义的each()方法循环:
			//	$(".div").each(function(i,e){
			//		$(e).hasClass(name);
			//	})
			//	找到所有的".div"的元素，对每一个含有".div"的元素运行
			//		hasClass()方法，在hasClass()括号中添加想要查询的
			//		类名，如果存在就返回true，如果不存在就返回false。
			//		$(e)，因为e为一个参数，带便此时的元素，为了可以使用
			//		hasClass()方法，所以要用$()来包装起来。

		},


		//把Dom对象转换成类数组
		push: [].push,
		sort: [].sort,
		splice: [].splice
	}


	function Dom(selector){
		return new Init(selector);
	}

	window.$ = Dom;
}())

