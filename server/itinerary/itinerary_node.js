var pg = require('pg');

module.exports = function (app) {
	var express = require('express');
	var router = express.Router();

	//checking itinerary_node_content validity 
	//and check if entity is associated with this event
	router.all('/:itinerary_node_content', function (req, res, next) {
		var resp = {};
		var itinerary_node_content = req.params.itinerary_node_content;
		if (isNaN(itinerary_node_content)) {
			return next();
		}
		pg.connect(connectionString, function (err, client, done) {
			var query = "select inc.*, l.latitude, l.longitude, 		\
								itn.day, itn.ordering _number    		\
	                       from tb_itinerary_node_content inc   		\
	                  left join tb_location l 							\
	                         on l.location = inc.location 				\
	                       join tb_itinerary_node itn 		   			\
	                         on itn.itinerary_node = inc.itinerary_node \
	                       join tb_itinerary i 							\
	                         on i.itinerary = itn.itinerary 			\
	                       join tb_event e 								\
	                         on e.event = i.event 						\
	                      where inc.itinerary_node_content = $1    		\
	                        and $2 = any( fn_get_event_related_entity(e.event) )";

			client.query(query, [itinerary_node_content, req.entity], function (err, result) {
				done();
				if (result) {
					if (result.rows[0]) {
						req.itinerary_node_content = result.rows[0];
						return next();
					} else {
						resp.status = ERROR;
						resp.message = "Could not find itinerary node.";
						if (err) {
							console.log(err);
						}
						return res.status(400).json(resp);
					}
				} else {
					resp.status = ERROR;
					resp.message = "Error finding itinerary node.";
					if (err) {
						console.log(err);
					}
					return res.status(500).json(resp);
				}
			});
		});
	});

	router.get('/:itinerary_node_content', function (req, res, next) {
		var resp = {};
		var itinerary_node_content = req.params.itinerary_node_content;
		if (isNaN(itinerary_node_content)) {
			return next();
		}
		resp.status = OK;
		resp.node = req.itinerary_node_content;
		return res.json(resp);
	});

	router.put('/:itinerary_node_content', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var itinerary_node_content = req.params.itinerary_node_content;
		if (isNaN(itinerary_node_content)) {
			return next();
		}


		var latitude = msg.latitude;
		var longitude = msg.longitude;

		if( latitude === null || longitude === null ){
			return next();
		}

		if( latitude == req.itinerary_node_content.latitude 
			&& longitude == req.itinerary_node_content.longitude )
		{
			return next();
		}

		//TODO
		pg.connect(connectionString, function (err, client, done) {
			var query;
			//Update location
			if( latitude ){
				query = "";

			} else { //Create location
				query = "";
			}

			client.query(query, [itinerary_node_content, req.entity], function (err, result) {
				done();
				if (result) {
					if (result.rows[0]) {
						req.itinerary_node_content = result.rows[0];
						return next();
					} else {
						resp.status = ERROR;
						resp.message = "Could not find itinerary node.";
						if (err) {
							console.log(err);
						}
						return res.status(400).json(resp);
					}
				} else {
					resp.status = ERROR;
					resp.message = "Error finding itinerary node.";
					if (err) {
						console.log(err);
					}
					return res.status(500).json(resp);
				}
			});
		});

	});

	router.put('/:itinerary_node_content', function (req, res, next) {
		var resp = {};
		var msg = req.body;
		var itinerary_node_content = req.params.itinerary_node_content;
		if (isNaN(itinerary_node_content)) {
			return next();
		}

		var name = msg.name;
		var description = msg.description;
		var ext_place_json = msg.ext_place_json;
	});
	app.use('/api/itinerary/node_content/', router);
};