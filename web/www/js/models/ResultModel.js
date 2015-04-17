define([
        'underscore',
        'backbone',
        'values/constants'
], function(_, Backbone, Constants){

	var ResultModel = Backbone.Model.extend({
		
		defaults: {
			properties : {},
			idName: '',
			location: 'false'
		},
		
		toGeoJSON: function() {
			if (!this.has('location') || this.get('location') == 'false')
				return null;
			var self = this;
			var json = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [self.get('location').longitude, self.get('location').latitude ]
				},
				"properties": {
					"id": self.get('id'),
					"className": "marker color-"+self.get('task_id')+" "+self.get('id'),
					"type": "marker"
				}					
			};
			return json;
		},
		
		getFilePath: function() {
			if (!this.has('file') || this.get('file') == 'false')
				return null;
			
			return Constants['web_data_folder']+this.get('record_id')+"/"+this.get('file');
		},
		
		getTask: function() {
			return this.get('tasks')[this.get('task_id')];
		}
		
	});

	return ResultModel;

});