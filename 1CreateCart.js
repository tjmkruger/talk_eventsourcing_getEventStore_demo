var uuid 		= require('node-uuid'),
	moment 		= require('moment'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var CartCreatedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'CartCreated';
	this.data = data;
};

var cartCreatedEvent = new CartCreatedEvent({
	cartId: cart = uuid.v1(), 
	created: moment().format(),
	shippingAddress: 'Sandton'
});

var cart = new Cart(1);
repository.save(cart, cartCreatedEvent);