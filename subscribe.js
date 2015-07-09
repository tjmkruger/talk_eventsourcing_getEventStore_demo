var ESClient = require('event-store-client'),
	Connection = ESClient.Connection,
	connectionSettings = { host: '127.0.0.1', port: 1113, debug: false},
	credentials = {username: 'admin', password: 'changeit'},
	streamId = 'Cart-1',
	resolveLinkTos = false,
	Cart = require('./Cart'),
	repo = require('./getEventStoreRepository');

var connection = new Connection(connectionSettings);
var correlationId = connection.subscribeToStream(
	streamId, 
	resolveLinkTos, 
	onEventAppeared,
	onSubscriptionConfirmed,
	onSubscriptionDropped,
	credentials);

console.log(correlationId);

var thisCart;
repo.getById(Cart, '1', function(cart) {
	console.log('');
	console.log('========================================');
    console.log('       Cart Projected (Catcup)          ');
    console.log('========================================');
	console.log(cart);
	thisCart = cart;
})

function onEventAppeared(streamEvent){	
    thisCart.handle([streamEvent]);

    console.log('');
    console.log('========================================');
    console.log('               Event                    ')
    console.log('========================================');
	console.log(streamEvent);    
    console.log('========================================');
    console.log('       Cart Projection (State)          ');
    console.log('========================================');
    console.log(thisCart);
	console.log('');
}

function onSubscriptionConfirmed(confirmation) {
    console.log("Subscription confirmed (last commit " + confirmation.lastCommitPosition + ", last event " + confirmation.lastEventNumber + ")");
}

function onSubscriptionDropped(dropped) {
    var reason = dropped.reason;
    switch (dropped.reason) {
        case 0:
            reason = "unsubscribed";
            break;
        case 1:
            reason = "access denied";
            break;
    }
    console.log("Subscription dropped (" + reason + ")");
}