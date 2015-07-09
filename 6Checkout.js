var uuid 		= require('node-uuid'),
	moment		= require('moment'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var CheckoutEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'Checkout';
	this.data = data;
};

var ev = new CheckoutEvent({
	checkoutDate: moment().format()
});

var cart = new Cart(1);
repository.save(cart, ev);

