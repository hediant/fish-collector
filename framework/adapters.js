// demo adapter
exports.demoAdapter1 = require('./adapters/demo');

//
// name - string, adapter name
// adapter - object
//		实现了adapter/demo 功能的函数对象
//
exports.add = function (name, adapter){
	exports[name] = adapter;
	return exports.get(name);
}

exports.remove = function (name){
	delete exports[name];
}

exports.get = function (name){
	return exports[name];
}