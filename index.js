var path = require('path'),
		fs = require('fs-extra'),
		_ = require('underscore'),
		strip = require('strip-comments'),
		globalRegPattern, singleRegPattern;

var createObj = function (array) {
	if (_.isArray(array) === false || array === undefined) {
		return false;
	}

	var obj = {};

	_.each(array, function (el, i) {
		var tmp = el.match(singleRegPattern),
		name = tmp[1] || false,
		type = tmp[2] || false,
		value = tmp[3] || false,
		original = tmp.input || false,
		originalName, originalValue, full;

		if (name === false) {
			return false;
		}

		originalName = name;
		name = name.trim();

		if (value !== false) {
			originalValue = value;
			value = value.trim();
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
			'full': ('$' + name + ': ' + type + value + ';'),
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

var prepareOutput = function (data, output, callback) {
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
};

globalRegPattern = /\$([a-z0-9-_]+):\s*(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|))\s*(\!default|\!global)?;/ig;
singleRegPattern = /\$([a-z0-9-_]+):\s*(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|))\s*(\!default|\!global)?;/i;

module.exports = {
	async: function (options, callback) {
		var input = options.input || false,
			output = options.output || false,
			isString = options.isString || false;

		if (typeof callback !== 'function') {
			return false;
		}

		if (input === false || input === '') {
			return callback('No file was sent.');
		}

		if (isString === true) {
			return prepareOutput(input, output, callback);
		}

		fs.readFile(input, 'utf8', function (err, data) {
			if (err) {
				return callback('Could not open input file...');
			}

			return prepareOutput(data, output, callback);
		});
	},

	sync: function (options) {
		var input = options.input || false,
			isString = options.isString || false,
			output = options.output || false,
			buffer, obj;

		if (isString === false && (input === false || input === '' || fs.existsSync(input) === false || fs.statSync(input).isDirectory())) {

			return false;
		}

		buffer = createArray(isString === true ? input : fs.readFileSync(input, "utf8"));
		obj = createObj(buffer);

		if (output === false) {
			return obj;
		}

		output = checkOutput(output);
		fs.outputJsonSync(output, obj);
	}
};
