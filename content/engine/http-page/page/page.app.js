/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports = pageEngine;
var wf = WF();

function createRoute(srv, host, zone, page, path)
{
	var context = wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[page];
	if(wf.SERVERS[srv].HOSTS[host].default_page && wf.SERVERS[srv].HOSTS[host].default_page == page)
	{
		for(var u in wf.SERVERS[srv].HOSTS[host].host)
		{
			wf.Router.ANY(u, path, wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[page].exec.code.bind(context));
		}
	}
	else
	{
		for(var v in wf.SERVERS[srv].HOSTS[host].host)
		{
			wf.Router.ANY(v, path + page, wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[page].exec.code.bind(context));
		}
	}
}

function cbPages(srv, host, zone)
{
	var path = "/";
	if(wf.SERVERS[srv].HOSTS[host].default_zone && wf.SERVERS[srv].HOSTS[host].default_zone != zone)
	{
		path += zone + "/";
	}
	for(var page in wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES)
	{
		if(wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[page].exec && wf.SERVERS[srv].HOSTS[host].ZONES[zone].PAGES[page].exec.code)
		{       
			createRoute(srv, host, zone, page, path);
		}
	}
}

function pageEngine()
{
    wf.parseServersAndHostsAndZones(cbPages);
}