/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadApps = LoadApps;
module.exports.LoadHooks = LoadHooks;
module.exports.LoadEngines = LoadEngines;
module.exports.LoadModels = LoadModels;

var wf = WF();

global.next = function(req, res){ UTILS.LoopExec(req, res);};

function LoadModels()
{
	wf.parseServersAndHosts(cbModels);
}

function LoadApps()
{
	wf.parseServers(cbApps);	
}

function LoadHooks()
{
	wf.parseServersAndHosts(cbHooks);
}


function getAppArray(p)
{
	var aArr = [];
	var c = wf.CONF.APP_PATH + p + "/";
	if(fs.existsSync(c) && fs.lstatSync(c).isDirectory())
	{
		var dArr = fs.readdirSync(c);
		for(var d in dArr)
		{
			if (fs.lstatSync(c +'/' + d).isDirectory() && d != "." && d != "..")
			{
				var app = new wf.Class.App(c, d);
				if(app.appState && app.conf.config.state)
				{
					app.conf.config.place = p;
					aArr.push(app);
				}
			}
		};
		aArr.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
	}
	return aArr;
}

function addEngine(tmpDir, tmpArray, result)
{
	var confModule = new wf.Class.App(tmpDir, tmpArray);
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

function parseApp(srv, appPath, root, current)
{
	var confModule = new wf.Class.App(root, current);
	if(confModule.appState && confModule.conf.config.state)
	{
		var newModule = {};
		try
		{
			var loadedModule = require(root + confModule.name + "/" + confModule.name + wf.CONF.APP_END);
			if(loadedModule && typeof loadedModule == "function")
			{
				newModule = new loadedModule(confModule);
				if(newModule.code !== undefined && typeof newModule.code === "function") newModule.execute = true;
			}
		}
		catch(e) { console.log("Error in App : " +  root + confModule.name + "/" + confModule.name + wf.CONF.APP_END);}
		wf.SERVERS[srv].APPS[appPath].push(
		{
		'	path': root, 'name': confModule.name, 'conf': confModule.conf, 'place': appPath, 'exec': newModule, 'view': confModule.view,
		});
	}
}

function parseAppContainer(srv, rootPath, appPath)
{
	wf.SERVERS[srv].APPS[appPath] = [];
	var tmpDir = rootPath + appPath + "/";
	if(fs.lstatSync(tmpDir).isDirectory())
	{
		var tmpArray = fs.readdirSync(tmpDir);
		for(var m = 0; m < tmpArray.length; m++)
		{
			parseApp(srv, appPath, tmpDir, tmpArray[m]);
		}
		wf.SERVERS[srv].APPS[appPath].sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
		var result = wf.SERVERS[srv].APPS[appPath];
		wf.SERVERS[srv].APPS[appPath] = result;
	}
}

function cbApps(s)
{
	var rootPath = wf.CONF.SRV_PATH + s + '/' + wf.CONF.APP_FOLDER;
	wf.SERVERS[s].APPS = {};
	if(fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory())
	{
		var appPath = fs.readdirSync(rootPath);
		for(var p = 0; p < appPath.length; p++)
		{
			parseAppContainer(s, rootPath, appPath[p]);
		}
	}
}

function parseHook(root, current)
{
	if (fs.lstatSync(root +'/' + current).isDirectory() && current != "." && current != "..")
	{
		var app = new wf.Class.App(root, current);
		if(app.appState && app.conf.config.state && app.conf.config.hook !== undefined)
		{
			var newModule = {};
			try
			{
				var loadedModule = require(tmpDir + confModule.name + "/" + confModule.name + wf.CONF.APP_END);
				if(loadedModule && typeof loadedModule == "function")
				{
					newModule = new loadedModule(app);
					if(newModule.code !== undefined && typeof newModule.code === "function") newModule.execute = true;
					if(newModule.runOnce && process.env.wrkId && process.env.wrkId === 0) newModule.runOnce();
					newModule.getView = function(v)
					{
						if(app.view[v] !== undefined)
						{
							return app.view[v];
						}
					};
				}
			}
			catch(e){ console.log("Error in Hooks : " +  tmpDir + confModule.name + "/" + confModule.name + wf.CONF.APP_END); }
			if(hookArr[app.conf.config.hook] === undefined) hookArr[app.conf.config.hook] = [];
			hookArr[app.conf.config.hook].push({'name': app.name, 'hooked': true, 'conf': app.conf, 'exec': newModule, 'view': app.view });
		}
	}
}

function cbHooks(s,h)
{
	var hookArr = {};
	wf.SERVERS[s].HOSTS[h].HOOKS = {};
	var root = wf.SERVERS[s].HOSTS[h].path + wf.SERVERS[s].HOSTS[h].name + "/" + wf.CONF.PLUGIN_FOLDER;
	if(fs.existsSync(root) && fs.lstatSync(root).isDirectory())
	{
		var current = fs.readdirSync(root);
		for(var c in current)
		{
			parseHook(root, current[c]);
		}
		for(var o in hookArr)
		{
			hookArr[o].sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
			wf.SERVERS[s].HOSTS[h].HOOKS[o] = hookArr[o];
		}
	}
}

function cbModels(s, h)
{
	wf.SERVERS[s].HOSTS[h].MODELS = {};
	var currentPath = wf.SERVERS[s].HOSTS[h].path + wf.SERVERS[s].HOSTS[h].name + "/" + wf.CONF.MODEL_FOLDER;
	var mArr = wf.Load.loadFiles(wf.CONF.MODEL_END, currentPath, true);
	if(mArr && mArr !== null)
	{
		var j = mArr.length;
		for(var i = 0; i < j; i++)
		{
			var name = mArr[i].split(wf.CONF.MODEL_END)[0]; 
			try
			{
				wf.SERVERS[s].HOSTS[h].MODELS[name] = require(currentPath + mArr[i]);
			}
			catch(e)
			{
				console.log("[!] Error conf : " + currentPath + mArr[i]);
			}
		}
	}
}