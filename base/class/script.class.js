/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.ScriptClass = {Script: Script, ScriptConf: ScriptConf};
var wf = WF();

function Script(_path, _name)
{
    this.path = _path + _name + "/";
    this.name = _name;

    this.checkScript = function()
    {

        var file = this.path + this.name + wf.CONF.SCRIPT_END;
        if(fs.existsSync(file))
        {
            this.scriptState = true;
            this.script = file;
            this.conf = new ScriptConf(_path, _name);
        }
        else this.scriptState = false;
    };

    /* FONCTION DECLARATIONS */
    this.checkScript();
    this.conf = new ScriptConf(_path, _name);
    /*************************/
}

function ScriptConf(_path, _name)
{
    this.path = _path + _name + "/";
    this.name = _name;
    this.config = { "state": true, "pos": 100, 'day':'*', date:'*', 'month':'*', 'hour':'0', 'minute':'0' };

	this.readConf = function()
	{
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
			  this.config = require(file);
			}
			catch(e)
			{
			  console.log("[!] Error Script conf : " + file);
			}
		}
	};

	/* FONCTION DECLARATIONS */
	this.readConf();
	/*************************/
}