'use strict';
var path = require('path'),
		fs = require('fs-extra'),
		_ = require('underscore'),
		strip = require('strip-comments');

var createObj = function (array) {
	if (_.isArray(array) === false || array === undefined) {
		return false;
	}

	var obj = {};

	_.each(array, function (el, i) {
		var tmp = el.match(singleRegPattern),
		name = tmp[1] || false,
		type = tmp[3] || false,
		value = tmp[4] || false,
		original = tmp.input || false,
		originalName, originalValue, full;

		if (name === false) {
			return false;
		}

		if (name !== false) {
			originalName = name;
			name = name.substring(1, (name.length-1));
		}

		if (value !== false) {
			originalValue = value;
			value = value.substring(0,(value.length-1));
		}

		if (value in obj) {
			if (obj[value].aliases === false) {
				obj[value].aliases = [];
			}
			obj[value].aliases.push(name);
		}

		obj[name] = {
			'aliases': false,
			'isAlias': ((value in obj) ? true : false),
			'full': (originalName + ' ' + type + originalValue),
			'original': {
				'name': originalName,
				'value': originalValue,
				'full': original
			},
			'name': name,
			'type': type,
			'value': value,
		};
	});

	return obj;

};

var createArray = function (str) {
	if (str === undefined) {
		return false;
	}

	var array = [];
	str = strip(str);
	array = str.match(globalRegPattern);

	return array;
};

var checkOutput = function (output) {
	return (path.extname(output) === '') ? path.normalize(output + '/sass-variables.json') : output;
};

var globalRegPattern = /(\$[a-z0-9-_]+:)(\s+)(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|);)/ig,
singleRegPattern = /(\$[a-z0-9-_]+:)(\s+)(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|);)/i;

module.exports = {
	async: function (options, callback) {
		var input = options.input || false,
				output = options.output || false;

		if (typeof callback !== 'function') {
			return false;
		}

		if (input === false || input === '') {
			return callback('No file was sent.');
		}

		fs.readFile(input, 'utf8', function (err, data) {
			if (err) {
				return callback('Could not open input file...');
			}

			var array = createArray(data),
					obj = createObj(array);

			if (output === false) {
				return callback(null, obj);
			}

			output = checkOutput(output);
			fs.outputJson(output, obj, function (err) {
				if (err) {
					return callback('Could not write file...');
				}

				return callback(null, output);
			});

		});
	},

	sync: function (options) {
		var input = options.input || false,
				output = options.output || false;

		if (input === false || input === '' || fs.existsSync(input) === false || fs.statSync(input).isDirectory()) {
			return false;
		}

		var buffer = createArray(fs.readFileSync(input, "utf8")),
				obj = createObj(buffer);

		if (output === false) {
			return obj;
		}

		output = checkOutput(output);
		fs.outputJsonSync(output, obj);
	}
};
