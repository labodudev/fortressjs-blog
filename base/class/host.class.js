/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.HostClass = { Host: Host, HostConf: HostConf };
var wf = WF();

function Host(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;

	this.checkHost = function()
	{
		var folder = this.path;

		if(fs.existsSync(folder) && fs.lstatSync(folder).isDirectory())
		{
			this.hostState = true;
			this.host = folder;
		}
		else this.hostState = false;
	};

	/* FONCTION DECLARATIONS */
	this.checkHost();
	this.conf = new HostConf(_path, _name);

	/*************************/
}

function HostConf(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;
	var defConf = { "version": "0.0.0.0" };

	this.readConf = function()
	{
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
				this.config = require(file);
				UTILS.defaultConf(this.config, defConf);
			}
			catch(e)
			{
				console.log("[!] Error Host conf : " + file);
			}
		}
	};

	/* FONCTION DECLARATIONS */
	this.readConf();
	/*************************/
}