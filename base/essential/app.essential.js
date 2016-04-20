/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.Launch = Launch;
module.exports.LoadApps = LoadApps;
module.exports.LoadHooks = LoadHooks;
module.exports.LoadEngines = LoadEngines;
module.exports.LoadModels = LoadModels;
global.next = function(req, res){ UTILS.LoopExec(req, res);};
var wf = WF();
function App(_path, _name)
	{
			/* CONSTRUCTOR 	*/
			this.path = _path + _name + "/";
			this.name = _name;
			this.view = {};
			/*				*/
			this.checkApp = function()
			{
				var file = this.path + this.name + wf.CONF.APP_END;
				if(fs.existsSync(file))
				{
					this.appState = true;
					this.app = file;
				}
				else this.appState = false;
			};
      this.loadViews = function()
      {
        var v = this.path + this.conf.config.view + "/";
        if(fs.existsSync(v) && fs.lstatSync(v).isDirectory())
        {
			var dArr = fs.readdirSync(v);
			var darrL = dArr.length;
            for(var d = 0; d < darrL; d++)
            {
                if(dArr[d].endsWith(wf.CONF.VIEW_END))
                {
                  var ind = dArr[d].replace(wf.CONF.VIEW_END, "");
                  this.view[ind] = fs.readFileSync(v + dArr[d]);
                }
            } 
        }
      };
			this.checkApp();
			this.conf = new AppConf(_path, _name);
            this.loadViews();
	}
	function AppConf(_path, _name)
	{
		this.path = _path;
		this.name = _name;
		this.config = { "state" : true, "pos" : 0, "view": "view", "version": "0.0" };
		this.readConf = function()
		{
			var file = this.path + "/" + this.name + "/" + this.name + wf.CONF.CONFIG_END;
			if(fs.existsSync(file))
			{
				try
				{
				  this.config = require(file);
				  UTILS.defaultConf(this.config);
				}
				catch(e)
				{
				  console.log("[!] Error conf : " + file);
				}
			}
		};
		this.readConf();
	}
	function getAppArray(p)
	{
		var aArr = [];
		var c = wf.CONF.APP_PATH + p + "/";
		if(fs.existsSync(c) && fs.lstatSync(c).isDirectory())
		{
			var dArr = fs.readdirSync(c);
			dArr.forEach(function(d)
			{
				if (fs.lstatSync(c +'/' + d).isDirectory() && d != "." && d != "..")
				{
					var app = new App(c, d);
					if(app.appState && app.conf.config.state)
					{
						app.conf.config.place = p;
						aArr.push(app);
					}
				}
			});
			aArr.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
		}
		return aArr;
	}
function Launch(req, res)
{
      var app = req.app[req.loop];
      var env = {};
      if(!app.hooked)
      {
          req.SERVER = wf.SERVERS[req.srv];
      }
      if(app.exec.code)
      {
        app.exec.code(req, res);
      }
}
function LoadEngines()
{
   var pDir = wf.CONF.ENGINE_PATH;
   if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
   {
     wf.ENGINES = {};
     var pArr = fs.readdirSync(pDir);
     var pArrL = pArr.length;
     for(var p = 0; p < pArrL; p++)
     {
       wf.ENGINES[pArr[p]] = {};
	   var result = [];
       var tmpDir = pDir + pArr[p] + "/";
       var tmpArray = fs.readdirSync(tmpDir);
       for(var m = 0; m < tmpArray.length; m++)
       {
         var confModule = new App(tmpDir, tmpArray[m]);
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
           result.push({'path': tmpDir, 'name': confModule.name, 'conf': confModule.conf, 'place': pArr[p], 'exec': newModule, 'view': confModule.view });
         }
       }
       result.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
       for(var i = 0; i < result.length; i++)
       {
         if(result[i] !== undefined)  wf.ENGINES[pArr[p]][result[i].name] = result[i];
       }
     }
   }
}

