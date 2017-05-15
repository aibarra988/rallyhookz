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

	console.log('Pull Request Event: ', req.body);

	if (req.body.action === "closed" && req.body.merged) {
		// Find and update Rally ticket
		getRallyDefectById(rallyDefectId)
			.then(updateInRally)
			.then(response => console.log("I am in updateInRally ", response))
			.catch(error => console.log(error))
			.then((err, success) => {
				if (err) res.send(err);
				res.send('Successfully updated ' + rallyDefectId + ' in Rally');
			}); 	
	} else {
		res.send("PR action was not 'merged'");
	}

});

function getRallyDefectById(rallyDefectId) {
	const queryString = '?query=(FormattedId = ' + rallyDefectId + ')&fetch=true';
	const getOptions = {
		url: site,
		headers: authHeader,
		json: true
	};
	
	return request.get(getOptions);
}

function updateInRally(rallyDefect) {
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