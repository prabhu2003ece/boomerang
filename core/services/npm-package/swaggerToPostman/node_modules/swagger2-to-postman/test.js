var fs = require('fs'),
	sc = require('./convert.js');

var file  = fs.readFileSync('test/data/swagger-with-path.json', 'utf8');
var scr = new sc();
var jsonObj = JSON.parse(file);
var pc = scr.convert(jsonObj);

fs.writeFileSync("collection.json", JSON.stringify(pc,null, 2));