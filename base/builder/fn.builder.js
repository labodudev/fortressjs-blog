/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.parseServers = parseServers;
module.exports.parseServersAndHosts = parseServersAndHosts;
module.exports.parseServersAndHostsAndZones = parseServersAndHostsAndZones;

var wf = WF();

function parseServers(cb)
{
	if(wf.SERVERS !== undefined)
	{
		for(var s in wf.SERVERS)
		{
			if(wf.SERVERS[s] !== undefined)
			{
				cb(s);
			}
		}
	}
}

function parseServersAndHosts(cb)
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
			 cb(s, h);
		  }
        }
      }
    }
  }
}

function parseServersAndHostsAndZones(cb)
{
	for(var srv in wf.SERVERS)
	{
		for(var host in wf.SERVERS[srv].HOSTS)
		{
			if(wf.SERVERS[srv].HOSTS[host] !== undefined && wf.SERVERS[srv].HOSTS[host].ZONES !== undefined)
			{
				for(var zone in wf.SERVERS[srv].HOSTS[host].ZONES)
				{
					cb(srv, host, zone);
				}
			}
		}
	}
}