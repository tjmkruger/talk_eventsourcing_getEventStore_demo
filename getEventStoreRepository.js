
var config 		= require('./config')
	request 	= require('request'),
	client 		= require('event-store-client'),
	_			= require('underscore'),
	Connection 	= client.Connection,
	results 	= client.OperationResult;

var repository = {
	getById: function(aggType, id, cb) {
		var aggregate = new aggType(id);
		loadFromStream(aggregate, aggregate.stream(), function() {
			cb(aggregate);
		});
	},
	
	save: function(aggregate, events, cb) {
		cb = cb || function() {};
		if (!Array.isArray(events)) { events = [events]; };

		var connection = new Connection(config.connectionSettings);
		connection.writeEvents(
			aggregate.stream(), 
			client.ExpectedVersion.Any, 
			true, 
			events,
			config.credentials,
			function(result){
				console.log(results.getName(result));
				connection.close();
				cb();
			});
	}
}

module.exports = repository;

var parseUrl = function(url, options) {
	url = url.replace('host', config.connectionSettings.host);
	url = url.replace('port', config.connectionSettings.httpPort);
	_.each(options, function(value, key) {
		url = url.replace(key, value);
	});
	return url;
};

var get = function(url, callback) {
	var opts = {
		url: url,
		method: 'GET',
		auth: { 
			user: config.credentials.username, 
			password: config.credentials.password
		},
		headers: {
			'Accept': 'application/vnd.eventstore.atom+json'
		}
	};

	request(opts, function(err, res, body) {
		if (err) throw err;
		if (res.statusCode >= 400) throw new Error(res.statusCode + ': ' + url);

		var result = { events: [] };
		var json = JSON.parse(body).entries;
		_.each(json, function(entry) {
			result.events.splice(0, 0, {
				eventId: entry.eventId,
				eventType: entry.eventType,
				eventNumber: entry.eventNumber,
				data: JSON.parse(entry.data)
			});
		});
		callback(result.events);
	})
}

readEventsBackward = function(options, callback) {
	var opts = options;
	var url = 'http://host:port/streams/streamname/start/backward/cnt?embed=body';
	url = parseUrl(url, { 
		streamname: opts.stream,
		start: opts.start,
		cnt: opts.cnt
	});

	get(url, callback);

};

readAllEventsForward = function(options, callback) {
	var opts = options;
	opts.start = opts.start || 0;

	var findLastEventCountOptions = {
		stream: opts.stream,
		start: 'head', cnt: 1
	};

	readEventsBackward(findLastEventCountOptions, function(events) {
			if (events == undefined || events.length == 0)
				throw new Error('Reading last event: Event not found on stream %streamName%.'.replace('%streamName%', opts.stream));
			var lastEventPos = events[0].eventNumber + 1;

			var url = 'http://host:port/streams/streamname/start/forward/cnt?embed=body';
			url = parseUrl(url, { 
				streamname: opts.stream,
				start: opts.start,
				cnt: lastEventPos - opts.start
			});
			get(url, callback)
		});
};	

// createStream = function(options, callback) {
// 	var connection = new EventStoreClient.Connection(config.esOptions.options);
// 	connection.writeEvents(options.stream, EventStoreClient.ExpectedVersion.NoStream, true, options.events, config.esOptions.credentials, function(completed) {
// 	 	connection.close();
// 	 	if (completed.result != 0) throw new Error(EventStoreClient.ReadStreamResult.getName(completed.result));
	 	
// 	 	callback();
// 	});
// };

var loadFromStream = function(aggregate, streamName, callback) {
	var readOptions = { stream: streamName };
	readOptions.start = readOptions.start || aggregate.version || 0;

	readAllEventsForward(readOptions, 
		function(events) {

			aggregate.handle(events);
			callback();
	});
};