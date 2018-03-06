// Require packages
var express = require('express');
var path = require('path');
var Swagger2Postman = require("swagger2-postman-generator");
var newman=require("newman");

// Setup directory path
var postman_filePath=path.join(__dirname,"output","postman.json");
var postmanEnv_filePath=path.join(__dirname,"output","postman_env.json");
var swagger_filePath=path.join(__dirname,"data","swagger_sessionTracker.json")

// Convert Swagger.json to postman Json
function swaggerConverter(swaggerJson){
	console.log('Converting swagger to postman');
	var swagger2postman = Swagger2Postman.convertSwagger().fromFile(swaggerJson);
	return swagger2postman;
}

// Write Postman Files
function writePostmanJsonToFile(swagger2postman, postman_file){
	console.log('Writing postman json');
	swagger2postman.toPostmanCollectionFile(postman_file, { prettyPrint: true });
	console.log('Skipped writing to environment file');
//	swagger2postman.toPostmanEnvironmentFile(postmanEnv_filePath, { prettyPrint: true });
}

//Run postman and env_ json with newman 
function runNewman(postman_file, postmanEnv_file){
	newman.run({
	    collection: require(postman_file),
	    reporters: 'cli',
	    environment:require(postmanEnv_file),
	}, function (err) {
		if (err) { throw err; }
	    console.log('collection run complete!');
	});
}

function generateOptions(env_file){
	var options = getOptionsFromSomewhere(env_file);
	console.log(options,env_file);
}

function main(){
	var swagger2postmanObj=swaggerConverter(swagger_filePath);
	writePostmanJsonToFile(swagger2postmanObj , postman_filePath);
//	generateOptions(swagger2postmanObj,postmanEnv_filePath);
	runNewman(postman_filePath, postmanEnv_filePath);
}

main();

// This part is to be added later when we are ready to start a node server to support other usecases
//var app = express();
//app.get('/', function(req, res) {
//    res.send('Hello World!');
//});
//app.listen(9080, function() {
//    console.log('Boomerang listening on port 9080!');
//});