function LoadApps()
{
  if(wf.SERVERS !== undefined)
  {
    for(var s in wf.SERVERS)
    {
      if(wf.SERVERS[s] !== undefined)
      {
		  var pDir = wf.CONF.SRV_PATH + s + '/' + wf.CONF.APP_FOLDER;
		  wf.SERVERS[s].APPS = {};
		  
		  if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
		  {
			var pArr = fs.readdirSync(pDir);
			var pArrL = pArr.length;
			for(var p = 0; p < pArrL; p++)
			{
			  wf.SERVERS[s].APPS[pArr[p]] = [];
			  var tmpDir = pDir + pArr[p] + "/";
			  if(fs.lstatSync(tmpDir).isDirectory())
			  {
				  var tmpArray = fs.readdirSync(tmpDir);
				  var tL = tmpArray.length;
				  for(var m = 0; m < tL; m++)
				  {
					var confModule = new App(tmpDir, tmpArray[m]);
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
					  catch(e) { console.log("Error in App : " +  tmpDir + confModule.name + "/" + confModule.name + wf.CONF.APP_END);}
					  wf.SERVERS[s].APPS[pArr[p]].push(
					  {
						  'path': tmpDir, 'name': confModule.name, 'conf': confModule.conf, 'place': pArr[p], 'exec': newModule, 'view': confModule.view,
					  });
					}
				  }
				  wf.SERVERS[s].APPS[pArr[p]].sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
				  var result = wf.SERVERS[s].APPS[pArr[p]];
				  wf.SERVERS[s].APPS[pArr[p]] = result;
			  }
			}
		  }
      }
    }
  }
}

function LoadHooks()
{
  if(wf.SERVERS !== undefined)
  {

    for(var s in wf.SERVERS)
    {

      if(wf.SERVERS[s].HOSTS !== undefined)
      {

        for(var h in wf.SERVERS[s].HOSTS)
        {

          if(wf.SERVERS[s].HOSTS[h] !== undefined && wf.SERVERS[s].HOSTS[h].name !== undefined)
		  {
			 var hArr = {};
			 wf.SERVERS[s].HOSTS[h].HOOKS = {};
			 var p = wf.SERVERS[s].HOSTS[h].path + wf.SERVERS[s].HOSTS[h].name + "/" + wf.CONF.PLUGIN_FOLDER;

			 if(fs.existsSync(p) && fs.lstatSync(p).isDirectory())
			 {
			   var dArr = fs.readdirSync(p);
			   dArr.forEach(function(d)
				{
				  if (fs.lstatSync(p +'/' + d).isDirectory() && d != "." && d != "..")
				  {
            var app = new App(p, d);
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
			  
			  


            // LOAD IN ARRAY
            if(hArr[app.conf.config.hook] === undefined) hArr[app.conf.config.hook] = [];
            hArr[app.conf.config.hook].push({'name': app.name, 'hooked': true, 'conf': app.conf, 'exec': newModule, 'view': app.view });

            }
				  }
				});

			   for(var o in hArr)
			   {
				 hArr[o].sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
				 wf.SERVERS[s].HOSTS[h].HOOKS[o] = hArr[o];
			   }
			 }
          }
        }
      }
    }
  }
}

function LoadModels()
{
  if(wf.SERVERS !== undefined)
  {

    for(var s in wf.SERVERS)
    {

      if(wf.SERVERS[s].HOSTS !== undefined)
      {

        for(var h in wf.SERVERS[s].HOSTS)
        {

          if(wf.SERVERS[s].HOSTS[h] !== undefined && wf.SERVERS[s].HOSTS[h].name !== undefined)
		  {
			wf.SERVERS[s].HOSTS[h].MODELS = {};
			var p = wf.SERVERS[s].HOSTS[h].path + wf.SERVERS[s].HOSTS[h].name + "/" + wf.CONF.MODEL_FOLDER;

			var mArr = (wf).Load.loadFiles(wf.CONF.MODEL_END, p, true);
            if(mArr && mArr !== null)
            {
				var j = mArr.length;
				for(var i = 0; i < j; i++)
				{
					var name = mArr[i].split(wf.CONF.MODEL_END)[0]; 
					try
					{
						wf.SERVERS[s].HOSTS[h].MODELS[name] = require(p + mArr[i]);
					}
					catch(e)
					{
						console.log("[!] Error conf : " + p + mArr[i]);
					}
				}
            }
          }
        }
      }
    }
  }
}

/******************************* APP UTILS **********************************/
global.loadView = function(req, res, v)
{
    if(req.app[req.loop].view[v] !== undefined)
    {
      res.tpl.inner += req.app[req.loop].view[v];
    }
};
global.getView = function(req, res, v)
{
    if(req.app[req.loop].view[v] !== undefined)
    {
      return req.app[req.loop].view[v];
    }
};
global.endView = function(req, res, v)
{
    req.continue = false;
    if(req.app[req.loop].view[v] !== undefined)
    {
      res.end(req.app[req.loop].view[v]);
    }
    else res.end("Undefined view");
};
/****************************************************************************/