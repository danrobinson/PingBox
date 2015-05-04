(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// set up global Parse app
var pingApp = pingApp || {};

// set up Parse
Parse.initialize("8fhsO5d7WTt6c7ffpVrPpHTVvuAi6vArrciyt8cK", "1GHMsEbKTKr7ZhLqcJUPcOJdi7CLD1YZeT4hGuEv");

(function() {
	"use strict";

	// Collections

	var currentUser = Parse.User.current();

 	var PingClass = Parse.Object.extend("Ping", {});
  
 	var midnight = new Date()
 	midnight.setHours(0,0,0,0)

  var PingCollection = Parse.Collection.extend({
		model: PingClass,
 		query: new Parse.Query("Ping")
 			.equalTo("creator", currentUser)
 			.greaterThan("createdAt", midnight),
	});

	var pings = pingApp.pings = new PingCollection;
	pings.fetch().then(function(results) {console.log(results);})

 	var TaskClass = Parse.Object.extend("Task", {
 		ping: function() {
 			// this.ping();
 			this.pinged = true;
 			this.increment("score");
 			var thisTask = this;
 			Parse.Cloud.run('ping', {taskID: this.id}, {
 				success: function(result) {
 					// update object
 					pings.add(result.ping);
 					thisTask.set(result.task.attributes);
 				},
 				error: function(result) {
					// reverse changes
					this.set(result.task.attributes);
 				}
 			});
 		}
 	});

  var TaskCollection = Parse.Collection.extend({
		model: TaskClass,
 		query: new Parse.Query("Task")
	});

	var tasks = pingApp.tasks = new TaskCollection;
	tasks.on('add remove change sync', function(collection) {console.log("Task Event: ", collection)})
	tasks.fetch();

	// Components

	var CollectionMixin = {
		componentDidMount: function () {
			// Whenever there may be a change in the data, trigger a
			// reconcile.
			this.getCollections().forEach(function (collection) {
				collection.on('add remove change sync', this.forceUpdate.bind(this, null));
			}, this);
		},

		componentWillUnmount: function () {
			this.getCollections().forEach(function (collection) {
				collection.off(null, null, this);
			}, this);
		}
	};

  var PingButton = React.createClass({displayName: "PingButton",
  	render: function() {
  		if (!this.props.task.pinged) {
    		return (
    			React.createElement("button", {onClick: this.props.handlePing}, "Ping")
    		)    			
  		} else {
	    		return (
    			React.createElement("span", null, "Pinged")
    		)
  		}
  	}
  });

  var AssignTaskRow = React.createClass({displayName: "AssignTaskRow",
  	handleAssign: function() {
  		// handle assignment
  	},

  	render: function() {
  		return (
  			React.createElement("tr", null, React.createElement("td", null, "Assign"), 
  				React.createElement("td", null, React.createElement("input", {type: "text"}))
  			)
  		)
  	}
  })

  var PingTaskRow = React.createClass({displayName: "PingTaskRow",
		handlePing: function(event) {
			this.props.task.ping();
		},

		render: function() {
			var task = this.props.task;
			return (
				React.createElement("tr", null, 
					React.createElement("td", null, task.get("score")), 
					React.createElement("td", null, task.get("title")), 
					React.createElement("td", null, task.get("assignee")), 
					React.createElement("td", null, React.createElement(PingButton, {task: task, handlePing: this.handlePing}))
				)
			)
		}
  });

  var PingTopBox = pingApp.PingTopBox = React.createClass({displayName: "PingTopBox",
  	mixins: [CollectionMixin],

		getCollections: function () {
			return [this.props.tasks];
		},

		render: function() {
			// var tasks = this.data.tasks;				
			return (
				React.createElement("table", null, 
					React.createElement(AssignTaskRow, null), 
					
						this.props.tasks.map(function(task) {
							return React.createElement(PingTaskRow, {key: task.id, task: task})
						})
					
				)
			)
		}
	});


})();


},{}]},{},[1]);
