var pg = require('pg');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	//checking itinerary validity 
	//and check if entity is associated with this event
	router.all('/:itinerary', function (req, res, next) {
		var resp = {};
		var itinerary = req.params.itinerary;
		var cookies = req.cookies;
		if (isNaN(itinerary)) {
			return next();
		}
		pg.connect(connectionString, function (err, client, done) {
			var query = "select i.*             	\
	                       from tb_itinerary i    	\
	                       join tb_event e 			\
	                         on e.event = i.event, 	\
	                            tb_session s   		\
	                      where i.itinerary = $1    \
	                        and s.session_id_hash = $2  \
	                        and s.entity = any( fn_get_event_related_entity(e.event) )";

			client.query(query, [itinerary, cookies['AuthToken']], function (err, result) {
				done();
				if (result) {
					if (result.rows[0]) {
						req.itinerary = result.rows[0];
						return next();
					} else {
						resp.status = ERROR;
						resp.message = "Could not find itinerary.";
						if (err) {
							console.log(err);
						}
						return res.status(400).json(resp);
					}
				} else {
					resp.status = ERROR;
					resp.message = "Error finding itinerary.";
					if (err) {
						console.log(err);
					}
					return res.status(500).json(resp);
				}
			});
		});
	});


	//Creating new itinerary node 
	router.post('/:itinerary', function (req, res, next) {
		var resp = {};
		var itinerary = req.params.itinerary;
		var msg = req.body;

		if (!req.itinerary || !msg) {
			return next();
		}

		if (!msg.name || !msg.description || !msg.day || !msg.ordering_number) {
			resp.status = ERROR;
			resp.message = "Missing required fields.";
			return res.status(400).json(resp);
		}

		if (isNaN(msg.day) || isNaN(msg.ordering_number)) {
			resp.status = ERROR;
			resp.message = "Day/ordering_number is not a number.";
			return res.status(400).json(resp);
		}

		var day = msg.day;
		var ordering_number = msg.ordering_number;
		var create_new_itinerary_node = function () {
			pg.connect(connectionString, function (err, client, done) {
				var query = "insert into tb_itinerary_node ( \
																itinerary, 		\
																day, 	   		\
																ordering_number	\
															)					\
								 					 values ( $1, $2, $3 )		\
								 				  returning itinerary_node";

				client.query(query, [itinerary, day, ordering_number], function (err, result) {
					done();
					if (result && result.rows[0]) {
						req.itinerary_node = result.rows[0].itinerary_node;
						return next();
					} else {
						resp.status = ERROR;
						resp.message = "Error when creating itinerary node.";
						if (err) {
							console.log(err);
						}
						return res.status(500).json(resp);
					}
				});
			});
		};

		pg.connect(connectionString, function (err, client, done) {
			var query = "select itinerary_node 		\
						   from tb_itinerary_node 	\
						  where itinerary = $1 		\
							and day = $2 	   		\
							and ordering_number	= $3";
			client.query(query, [itinerary, day, ordering_number], function (err, result) {
				done();
				if (result) {
					if (result.rows[0]) {
						req.itinerary_node = result.rows[0].itinerary_node;
						return next();
					} else {
						return create_new_itinerary_node();
					}
				} else {
					resp.status = ERROR;
					resp.message = "Error creating itinerary node.";
					if (err) {
						console.log(err);
					}
					return res.status(500).json(resp);
				}
			});
		});
	});

	//Create itinerary node content
	router.post('/:itinerary', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var cookies = req.cookies;

		//itinerary_node pk is aquired previously.
		if (!req.itinerary_node || !msg) {
			return next();
		}
		var name = msg.name;
		var description = msg.description;
		var ext_place_json = msg.ext_place_json;
		var latitude = msg.latitude;
		var longitude = msg.longitude;

		var create_new_content = function (location) {
			pg.connect(connectionString, function (err, client, done) {
				var query = "insert into tb_itinerary_node_content  \
						(											\
						 	itinerary_node,							\
						 	name,									\
						 	description,							\
						 	ext_place_json,							\
						 	location, 								\
						 	creator,								\
						 	modifier								\
						) (select $1, 								\
								  $2,								\
								  $3,								\
								  $4,								\
								  $5,								\
								  entity, 							\
								  entity 							\
							 from tb_session						\
							where session_id_hash = $6 ) returning itinerary_node_content";
				pg.connect(connectionString, function (err, client, done) {
					client.query(query, [req.itinerary_node,
						name,
						description,
						ext_place_json,
						location,
						cookies['AuthToken']
					], function (err, result) {
						done();
						if (result && result.rows[0]) {
							resp.status = OK;
							resp.message = 'Itinerary node created';
							return res.json(resp);
						} else {
							resp.status = ERROR;
							resp.message = "Error creating itinerary node.";
							if (err) {
								console.log(err);
							}
							return res.status(500).json(resp);
						}
					});
				});
			});
		};

		if (latitude && longitude) {
			var query = "select fn_new_location($1) as location";
			pg.connect(connectionString, function (err, client, done) {
				client.query(query, [JSON.stringify({
					"latitude": latitude,
					"longitude": longitude
				})], function (err, result) {
					done();
					if (result && result.rows[0]) {
						return create_new_content(result.rows[0].location)
					} else {
						resp.status = ERROR;
						resp.message = "Error creating itinerary node.";
						if (err) {
							console.log(err);
						}
						return res.status(500).json(resp);
					}
				});
			});
		} else {
			create_new_content(null);
		}

	});

	app.use('/api/itinerary', router);
};