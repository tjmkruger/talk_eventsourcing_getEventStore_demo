var EventStoreClient = require('event-store-client');
var Connection = EventStoreClient.Connection;
var config = require('./config');

var connection = new Connection(config.connectionSettings);

connection.sendPing(function(pkg) {
    console.log('Received ' + EventStoreClient.Commands.getCommandName(pkg.command) + ' response!');
    connection.close();
});