var uuid 		= require('node-uuid'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var ItemsAddedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'ItemsAdded';
	this.data = data;
};

var ev = new ItemsAddedEvent({
	itemType: 'Socks',
	qty: 2 
});

repository.getById(Cart, '1', function(cart) {
	repository.save(cart, ev);
});

