var EventEmitter = require('events').EventEmitter;

function Job (adapter, interval){
	EventEmitter.call(this);
	var me = this;
	var tasks_ = [];

	var is_running_ = false;
	var timer_;

	this.adapter = adapter;
	this.interval = interval;
	this.max_tasks = adapter.config.max_tasks || 100;
	this.setMaxListeners(this.max_tasks * 3);

	this.taskCount = function (){
		return tasks_.length;
	}

	var cycle_ = function (){
		// crawl data
		adapter.crawl(tasks_, function (err, results){
			if (err){
				me.emit('error', err);
			}	
			else {
				tasks_.forEach(function (task, i){
					task.emit('data', results[i]);
				});
			}

			// only once
			if (!interval) me.close();
		});
	}

	this.addTask = function (task){
		return tasks_.push(task);
	}

	this.removeTask = function (task){
		for (var i=0; i<tasks_.length; i++){
			if (task.id == tasks_[i].id){
				tasks_.splice(i, 1);
				return;
			}
		}
	}

	this.run = function (){
		if (is_running_) return;

		is_running_ = true;
		if (!interval){ // run once
			cycle_();
		}
		else {
			timer_ = setInterval(cycle_, interval);
		}

		me.emit('run');
	}

	this.close = function (){
		if (!is_running_) return;
		if (timer_) {
			clearInterval(timer_);
		}

		is_running_ = false;
		me.emit('end');
	}

	this.isRunning = function (){
		return is_running_;
	}


}
require('util').inherits(Job, EventEmitter);
module.exports = Job;