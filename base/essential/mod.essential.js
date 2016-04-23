/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.hookMod = hookMod;
module.exports.LoadMods = LoadMods;
UTILS.hookMod = hookMod;
var wf = WF();

function hookMod(req, res, p)
{
	if(!req.srv || !req.host || !req.zone) return;
    var mArr = wf.SERVERS[req.srv].HOSTS[req.host].ZONES[req.zone].MODS[p];
    req.modPath = p;
	for(var mod in mArr)
	{   
        req.mod = mArr[mod].name;
        var exec = wf.Clone(mArr[mod].exec);
        exec.path = mArr[mod].path + "/" + mArr[mod].name + "/";
	    if(exec.code) exec.code(req, res);
	}
}

function addMods(srv, host, zone, directory)
{
	var tmpDir = fs.readdirSync(directory);
	for(var m = 0; m < tmpDir.length; m++)
	{
	  var mTmp = new wf.ModClass.Module(directory, tmpDir[m]);
	  if(mTmp.modState && mTmp.conf.config.state)
	  {
		var cTmp = require(directory + mTmp.name + "/" + mTmp.name + wf.CONF.MOD_END);
		var eTmp = {};
		for( var c in cTmp)
		{
		  for(var f in cTmp[c])
		  {
			if(typeof(cTmp[c][f]) == "function")
			eTmp[f] = cTmp[c][f];
		  }
		}
		eTmp.ZONE = wf.SERVERS[srv].HOSTS[host].ZONES[zone];
		wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[pArr[p]].push({'path': directory, 'name': mTmp.name, 'conf': mTmp.conf, 'exec': eTmp, 'view': mTmp.view });
	  }
	}
}

function storeMods(srv, host, zone, current)
{
	var result = wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[current];
	wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[current] = {};
	for(var i = 0; i < result.length; i++)
	{
	   if(result[i] !== undefined)
	   {
		 wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[current][result[i].name] = result[i];
	   }
	}
}

function cbMods(srv, host, zone)
{
	var pDir = wf.CONF.SRV_PATH + srv + "/" + wf.CONF.HOST_FOLDER + wf.SERVERS[srv].HOSTS[host].name + "/" + wf.CONF.ZONE_FOLDER + wf.SERVERS[srv].HOSTS[host].ZONES[zone].name + '/'  + wf.CONF.MOD_FOLDER;
	if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
	{
	  wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS = {};
	  var pArr = fs.readdirSync(pDir);
	  var pArrL = pArr.length;
	  for(var p = 0; p < pArrL; p++)
	  {
		wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[pArr[p]] = [];
		var directory = pDir + pArr[p] + "/";
		// Load Mods
		addMods(srv, host, zone, directory);
		// Sort Mods
		wf.SERVERS[srv].HOSTS[host].ZONES[zone].MODS[pArr[p]].sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
		// Store Mods
		storeMods(srv, host, zone, pArr[p]);
	  }
	}
}

function LoadMods()
{
	wf.parseServersAndHostsAndZones(cbMods);
}