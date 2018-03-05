var fs = require('fs'),
    path = require('path');

var npmPackageDir=path.join(__dirname,'..','..','npm-package','/');
var swagger2PostmanDir = path.join(npmPackageDir,'swaggerToPostman','node_modules','swagger2-to-postman','/');
var swagger2PostmanNodeModulesDir = path.join(swagger2PostmanDir,'node_modules','/');
var newmanNodeModulesDir = path.join(npmPackageDir,'newman','node_modules','/');
var postmanJsonDir =path.join(__dirname,'..','..','exporter','postman','data','json','/');
var swaggerJsonDir = path.join(__dirname,'data','json');

//console.log('__dirname: '+__dirname);
//console.log('swagger2PostmanDir: '+swagger2PostmanDir);
//console.log('swagger2PostmanNodeModulesDir: '+swagger2PostmanNodeModulesDir);
//console.log('newmanNodeModulesDir: '+newmanNodeModulesDir);
////console.log('newmanNodeModulesDir: '+newmanNodeModulesDir);
//console.log('postmanJsonDir: '+postmanJsonDir);
//console.log('swaggerJsonDir: '+swaggerJsonDir);

var expect = require(swagger2PostmanNodeModulesDir+'expect.js');
var	Swagger2Postman = require(swagger2PostmanDir+'convert.js');
var newman = require(newmanNodeModulesDir+'newman');
const readline = require('readline');

const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

//rl.question('Please enter to be converted Swagger json file in importer/data/json ', (answer) => {
	var answer="platform-local-swagger.json";
	  console.log(`Converting: ${answer}  to postman.json`);

	  rl.close();
	  var swaggerJsonFilePath = path.join(swaggerJsonDir,answer);
	  console.log('Swagger Json Path : '+swaggerJsonFilePath);
	  
	  try{
		  var swagger = require(swaggerJsonFilePath)
		  var converter = new Swagger2Postman(),
		  	convertResult = converter.convert(swagger);
		  	converter.setLogger(console.log);
		  	console.log(convertResult);
		  	
		  if(convertResult.status === "passed"){
			  var postmanJsonFile=path.join(postmanJsonDir,answer.split('.')[0]+"-postman.json");
			  var dataJsonFile=path.join(swaggerJsonDir,"../platform-local-data.json");
			  fs.writeFile(postmanJsonFile, JSON.stringify(convertResult.collection), function(err) {
			  		if(err) {
			  			return console.log(err);
			  		}
			    	   console.log("The file was saved! at "+ postmanJsonFile);
			    	   newman.run({
						    collection: require(postmanJsonFile),
						    reporters: 'cli',
						    iterationData:require(dataJsonFile),
						}, function (err) {
							if (err) { throw err; }
						    console.log('collection run complete!',dataJsonFile);
					});
			  });
			 
		  }
		  else{
			  console.log('Error: Failed to convert swagger.json, Message:', convertResult.message);
		  }
	  }
	  catch(err){	// Catch for invalid swaggerJsonFilePath / json file name
		  console.log(err);
		  if(err.code === 'MODULE_NOT_FOUND'){
		      return console.log('Error: MODULE NOT FOUND ,', swaggerJsonFilePath);
		    }
	  }

//});
    