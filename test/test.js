var should		=	require('should'),
	fs			=	require('fs-extra'),
	app			=	require('../'),
	validJSON	=	require('./sass-variables.json'),
	options,
	actual,
	expected;


describe('sass-color-json', function () {
	describe('sync', function () {
		it('should return false with no input', function () {
			should.deepEqual(app.sync({}), false);
		});

		it('should return false when input is not a file', function () {
			should.deepEqual(app.sync({input: 'test/foo.scss'}), false);
		});

		it('should return false when input is a directory', function () {
			should.deepEqual(app.sync({input: 'test/'}), false);
		});

		it('should return an obj when no ouput is sent', function () {
			should.deepEqual(app.sync({input: 'test/colors.scss'}), validJSON);
		});

		it('should create file in CWD if no output directory is sent', function () {
			options = {
				input: 'test/colors.scss',
				output: 'cwdSync.json'
			};

			app.sync(options);

			should.exist(options.output);
			should.deepEqual(fs.readJsonSync(options.output), validJSON);
		});

		it('creates file in directory you send', function () {
			options = {
				input: 'test/colors.scss',
				output: 'tmp/sync/'
			};
			app.sync(options);

			should.exist('./tmp/sync/sass-variables.json');
			should.deepEqual(fs.readJsonSync('./tmp/sync/sass-variables.json'), validJSON);
		});

		it('creates file in directory of the name you send', function () {
			options = {
				input: 'test/colors.scss',
				output: 'tmp/sync/test.json'
			};
			app.sync(options);

			should.exist('./tmp/sync/test.json');
			should.deepEqual(fs.readJsonSync('./tmp/sync/test.json'), validJSON);
		});

		it('should allow strings to be passed instead of files', function () {
			var buffer = fs.readFileSync('test/colors.scss', 'utf8');
			options = {
				input: buffer,
				isString: true
			};

			actual = app.sync(options);
			expected = validJSON;

			should.deepEqual(actual, expected);
		});

		it('variables with flags should be allowed', function () {
			var scssDefault = '$test-defaults: #123 !default;';
			options = {
				input: scssDefault,
				isString: true
			};

			actual = app.sync(options);
			expected = {
				"test-defaults": {
					"aliases": false,
					"isAlias": false,
					"full": "$test-defaults: #123 !default;",
					"original": {
						"name": "test-defaults",
						"value": "123 ",
						"full": "$test-defaults: #123 !default;",
						"flag": "!default"
					},
					"name": "test-defaults",
					"type": "#",
					"value": "123",
					"flag": "!default"
				}
			};

			should.deepEqual(actual, expected);
		});
	});

	describe('async', function () {
		it('should return an error on no input', function () {
			app.async({}, function (err, data) {
				should.exist(err);
				should.strictEqual(err, 'No file was sent.');
				should.not.exist(data);
			});
		});

		it('should return err when input is not a file', function () {
			app.async({input: 'test/foo.scss'}, function (err, data) {
				should.exist(err);
				should.strictEqual(err, 'Could not open input file...');
				should.not.exist(data);
			});
		});

		it('should return false when input is a directory', function () {
			app.async({input: 'test/'}, function (err, data) {
				should.exist(err);
				should.strictEqual(err, 'Could not open input file...');
				should.not.exist(data);
			});
		});

		it('should return an obj when no ouput is sent', function () {
			app.async({input: 'test/colors.scss'}, function (err, data) {
				should.not.exist(err);
				should.deepEqual(data, validJSON);
			});
		});

		it('should create file in CWD if no output directory is sent', function (done) {
			options = {
				input: 'test/colors.scss',
				output: 'cwdAsync.json'
			};

			app.async(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				fs.readJson(data, function (err, data) {
					should.not.exist(err);
					should.deepEqual(data, validJSON);
					done();
				});
			});
		});

		it('creates file in directory you send', function (done) {
			options = {
				input: 'test/colors.scss',
				output: 'tmp/async/'
			};
			app.async(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				fs.readJson(data, function (err, data) {
					should.not.exist(err);
					should.deepEqual(data, validJSON);
					done();
				});
			});
		});

		it('creates file in directory you send', function (done) {
			options = {
				input: 'test/colors.scss',
				output: 'tmp/async/test.json'
			};
			app.async(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);

				fs.readJson(data, function (err, data) {
					should.not.exist(err);
					should.deepEqual(data, validJSON);
					done();
				});
			});
		});

		it('should allow strings to be passed instead of files', function (done) {
			var buffer = fs.readFileSync('test/colors.scss', 'utf8');
			options = {
				input: buffer,
				isString: true
			};

			actual = app.async(options, function (err, data) {
				should.not.exist(err);
				should.exist(data);


				should.deepEqual(data, validJSON);

				done();
			});
		});

		it('variables with flags should be allowed', function (done) {
			var scssDefault = '$test-defaults: #123 !global;';
			options = {
				input: scssDefault,
				isString: true
			};
			expected = {
				"test-defaults": {
					"aliases": false,
					"isAlias": false,
					"full": "$test-defaults: #123 !global;",
					"original": {
						"name": "test-defaults",
						"value": "123 ",
						"full": "$test-defaults: #123 !global;",
						"flag": "!global"
					},
					"name": "test-defaults",
					"type": "#",
					"value": "123",
					"flag": "!global"
				}
			};

			actual = app.async(options, function(err, data) {
				should.not.exist(err);
				should.exist(data);


				should.deepEqual(data, expected);

				done();
			});
		});
	});

	after('Just tidying up...', function () {
		fs.removeSync('tmp/');
		fs.removeSync('./cwdSync.json');
		fs.removeSync('./cwdAsync.json');
	});
});
