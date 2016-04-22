/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadApps = LoadApps;

var wf = WF();

global.next = function(req, res){ UTILS.LoopExec(req, res);};

function LoadApps()
{
	wf.parseServers(cbApps);	
}

function parseApp(srv, appPath, root, current)
{
	var confModule = new wf.AppClass.App(root, current);
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