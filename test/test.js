(function () {
	'use strict';
	var assert		=	require('assert'),
		fs			=	require('fs-extra'),
		app			=	require('../'),
		validJSON	=	require('./sass-variables.json'),
		options,
		actual,
		expected;

	describe('sass-color-json', function () {
		describe('sync', function () {
			describe('failing: ', function () {
				it('fails when no file is sent', function () {
					actual = app.sync({});
					expected = false;

					assert.strictEqual(actual, expected);
				});

				it('fails when input file doesn\'t exist', function () {
					options = {
						input: 'test/foo'
					};

					actual = app.sync(options);
					expected = false;

					assert.strictEqual(actual, expected);

				});

				it('fails when you pass a directory as the input', function () {
					options = {
						input: 'test/'
					};

					actual = app.sync(options);
					expected = false;

					assert.strictEqual(actual, expected);
				});
			});

			describe('passing:', function () {
				it('returns json when there is no output', function () {
					options = {
						input: 'test/colors.scss'
					};

					actual = app.sync(options);
					expected = validJSON;

					assert.deepEqual(actual, expected);
				});

				it('creates a file in your cwd if you don\'t pass a directory', function () {
					options = {
						input: 'test/colors.scss',
						output: 'sass-variables.json'
					};

					app.sync(options);

					actual = fs.existsSync('sass-variables.json');
					expected = true;

					assert.strictEqual(actual, expected);
				});

				it('creates a valid json file from last test...', function () {
					options = {
						input: 'test/colors.scss',
						output: 'sass-variables.json'
					};

					app.sync(options);

					actual = fs.readJsonSync('sass-variables.json');
					expected = validJSON;

					assert.deepEqual(actual, expected);
				});

				it ('creates a file in your specified path', function () {
					options = {
						input: 'test/colors.scss',
						output: 'tmp/'
					};

					app.sync(options);

					actual = fs.existsSync('tmp/sass-variables.json');
					expected = true;

					assert.strictEqual(actual, expected);
				});

				it('creates a file with your specified file name', function () {
					options = {
						input: 'test/colors.scss',
						output: 'tmp/test.json'
					};

					app.sync(options);

					actual = fs.existsSync(options.output);
					expected = true;

					assert.strictEqual(actual, expected);
				});
			});
		});

		describe('async', function () {
			describe('failing', function () {
				it('returns false if no callback is passed', function () {
					actual = app.async({});
					expected = false;

					assert.strictEqual(actual, expected);
				});

				it('throws an error when no file is passed', function () {
					app.async({}, function (err, data) {
						expected = true;

						if (err) {
							actual = true;
						} else {
							actual = false;
						}

						assert.strictEqual(actual, expected);
					});
				});

				it('throws an error when the file doesn\'t exist', function () {
					options = {
						input: 'test/foo.scss'
					};

					app.async(options, function (err, data) {
						expected = true;

						if (err) {
							actual = true;
						} else {
							actual = false;
						}

						assert.deepEqual(actual, expected);
					});
				});

				it('throws an error if the input file is actually a directory', function () {
					app.async({input: 'test/'}, function (err, data) {
						expected = true;
						actual = (err) ? true : false;

						assert.strictEqual(actual, expected);
					});
				});
			});

			describe('passing', function () {
				it('returns a JSON object when no output is passed', function () {
					app.async({input: 'test/colors.scss'}, function (err, data) {
						actual = validJSON;
						expected = data;

						assert.deepEqual(actual, expected);
					});
				});

				it('creates a file in your cwd if you don\'t pass a directory', function () {
					options = {
						input: 'test/colors.scss',
						output: 'sass-variables.json'
					};

					app.async(options, function (err, data) {
						fs.exists(options.output, function (exists) {
							actual = exists;
							expected = true;

							assert.strictEqual(actual, expected);
						});
					});
				});

				it('creates a valid json file from last test...', function () {
					options = {
						input: 'test/colors.scss',
						output: 'sass-variables.json'
					};

					app.async(options, function (err, data) {
						fs.readJson('sass-variables.json', function (err, data) {
							actual = data;
							expected = validJSON;

							assert.deepEqual(actual, expected);
						});
					});
				});

				it ('creates a file in your specified path', function () {
					options = {
						input: 'test/colors.scss',
						output: 'asyncTmp/'
					};

					app.async(options, function (err, data) {
						fs.stat(options.output, function (err, stats) {

							actual = stats.isFile(options.output + 'sass-variables.json');
							expected = true;

							assert.strictEqual(actual, expected);
						});
					});
				});

				it('creates a file with your specified path & file name', function () {
					options = {
						input: 'test/colors.scss',
						output: 'asyncTmp/test.json'
					};

					app.async(options, function (err, data) {
						if (err) {
							console.log(err);
						}

						console.log('file... ' + data);

						fs.stat(options.output, function (err, stats) {

							actual = stats.isFile(options.output);
							expected = true;

							assert.strictEqual(actual, expected);
						});
					});
				});
			});
		});
	});

})();
