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

var buildSassFile = function (obj) {
};

var globalRegPattern = /(\$[a-z0-9-_]+:)(\s+)(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|);)/ig,
	singleRegPattern = /(\$[a-z0-9-_]+:)(\s+)(#|\$|rgba|hsla|rgb|hsl)((?:\(|)[$0-9a-z-_,\.\s]+(?:\)|);)/i;


module.exports = function () {
	var args = [].slice.call(arguments)[0] || {},
		input = args.input || false,
		output = args.output || false,
		shouldReturn = (output === false) ? true : false;

	if (input === false || input === '' || fs.existsSync(input) === false || fs.statSync(input).isDirectory()) {
		return false;
	}

	if (output !== false) {
		if (path.extname(output) === '') {
			fs.ensureDirSync(output);
		} else {
			fs.ensureFileSync(output);
		}

		if (fs.statSync(output).isDirectory() === true) {
			output = path.normalize(output + '/sass-variables.json');
		}
	}

	var buffer = createArray(fs.readFileSync(input, "utf8")),
		obj = createObj(buffer);

	if (shouldReturn === true) {
		return obj;
	}

	fs.writeJsonSync(output, obj);
};
