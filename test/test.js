(function () {
	'use strict';
	var assert		=	require('assert'),
		fs			=	require('fs-extra'),
		app			=	require('../'),
		validJSON	=	require('./sass-variables.json'),
		options,
		actual,
		expected;

	describe('sass-color-swatch', function () {
		describe('failing: ', function () {
			it('fails when no file is sent', function () {
				actual = app();
				expected = false;

				assert.strictEqual(actual, expected);
			});

			it('fails when input file doesn\'t exist', function () {
				options = {
					input: 'test/foo'
				};

				actual = app(options);
				expected = false;

				assert.strictEqual(actual, expected);
			});

			it('fails when you pass a directory as the input', function () {
				options = {
					input: 'test/'
				};

				actual = app(options);
				expected = false;

				assert.strictEqual(actual, expected);
			});
		});

		describe('passing:', function () {
			it('returns json when there is no output', function () {
				options = {
					input: 'test/colors.scss'
				};

				actual = app(options);
				expected = validJSON;

				assert.deepEqual(actual, expected);
			});

			it('creates a file in your cwd if you don\'t pass a directory', function () {
				options = {
					input: 'test/colors.scss',
					output: 'sass-variables.json'
				};

				app(options);

				actual = fs.existsSync('sass-variables.json');
				expected = true;

				assert.strictEqual(actual, expected);
				fs.removeSync('sass-variables.json');
			});

			it('creates a valid json file from last test...', function () {
				options = {
					input: 'test/colors.scss',
					output: 'sass-variables.json'
				};

				app(options);

				actual = fs.readJsonSync('sass-variables.json');
				expected = validJSON;

				assert.deepEqual(actual, expected);
				fs.removeSync('sass-variables.json');
			});

			it ('creates a file in your specified path', function () {
				options = {
					input: 'test/colors.scss',
					output: 'tmp/'
				};

				app(options);

				actual = fs.existsSync('tmp/sass-variables.json');
				expected = true;

				assert.strictEqual(actual, expected);
			});

			it('creates a file with your specified file name', function () {
				options = {
					input: 'test/colors.scss',
					output: 'tmp/test.json'
				};

				app(options);

				actual = fs.existsSync(options.output);
				expected = true;

				assert.strictEqual(actual, expected);
			});
		});
	});

	describe('just cleaning house...', function () {
		it('removes the tmp folder', function (done) {
			fs.remove('tmp/', function () {
				done();
			});
		});
	});
})();
