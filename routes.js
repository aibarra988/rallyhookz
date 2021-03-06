'use strict';
const request = require('request-promise');
const router = require('express').Router();

const site = 'https://rally1.rallydev.com/slm/webservice/v2.0/Defects';
const authHeader = {
	'zsessionid': process.env.RALLY_API_KEY,
	'Accept': 'application/json',
	'content-type': 'application/json'
};

router.get('/', (req, res) => {
	res.send({
		message: "Hello there!"
	});
});

router.post('/listen', (req, res) => {
	// Process git event and find the Rally Defect Id in title of pull request
	const prTitle = req.body.pull_request.title;
	const idFilter = /DE[0-9]+/;	// regex to get rally defect number from pr title
	const reResult = idFilter.exec(prTitle);
	const rallyDefectId = reResult[0];

	console.log('idFilter: ', idFilter);
	console.log('reResult: ', reResult);
	console.log('rallyDefectId', rallyDefectId);

	if (req.body.action === "closed" && req.body.pull_request.merged) {
		// Find and update Rally ticket
		getRallyDefectById(rallyDefectId)
			.then(updateInRally)
			.then(response => {
				console.log("Response from Rally after update: ", response);
				res.send('Successfully updated ' + rallyDefectId + ' in Rally');
			})
			.catch(error => {
				console.log(error);
				res.send(err);
			})
	} else {
		res.send("PR action was not 'merged'");
	}

});

function getRallyDefectById(id) {
	console.log('rallyDefectId in its function: ', id);
	const queryString = '?query=(FormattedId = ' + id + ')&fetch=true';
	const getOptions = {
		url: site + queryString,
		headers: authHeader,
		json: true
	};
	
	return request.get(getOptions);
}

function updateInRally(rallyDefect) {
	console.log('rallyDefect in its function: ', rallyDefect.QueryResult);
	const defectUri = rallyDefect.QueryResult.Results[0]._ref;
	const payload = {
		"Defect": {
			'ScheduleState': 'Accepted'
		}
	}
	
	const postOptions = {
		uri: defectUri,
		body: payload,
		headers: authHeader,
		json: true,
	};
	console.log("rally defect object ", defectUri);
	return request.post(postOptions);
}

module.exports = router;