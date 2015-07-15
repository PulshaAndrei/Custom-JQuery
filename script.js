function jQuery(list, node){
	this.list = list;
	this.node = node;
};

NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.indexOf = Array.prototype.indexOf;
NodeList.prototype.indexOf = Array.prototype.indexOf;

function $(selector){
	var obj = new jQuery();
	obj.node = document.createElement("div");
	if (selector[0] !== "<") obj.node.innerHTML = "<"+selector+">";
	else obj.node.innerHTML = selector;
	if (obj.node.innerText < obj.node.innerHTML) obj.node = obj.node.firstChild;
	else obj.node=obj.node.innerText;

	if (typeof(selector) === "string" && selector[0] !== "<") obj.list = document.querySelectorAll(selector);
	else if (selector instanceof Element) obj.list = new Array(selector);
	else if (selector instanceof jQuery) obj = selector;
	return obj;
};

jQuery.prototype.each = function(func) {
	for (var i=0; i<this.list.length && !func.call(this.list[i],i,this.list[i]); i++);
	return this;
};

jQuery.prototype.addClass = function(newClass) {
	if (typeof(newClass) === "function") 
		this.each(function (index, item) { $(item).addClass(newClass(index)); });
	else this.each(function (index, item) { item.classList.add(newClass); });
	return this;
};

jQuery.prototype.append = function(newElem) {
	if (typeof(newElem) === "function") 
		this.each(function (index, item) { item.appendChild($(newElem(index)).node.cloneNode(true)); });
	else if (typeof(newElem) === "string") 
		this.each(function (index, item) { item.appendChild($(newElem).node.cloneNode(true)); });
	else this.each(function (index, item) { item.appendChild(newElem.node.cloneNode(true)); });
	return this;
};

jQuery.prototype.html = function(arg) {
	if (!arg) return this.list[0].innerHTML;
	if (typeof(arg) === "string") this.each(function (index, item) { item.innerHTML = arg; });
	if (typeof(arg) === "function") this.each(function (index, item) {item.innerHTML = arg(index); });
	return this;
};

jQuery.prototype.attr = function(atr_name, atr_value) {
	if (arguments.length === 1 && typeof(atr_name) === "string") 
		return this.list[0].getAttribute(atr_name);
	if (arguments.length === 1 && typeof(atr_name) === "object") 
		for (key in atr_name) this.attr(key, atr_name[key]);
	if (arguments.length === 2 && typeof(atr_value) === "function")
		this.each(function (index, item) { item.setAttribute(atr_name, atr_value(index)); });
	if (arguments.length === 2 && typeof(atr_value) !== "function") 
		this.each(function (index, item) { item.setAttribute(atr_name, atr_value); });
	return this;
};

jQuery.prototype.children = function(selector) {
	var mas = [];
	this.each(function (index, item) { mas.push(item.children)});
	var ans = [];
	mas.forEach(function(item, index) {item.forEach(function (item) {ans.push(item)}); });
	if (arguments.length !== 0) {
		var mas_filter = document.querySelectorAll(selector);
		ans=ans.filter(function(item) { return mas_filter.indexOf(item) !== -1; });
	};
	
	return ans;
};

jQuery.prototype.css = function(css_name, css_value) {
	if (arguments.length === 1 && typeof(css_name) === "string") 
		return this.list[0].style[css_name];
	if (arguments.length === 1 && css_name instanceof Array) {
		var mas = [];
		var elem = $(this.list[0]);
		css_name.forEach(function (item) { mas.push(elem.css(item))});
		return mas;
	};
	if (arguments.length === 1) 
		for (key in css_name) this.css(key, css_name[key]);
	if (arguments.length === 2 && typeof(css_value) === "function")
		this.each(function (index, item) { item.style[css_name]=css_value(index); });
	if (arguments.length === 2 && typeof(css_value) !== "function") 
		this.each(function (index, item) { item.style[css_name]=css_value; });
	return this;
};

jQuery.prototype.data = function(key, value) {
	if (arguments.length === 0) return this.list[0].dataset;
	if (arguments.length === 1 && typeof(key) === "string") return this.list[0].dataset[key];
	if (arguments.length === 2)	this.each(function (index, item) { item.dataset[key] = value; });
	if (arguments.length === 1) 
		this.each(function (index, item) {
			for (x in key) item.dataset[x] = key[x]; 
		});
	return this;
};

jQuery.prototype.on = function(events, selector, data, func, one) {
	if (typeof(events) === "string") {
		if (data == null && func == null) {
			func = selector;
			data = selector = undefined;
		} else if (func == null) {
			if (typeof selector === "string") {	
				func = data;
				data = undefined;
			} else {
				func = data;
				data = selector;
				selector = undefined;
			}
		}
		var z = function () { func.call(this,data); };
		if (one) z = function () { 
				func.call(this,data); 
				this.removeEventListener(events,z);
		};
		if (selector == null) 
			this.each(function (index, item) { item.addEventListener(events, z)});
		else {
			var filter = $(selector).list;
			this.each(function (index, item) { 
				if (filter.indexOf(item) !== -1)
				item.addEventListener(events,z)});
		}
	}

	if (typeof(events) === "object") {
        if (typeof(selector) !== "string") {
            data = data || selector;
            selector = undefined;
        }
		for (ev in events) this.on(ev, selector, data, events[ev]);
	}		 
	return this;
};

jQuery.prototype.one = function(events, selector, data, func) {
	return this.on(events, selector, data, func, true);
};


$('div').addClass(function(index){
	return "item-"+index;
});

$("div").append(function (index) {
	return "<li>"+index+"</li>"});
$("li").append($("div"));

$("li").html(function (index) {	return index+"<div></div>"; });

console.log($("div").attr("class"));
$("li").attr({"class": "123", "target": "none"});
$("li").attr("class", function (index) { return index+"xxx"});

console.log($("body").children(".item-0"));
console.log($("div").children());

$("div>div").css("color","red");
console.log($("div>div").css("color"));
console.log($("div>div").css(["color","background"]));

$( "body" ).data( "foo", 52 );
$( "body" ).data( "bar", { myType: "test", count: 40 } );
$( "body" ).data( { baz: [ 1, 2, 3 ] } );
console.log($( "body" ).data( "foo" )); 
console.log($( "body" ).data());

$('li')
    .each(function (index) {
        $(this).html('<b>' + index + '</b>')
    })
    .append($('a'))
    .addClass('my-super-class')
    .css({backgroundColor: 'rebeccapurple'});

/*$("li").on("click",".my-super-class","123", function(param) {
  console.log( $(this).html() + param );
});
*/
$("li").one("click",".my-super-class","123", function(param) {
  console.log( $(this).html() + param );
});
