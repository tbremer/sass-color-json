#**SASS-COLOR-JSON**
*Convert any SASS file with color variables to a json file.*

[![Travis CI](https://img.shields.io/travis/tbremer/sass-color-json.svg?style=flat-square)](https://travis-ci.org/tbremer/sass-color-json)
[![Version](https://img.shields.io/npm/v/sass-color-json.svg?style=flat-square)](https://www.npmjs.com/package/sass-color-json)
[![NPM Downloads](https://img.shields.io/npm/dm/sass-color-json.svg?style=flat-square)](https://www.npmjs.com/package/sass-color-json)
[![LICENSE](https://img.shields.io/npm/l/sass-color-json.svg?style=flat-square)](https://github.com/tbremer/sass-color-json/blob/master/LICENSE)

We currently support:  hex colors (3 or 6 character), rgb, hsl, rgba & hsla.

Module can be used as  CLI or within your node project.

As of version 0.2.0 We now have a Synchronous (0.1.0) and Asynchronous version. The CLI still relies on the synchronous version. No other options have changed. The script overall was made shorter and faster.

###Options (as json object {})
**input**

Required: `True`

Type: `String`

Default: `" "`


**output**

Required: `False`

Type: `String`

Default: `False`

When not supplied: `Returns JSON object`

**isString**
Require: `False`

Type: `Boolean`

Default: `False`


###Example
*SASS / SCSS*
```sass
//Example SASS -> JSON
$red-short: #d00;
$red-long:  #dd0000;
$red-rgb:   rgb(221, 0, 0);
$red-rgba:  rgba(221, 0, 0, .5);
$red-hsl:   hsl(0, 100, 47);
$red-hsla:  hsla(0, 100, 47, .5);
```
*Terminal:*
```bash
$ sass-color-json --input ~/_colors.scss --output ~/colors.json
```

*Node Module*
```javascript
/**
 * BLOCKING SYNC VERSION
**/
var sassColorJson = require('sass-color-json'),
  sassColorOptions = {
    input: '_colors.scss'
  },
  jsonObj = sassColorJson.sync(sassColorOptions);

console.log(jsonObj);

/**
 * NON-BLOCKING ASYNC VERSION
 * Async keeps all the same functionality as previous versions, but is non-blocking.
**/
sassColorJson.async(sassColorOptions, function (err, data) {
  if (err) {
    throw new Error('Error: ' + err);
  }

  console.log(data);
});

/**
 * Processing Strings
**/
var buffer = fs.readFile('_colors.scss', function (err, data) {
    if (err) {
        throw new Error('Error: ' + err);
    }

    var sassColorOptions = {
        input: data,
        isString: true
    };

    sassColorJson.async(sassColorOptions, function (err, data) {
      if (err) {
        throw new Error('Error: ' + err);
      }

      console.log(data);
    });
});
```

*Output:*
```json
{
  "red-short": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-short: #d00;",
    "original": {
      "name": "$red-short:",
      "value": "d00;",
      "full": "$red-short: #d00;"
    },
    "name": "red-short",
    "type": "#",
    "value": "d00"
  },
  "red-long": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-long: #dd0000;",
    "original": {
      "name": "$red-long:",
      "value": "dd0000;",
      "full": "$red-long:  #dd0000;"
    },
    "name": "red-long",
    "type": "#",
    "value": "dd0000"
  },
  "red-rgb": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-rgb: rgb(221, 0, 0);",
    "original": {
      "name": "$red-rgb:",
      "value": "(221, 0, 0);",
      "full": "$red-rgb:   rgb(221, 0, 0);"
    },
    "name": "red-rgb",
    "type": "rgb",
    "value": "(221, 0, 0)"
  },
  "red-rgba": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-rgba: rgba(221, 0, 0, .5);",
    "original": {
      "name": "$red-rgba:",
      "value": "(221, 0, 0, .5);",
      "full": "$red-rgba:  rgba(221, 0, 0, .5);"
    },
    "name": "red-rgba",
    "type": "rgba",
    "value": "(221, 0, 0, .5)"
  },
  "red-hsl": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-hsl: hsl(0, 100, 47);",
    "original": {
      "name": "$red-hsl:",
      "value": "(0, 100, 47);",
      "full": "$red-hsl:   hsl(0, 100, 47);"
    },
    "name": "red-hsl",
    "type": "hsl",
    "value": "(0, 100, 47)"
  },
  "red-hsla": {
    "aliases": false,
    "isAlias": false,
    "full": "$red-hsla: hsla(0, 100, 47, .5);",
    "original": {
      "name": "$red-hsla:",
      "value": "(0, 100, 47, .5);",
      "full": "$red-hsla:  hsla(0, 100, 47, .5);"
    },
    "name": "red-hsla",
    "type": "hsla",
    "value": "(0, 100, 47, .5)"
  }
}
```

###*CLI Shortcuts*
**input:** `-i, --file, -f`

**output:** `-o`


###*Notes*
If no output is suppled the module returns JSON Object.

If output is only a directory module assumes filename `sass-variables.json`
