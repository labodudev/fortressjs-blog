/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadHooks = LoadHooks;

var wf = WF();

function LoadHooks()
{
	wf.parseServersAndHosts(cbHooks);
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

function parseHook(root, current)
{
	if (fs.lstatSync(root +'/' + current).isDirectory() && current != "." && current != "..")
	{
		var app = new wf.AppClass.App(root, current);
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