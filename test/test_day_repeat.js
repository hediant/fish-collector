var Task = require('../framework/task');
var Job = require('../framework/job');
var Scheduler = require('../framework/scheduler');
var Adapters = require('../framework/adapters');
var Moment = require('moment');

var shdlr = new Scheduler();
shdlr.run();

function disp(){
	console.log("Tasks:%s, Jobs: %s.", shdlr.getTasksCount(), shdlr.getJobs().length);
	//console.log(shdlr.getJobs());
}

var current = Moment();

var tasks = [
	new Task({"id":1, 
		"adapter":Adapters.demoAdapter1, 
		"interval" : 1000,
		"repeat" : {
			"type" : "day",
			"day" : {
				"start" : Moment(current + Moment.duration(5, 'seconds')).format('HH:mm:ss'),
				"end" : Moment(current + Moment.duration(20, 'seconds')).format('HH:mm:ss')
			}
		},
		"params":{"task":1}
	}),
	new Task({"id":2, 
		"adapter":Adapters.demoAdapter1, 
		"interval" : 1000,
		"repeat" : {
			"type" : "day",
			"day" : {
				"start" : Moment(current + Moment.duration(10, 'seconds')).format('HH:mm:ss'),
				"end" : Moment(current + Moment.duration(20, 'seconds')).format('HH:mm:ss')
			}
		},
		"params":{"task":2}		
	}),
	new Task({"id":3, 
		"adapter":Adapters.demoAdapter1,
		"interval" : 3000,
		"repeat" : {
			"type" : "day",
			"day" : {
				"start" : Moment(current + Moment.duration(15, 'seconds')).format('HH:mm:ss'),
				"end" : Moment(current + Moment.duration(20, 'seconds')).format('HH:mm:ss')
			}
		},
		"params":{"task":3}	
	})
]

console.dir (tasks[0], {"depth":4});
console.dir (tasks[1], {"depth":4});
console.dir (tasks[2], {"depth":4});
console.log("------------------------------------------------");


tasks.forEach(function (task){
	shdlr.addTask(task);
	task.on('data', function (data){
		console.log("task %s recv data, %s.", task.id, JSON.stringify(data));
	});	
});

setInterval(function (){
	disp();
}, 1*1000);

setTimeout(function (){
	process.exit();
}, 30 * 1000);