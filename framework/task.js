var EventEmitter = require('events').EventEmitter;
var moment = require('moment');

function Task(task_info){
	EventEmitter.call(this);
	var me = this;
	var isInit_ = false;
	var status_ = "stopped";	// "stopped" || "running"

	var job_;

	this.set = function (task_info){
		//
		// number, create auto-increacement
		//
		me.id = task_info.id;

		// adapter object
		me.adapter = task_info.adapter;

		// object
		me.params = task_info.params || {};

		// 
		// string enum 
		//		"no" - do NOT repeat
		//		"day" - repeat every day
		//		"week" - repeat every week
		// task_info.repeat - object
		/*
			{
				"type" : "no" || "day" || "week" || "month",

				// if type == no
				"no" : [{
					"start" : string, pattern like "hh:mm:ss",
					"end" : string, pattern like "hh:mm:ss"	
				}, ...],

				// if type == day
				"day" : [{
					"start" : string, pattern like "hh:mm:ss",
					"end" : string, pattern like "hh:mm:ss"
				}, ...],

				// if type == week
				"week" : {
					"Sun" : [{
						"start" : string, pattern like "hh:mm:ss",
						"end" : string, pattern like "hh:mm:ss"				
					}, ...],
					"Mon" : [{ ... }],
					"Tue" : [{ ... }],
					"Wed" : [{ ... }],
					"Thu" : [{ ... }],
					"Fri" : [{ ... }],
					"Sat" : [{ ... }]
				},

				// if type == month
				"month" : {
					"01" : [{
						"start" : string, pattern like "hh:mm:ss",
						"end" : string, pattern like "hh:mm:ss"	
					}, ...],
					"02" : [{ ... }],
					...
					"31" : [{ ... }]
				}
			}
		*/
		me.repeat = task_info.repeat || { "type":"no" };

		// number
		// 0 - once
		// range(0, 7*86400*1000) - milliseconds
		// >7*86400*1000 - invalid
		me.interval = task_info.interval || 0;

		// string, pattern like "YYYY-MM-DD"
		me.date = task_info.date || moment().format("YYYY-MM-DD");

		// object, "YYYY-MM-DD"
		// eg.
		/*	
			{
				"2016-10-01" : 1, 
				"2016-10-02,": 2, ...
			}
		*/
		me.exclude_dates = task_info.exclude_dates || {};

		// enabled
		me.enabled = Boolean(task_info.enabled);

		// send changed event
		if (isInit_)
			me.emit('changed');
		else
			isInit_ = true;
	}

	//
	// 把当前Task加入到采集job中
	//
	this.joinJob = function (job){
		if (job_){
			me.removeJob(job_);
		}

		job_ = job;
		job_.on('data', me.receivedData);

		// add to job
		job_.addTask(me);

		// set running status
		me.start();
	}

	//
	// 把当前Task从加入的job中移除
	// 
	this.removeJob = function (){
		if (job_){
			job_.removeListener("data", me.receivedData);
			job_.removeTask(me);
		}
		job_ = null;
	}

	//
	// Stop the task
	//
	this.stop = function (){
		// remove from the job
		me.removeJob();

		// set status to "stopped"
		status_ = "stopped";

		// send event "stop"
		me.emit('stop');
	}

	this.start = function (){
		// set status to "running"
		status_ = "running";

		// send event "run"
		me.emit('run');
	}

	this.status = function (){
		return status_;
	}

	this.receivedData = function (data){
		if (status_ == "running") me.emit('data', data);
	}

	// do init
	function init_(){
		me.set(task_info);
	}
	init_();

}
require('util').inherits(Task, EventEmitter);
module.exports = Task;


