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

  var PingButton = React.createClass({
  	render: function() {
  		if (!this.props.task.pinged) {
    		return (
    			<button onClick={this.props.handlePing}>Ping</button>
    		)    			
  		} else {
	    		return (
    			<span>Pinged</span>
    		)
  		}
  	}
  });

  var AssignTaskRow = React.createClass({
  	handleAssign: function() {
  		// handle assignment
  	},

  	render: function() {
  		return (
  			<tr><
  				td>Assign</td>
  				<td><input type="text" /></td>
  			</tr>
  		)
  	}
  })

  var PingTaskRow = React.createClass({
		handlePing: function(event) {
			this.props.task.ping();
		},

		render: function() {
			var task = this.props.task;
			return (
				<tr>
					<td>{task.get("score")}</td>
					<td>{task.get("title")}</td>
					<td>{task.get("assignee")}</td>
					<td><PingButton task={task} handlePing={this.handlePing} /></td>
				</tr>
			)
		}
  });

  var PingTopBox = pingApp.PingTopBox = React.createClass({
  	mixins: [CollectionMixin],

		getCollections: function () {
			return [this.props.tasks];
		},

		render: function() {
			// var tasks = this.data.tasks;				
			return (
				<table>
					<AssignTaskRow />
					{
						this.props.tasks.map(function(task) {
							return <PingTaskRow key={task.id} task={task} />
						})
					}
				</table>
			)
		}
	});


})();
