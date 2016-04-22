/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadEngines = LoadEngines;

var wf = WF();

function addEngine(tmpDir, tmpArray, result)
{
	var confModule = new wf.AppClass.App(tmpDir, tmpArray);
	if(confModule.appState && confModule.conf.config.state)
	{
		var newModule = {};
		try 
		{
			var loadedModule = require(tmpDir + confModule.name + "/" + confModule.name + wf.CONF.APP_END);
			if(loadedModule && typeof loadedModule == "function")
			{
				newModule = new loadedModule(confModule);
				if(newModule.code !== undefined && typeof newModule.code === "function") newModule.execute = true;
			}
		}
		catch(e){console.log("Error in Engine : " + tmpDir + confModule.name + "/" + confModule.name + wf.CONF.APP_END);}
		result.push({'path': tmpDir, 'name': confModule.name, 'conf': confModule.conf, 'place': tmpArray, 'exec': newModule, 'view': confModule.view });
	}
}

function parseEngines(pDir, dir)
{
	wf.ENGINES[dir] = {};
	var result = [];
	var tmpDir = pDir + dir + "/";
	var tmpArray = fs.readdirSync(tmpDir);
	for(var m = 0; m < tmpArray.length; m++)
	{
		addEngine(tmpDir, tmpArray[m], result);
	}
	result.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
	for(var i = 0; i < result.length; i++)
	{
		
		if(result[i] !== undefined)  wf.ENGINES[dir][result[i].name] = result[i];
	}
}
	
function LoadEngines()
{
	var pDir = wf.CONF.ENGINE_PATH;
	if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
	{
		wf.ENGINES = {};
		var pArr = fs.readdirSync(pDir);
		for(var p = 0; p < pArr.length; p++)
		{
			parseEngines(pDir, pArr[p]);
		}
	}
}