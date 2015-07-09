var Aggregate 	= require('./Aggregate');
var _			= require('underscore');

var when = {};
var Cart = function(id) {
	this.id = id;
	this.category = 'Cart';
	this.items = [];
	this.itemCount = 0;
};
Cart.prototype = new Aggregate(when);

module.exports = Cart;

when.CartCreated = function(ev) {
	this.createdDate = ev.data.created;
	this.address = ev.data.shippingAddress;
	this.credits = 3;
};

when.ItemsAdded = function(ev) {
	this.items.push(ev.data);
	this.itemCount += ev.data.qty
};

when.Relocated = function(ev) {
	this.address = ev.data.shippingAddress;	
};

when.ItemsRemoved = function(ev) {
	var predicate = function(item) {
		return item.itemType == ev.data.itemType;
	};
	var toRemove = _.find(this.items, predicate);

	this.itemCount -= toRemove.qty;
	this.items = _.reject(this.items, predicate);
};

when.Checkout = function(ev) {
	this.lastCheckout = ev.data.checkoutDate;
	this.credits -= this.itemCount;
	this.itemCount = 0;
	// this.items = [];
};

when.Invoiced = function(ev) {
	this.lastInvoice = ev.data.invoiceDate;
	this.credits += ev.data.credits;
};