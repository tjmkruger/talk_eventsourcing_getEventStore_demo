var uuid 		= require('node-uuid'),
	moment		= require('moment'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var ItemsRemovedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'ItemsRemoved';
	this.data = data;
};

var ev = new ItemsRemovedEvent({
	itemType: 'Socks'
});

var cart = new Cart(1);
repository.save(cart, ev);

