	var fs = require('fs-extra'),
		count = 0;

	fs.remove('tmp/', function (err) {
		if (err) {
			console.log('There was an error, please remove the tmp/ directory manually');
		}

		count++;
	});

	fs.remove('asyncTmp/', function (err) {
		if (err) {
			console.log('There was an error, please remove the asyncTmp/ directory manually');
		}

		count++;
	});

	fs.remove('./sass-variables.json', function (err) {
		if (err) {
			console.log('There was an error, please remove the ./sass-variables.json directory manually');
		}

		count++;
	});
