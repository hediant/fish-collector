//
// exports.config must have field
//		{ "max_tasks" : number }
//
exports.config = require('./config.json');

//
// exports.crawl must be a function
//
exports.crawl = function (tasks, cb){
	var params = [];
	tasks.forEach(function (task){
		params.push(task.params);
	});

	setImmediate(function (){
		cb && cb(null, params);
	});
}