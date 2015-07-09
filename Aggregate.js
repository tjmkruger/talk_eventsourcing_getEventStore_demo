
var _ 		= require('underscore');

var Aggregate = function(when) {
	var eventhandlers = when;

	this.handle = function(events){
		var self = this;
		_.each(events, function(ev) {
			if (eventhandlers[ev.eventType] != undefined) {
				eventhandlers[ev.eventType].call(self, ev);
				self._version = ev.eventNumber;
			}
		});
	};

	this.stream = function() {
		if (this.category) {
			return this.category + '-' + this.id;
		} else {
			return this.id;
		}
	};

}

module.exports = Aggregate;