/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadModels = LoadModels;
var wf = WF();

function LoadModels()
{
	wf.parseServersAndHosts(cbModels);
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