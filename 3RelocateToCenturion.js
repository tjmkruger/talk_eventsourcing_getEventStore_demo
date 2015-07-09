var uuid 		= require('node-uuid'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var RelocatedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'Relocated';
	this.data = data;
};

var ev = new RelocatedEvent({
	shippingAddress: 'Centurion'
});

var cart = new Cart(1);
repository.save(cart, ev);

