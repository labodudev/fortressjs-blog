/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.ProcessClass = {Process: Process, ProcessConf: ProcessConf};
var wf = WF();

function Process(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;

	this.checkProcess = function()
	{
		var pFile = this.path + this.name + wf.CONF.PROCESS_END;
		if(fs.existsSync(pFile))
		{
			this.process = pFile;
		}
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			this.processState = true;
			this.conf = new ProcessConf(_path, _name);
		}
		else this.processState = false;
	};
	/* FONCTION DECLARATIONS */
	this.checkProcess();
	this.conf = new ProcessConf(_path, _name);
	/*************************/
}

function ProcessConf(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;
	this.defaultConf = { "state": true, "pos": 100, restart: 'none', 'attempt': 5, 'delay': 3000, 'started': 10000, 'wait': false, cmd:'', args: [], options: {} };

	this.readConf = function()
	{
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
			  this.config = require(file);
			  UTILS.defaultConf(this.config);
			}
			catch(e)
			{
			  console.log("[!] Error process conf : " + file);
			}
		}
	};
	
	/* FONCTION DECLARATIONS */
	this.readConf();
	/*************************/
}