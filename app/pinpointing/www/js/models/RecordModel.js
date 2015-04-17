define([
        'jquery',
        'underscore',
        'backbone',
        'localstorage',
        'values/constants',
        'models/TaskCollection',
        'helpers/FileUploader'
], function($, _, Backbone, localstorage, Constants, TaskCollection, FileUploader){

	var RecordModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("records"),
		
		defaults: {
			explorer : 'unnamed',
			completed : false,
			submitted : false,
		},
		
		set: function(attributes, options) {
			//make sure that <tasks> is intialized as a TaskCollection
		    if (attributes.tasks !== undefined && !(attributes.tasks instanceof TaskCollection)) {
		        attributes.tasks = new TaskCollection(attributes.tasks);
		        attributes.tasks.on('change:completed', this.onChangeComplete, this);
		    }
		    
		    if (attributes.explorer !== undefined && attributes.explorer.length < 1)
		    	attributes.explorer = this.defaults.explorer;
		    
		    return Backbone.Model.prototype.set.call(this, attributes, options);
		},
		
		setup: function(exploration,name) {
			
			var date = new Date();
			
			recordData = {
				exploration_id : exploration.id,
				exploration_name: exploration.get('name'),
				briefing: exploration.get('briefing'),
				description: exploration.get('description'),
				tasks : exploration.get('tasks'),
				explorer: name,
				time: date.getTime()
				
			}
			this.set(recordData);
		},
		
		upload: function(options) {
			
			var self = this;
			
			// then upload files
			function uploadFiles(files) {
				FileUploader.uploadFiles(files,
					Constants['web_service_url']+"/records/upload/"+self.get('id'),
					{
						success: function() {
							options.success();
						},
						error: function(error) {
							options.error(error);
						},
						progress: function(progress) {
							options.progress(progress);
						}
					}
				);
			}
			
			console.log(self.createJSON());
			// first send data
			request = $.ajax({
				url:  Constants['web_service_url']+"/records/",
				type: "post",
				dataType: "json",
				data: {"record" : self.createJSON() },
				timeout: Constants['settings_web_timeout'],
				success: function(response) {
					console.log("data sent");
					console.log(response);
					//response contains an array with the files that still need to be uploaded to the server
					uploadFiles(response.files);
				},
			    error: function(error) {
			    	options.error("Could not connect to server.");
			    	console.log(error);
			    }
			});
		},
		
		createJSON: function() {
			
			var json = this.toJSON();
			
			json['tasks'] = this.get('tasks').createJSON();
			
			return json;
			
		},
		
		onChangeComplete: function() {
			var completed = this.get('tasks').checkComplete()
			this.set({ completed: completed });
			
			if (completed)
				this.trigger('completed');
		}
	});

	// Return the model for the module
	return RecordModel;

});