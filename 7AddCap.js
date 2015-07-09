var uuid 		= require('node-uuid'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var ItemsAddedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'ItemsAdded';
	this.data = data;
};

var ev = new ItemsAddedEvent({
	itemType: 'Cap',
	qty: 1
});

var cart = new Cart(1);
repository.save(cart, ev);

