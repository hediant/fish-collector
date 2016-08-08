var Task = require('../framework/task');
var Job = require('../framework/job');
var Scheduler = require('../framework/scheduler');
var Adapters = require('../framework/adapters');
var Moment = require('moment');

var shdlr = new Scheduler();
shdlr.run();

function disp(){
	console.log("################################################");
	console.log("[%s], Tasks: %s, Jobs: %s", Moment().format("YYYY-MM-DD HH:mm:ss"), shdlr.getTasksCount(), shdlr.getJobs().length);
	console.log("################################################");
	//console.log(shdlr.getJobs());
}

var current = Moment();

var tasks = [
	new Task({"id":1, 
		"adapter":Adapters.demoAdapter1, 
		"interval" : 60*1000,
		"repeat" : {
			"type" : "week",
			"week" : {
				"Mon" :[
					{
						"start" : "09:30:00",
						"end" : "11:30:00"
					},
					{
						"start" : "13:00:00",
						"end" : "15:00:00"
					}
				],
				"Wed" :[
					{
						"start" : "09:30:00",
						"end" : "11:30:00"
					},
					{
						"start" : "13:00:00",
						"end" : "15:00:00"
					}
				],
				"Fri" :[
					{
						"start" : "09:30:00",
						"end" : "11:30:00"
					},
					{
						"start" : "13:00:00",
						"end" : "15:00:00"
					}
				]			
			}
		},
		"params":{"task":1}
	}),
	new Task({"id":2, 
		"adapter":Adapters.demoAdapter1, 
		"interval" : 60*1000,
		"repeat" : {
			"type" : "week",
			"week" : {
				"Tue" :[
					{
						"start" : "00:00:00",
						"end" : "12:00:00"
					},
					{
						"start" : "13:00:00",
						"end" : "24:00:00"
					}
				],
				"Thu" :{
					"start" : "23:00:00",
					"end" : "24:00:00"
				}
			}
		},
		"params":{"task":2}		
	}),
	new Task({"id":3, 
		"adapter":Adapters.demoAdapter1,
		"interval" : 5*60*1000,
		"repeat" : {
			"type" : "week",
			"week" : {
				"Sat" :{
					"start" : "00:00:00",
					"end" : "24:00:00"
				}
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
		console.log("[%s], task %s recv data, %s.", Moment().format("YYYY-MM-DD HH:mm:ss"), task.id, JSON.stringify(data));
	});	
});

setInterval(function (){
	disp();
}, 60*1000);
