/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.AppClass = { App:App, AppConf: AppConf };

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