/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.parseServers = parseServers;
module.exports.parseServersAndHosts = parseServersAndHosts;

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