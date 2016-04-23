/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadPages = LoadPages;
var wf = WF();

function pushPages(srv, host, zone, directory, result)
{
	var pArr = fs.readdirSync(directory);
	for(var p = 0; p < pArr.length; p++)
	{
		var pTmp = new wf.PageClass.Page(directory, pArr[p]);
		if(pTmp.pageState && pTmp.conf.config.state)
		{
			var cTmp = require(directory + pTmp.name + "/" + pTmp.name + wf.CONF.PAGE_END);
			if(typeof cTmp == "function")  
			{
				cTmp = new cTmp(pTmp);
				result[p] = {'path': directory, 'name': pTmp.name, 'uri':pTmp.conf.config.uri, 'conf': pTmp.conf, 'exec': cTmp, 'view':pTmp.view };
			}
		}
	}
}

function cbPages(srv, host, zone)
{
	var pDir = wf.CONF.SRV_PATH + srv + "/" + wf.CONF.HOST_FOLDER + wf.SERVERS[srv].HOSTS[host].name + "/" + wf.CONF.ZONE_FOLDER + wf.SERVERS[srv].HOSTS[host].ZONES[zone].name + '/' + wf.CONF.PAGE_FOLDER;
	if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
	{
		wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES = {};
		var result = [];
		// Push Pages
		pushPages(srv, host, zone, pDir, result);
		// Sort pages
		result.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
		// Forge URI
		for(var i = 0; i < result.length; i++)
		{
			if(result[i] !== undefined)
			{
				wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[result[i].uri] = result[i];
			}
		}
	}
}

function LoadPages()
{
	wf.parseServersAndHostsAndZones(cbPages);
}