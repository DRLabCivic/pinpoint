define([
	'jquery',
	'underscore',
	'marionette',
	'text!templates/items/resultListItemTemplate.html'
], function($, _, Marionette, template){
	
	var ResultListItemView = Backbone.Marionette.ItemView.extend({
		
		template: _.template(template),
		
		className: 'result-item',
		
		serializeData: function() {
			var data = this.model.toJSON();
			data.filePath = this.model.getFilePath();
			data.task = this.model.getTask();
		    return data;
		},

	});
	// Our module now returns our view
	return ResultListItemView;
	
});