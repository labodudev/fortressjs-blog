/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadHost = LoadHost;
var wf = WF();

function LoadHost()
{
  for(var srv in wf.SERVERS)
  {
    wf.SERVERS[srv].HOSTS = {};
    wf.SERVERS[srv].HOSTMAP = {};
    var tmpMap = [];
    var hDir = wf.CONF.SRV_PATH + srv + "/" + wf.CONF.HOST_FOLDER;

    if(fs.existsSync(hDir) && fs.lstatSync(hDir).isDirectory())
    {
      var hArr = fs.readdirSync(hDir);
	  for(var d in hArr)
      {
        var hTmp = new wf.HostClass.Host(hDir, hArr[d]);
        if(hTmp.hostState && hTmp.conf.config.state)
        {
            wf.SERVERS[srv].HOSTS[hArr[d]] =
            {
              'id': hArr[d],
              'path': hDir,
              'host':hTmp.conf.config.host,
              'hostState': hTmp.hostState,
              'state': hTmp.conf.config.state,
              'name': hTmp.name,
              'app': hTmp.conf.config.app,
              'default_zone': hTmp.conf.config.default_zone,
              'default_page': hTmp.conf.config.default_page,
              'default_url': hTmp.conf.config.default_url,
              'conf': hTmp.conf.config,
            };
            for(var i in hTmp.conf.config.host)
            {
                tmpMap.push({pos: hTmp.conf.config.pos, host:i, hostId: hArr[d]});
            }
			
        }
      }
    }
      tmpMap.sort(function(a, b){return a.pos - b.pos;});
      for(var n = 0; n < tmpMap.length; n++)
      {
          wf.SERVERS[srv].HOSTMAP[tmpMap[n].host] = tmpMap[n].hostId;
      }
  }
}
