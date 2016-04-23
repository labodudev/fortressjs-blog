/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports = cacheApp;
function cacheApp()
{
    var wf = WF();
    this.runOnce = function()
    {
        function doCache()
        {
            if(wf.CONF.SHARED_CACHE && wf.CONF.REFRESH_CACHE)
            {
                setInterval(getCache, wf.CONF.INTERVAL_CACHE);
            }
        }
		
		
		function cbCache(srv, host, zone)
		{
			if(wf.SERVERS[srv].HOSTS[host].ZONES[zone].conf.shared !== undefined && wf.SERVERS[srv].HOSTS[host].ZONES[zone].conf.cache !== undefined)
			{
				for(var folder in wf.SERVERS[srv].HOSTS[host].ZONES[zone].shared)
				{
					var tmp = wf.SERVERS[srv].HOSTS[host].ZONES[zone].shared[folder];
					
					function cbStat(err, stat)
					{
						if(err || !stat.isFile())
						{
							delete wf.SERVERS[srv].HOSTS[host].ZONES[zone].shared[folder];
						}
						
						else if( tmp.mtime != stat.mtime && UTILS.checkCache(wf.SERVERS[s].HOSTS[host].ZONES[zone].conf.cache, tmp.path) )
						{
							try
							{
								var toAdd = {};
								toAdd.buffer = fs.readFileSync(tmp.path);
								toAdd.mime = wf.mimeUtil.lookup(tmp.path);
								toAdd.path = tmp.path;
								toAdd.mtime = stat.mtime;
								wf.SERVERS[srv].HOSTS[host].ZONES[zone].shared[folder] = toAdd;
							}
							catch(e){}
						}
					}
					
					fs.stat(tmp.path, cbStat);
				}
			}
		}
        
        function getCache()
        {
			wf.parseServersAndHostsAndZones(cbCache);
        }        
        
        wf.eventEmitter.on("run", doCache);
    };
}