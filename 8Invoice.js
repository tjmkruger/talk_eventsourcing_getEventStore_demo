var uuid 		= require('node-uuid'),
	moment		= require('moment'),
	repository 	= require('./getEventStoreRepository'),
	Cart = require('./Cart');

var InvoicedEvent = function(data) {
	this.eventId = uuid.v1();
	this.eventType = 'Invoiced';
	this.data = data;
};

var ev = new InvoicedEvent({
	invoiceDate: moment().format(),
	credits: 1
});

var cart = new Cart(1);
repository.save(cart, ev);

