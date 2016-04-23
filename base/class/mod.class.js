/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.ModClass = { Module: Module, ModConf: ModConf };
var wf = WF();

function Module(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;
	this.view = {};

	this.checkModule = function()
	{
		var file = this.path + this.name + WF().CONF.MOD_END;
		if(fs.existsSync(file))
		{
			this.modState = true;
			this.mod = file;
		}
		else this.modState = false;
	};

	this.loadViews = function()
	{
		var v = this.path + this.conf.config.view + "/";
		if(fs.existsSync(v) && fs.lstatSync(v).isDirectory())
		{
			var dArr = fs.readdirSync(v);
			for(var d = 0; d < dArr.length; d++)
			{
				if(dArr[d].endsWith(WF().CONF.VIEW_END))
				{
					var ind = dArr[d].replace(WF().CONF.VIEW_END, "");
					this.view[ind] = fs.readFileSync(v + dArr[d]);
				}
			}
		}
	};

	this.checkModule();
	this.conf = new ModConf(_path, _name);
	this.loadViews();
}

function ModConf(_path, _name)
{
	this.path = _path;
	this.name = _name;
	this.config = { "state": true, "pos": 0, "css": "", "view": "view" };

	this.readConf = function()
	{
		var file = this.path + "/" + this.name + "/" + this.name + WF().CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
				this.config = require(file);
			}
			catch(e)
			{
				console.log("[!] Error Mod conf : " + file);
			}
		}
	};

	this.readConf();
}