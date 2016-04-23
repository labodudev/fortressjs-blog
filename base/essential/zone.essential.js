/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadZones = LoadZones;
module.exports.CreateZone = Zone;
module.exports.checkCache = checkCache;
UTILS.checkCache = checkCache;
var wf = WF();

// cache could be '*' or ['.jpg', '.blabla' ...]
function checkCache (cache, path)
{
	if(cache.indexOf('*') > -1)
	{
		return true;
	}
    else
    {
        var j = cache.length;
        for(var i = 0; i < j; i++)
        {
            if( path.endsWith( cache[i] ) )
            {
                return true;
            }
        }
        return false;
    }
}

function Zone(_path, _name)
{
		this.path = _path + _name + "/";
		this.name = _name;
		this.shared = {};


	this.loadStatic = function()
	{
        var name = "/" + this.name;

		if(wf.CONF.SHARED_CACHE && this.conf.config.shared !== undefined)
		{
			var shared = this.path + this.conf.config.shared;
			var cache = this.conf.config.cache;
			var rDir = function(p, s)
			{
				s = wf.DefaultStr(s);
				var tArr = { };
				var tmpArr = {};
				if(cache !== undefined && fs.statSync(p).isDirectory())
				{
					var pArr = fs.readdirSync(p);
					for(var d in pArr)
					{
						if(fs.statSync(p + '/' + pArr[d]).isDirectory())
						{
							tmpArr = rDir(p + '/' + pArr[d] , s + "/" + pArr[d]);
							for (var t in tmpArr)
							{
								tArr[t] = tmpArr[t];
							}
						}
						else
						{
							if(checkCache(cache, name + s + "/" + pArr[d]))
							{
								tArr[name + s + "/" + pArr[d]] = { };
								tArr[name + s + "/" + pArr[d]].buffer = fs.readFileSync(p + "/" + pArr[d]);
								tArr[name + s + "/" + pArr[d]].mime = wf.mimeUtil.lookup(pArr[d]);
								tArr[name + s + "/" + pArr[d]].path = p + "/" + pArr[d];
								tArr[name + s + "/" + pArr[d]].mtime = fs.lstatSync( p + '/' + pArr[d]).mtime;
							}
						}
					}
					return tArr;
				}
				return tArr;
			};
            try 
            {
			     if(fs.statSync(shared).isDirectory())
			     {
				    this.shared = rDir(shared);
			     }
            }catch(e){}
		}
	};

	this.checkZone = function()
	{
		var folder = this.path;
		if(fs.existsSync(folder) && fs.lstatSync(folder).isDirectory())
		{
			this.zoneState = true;
			this.zone = folder;
		}
		else this.zoneState = false;
	};

	/* FONCTION DECLARATIONS */
	this.checkZone();
	this.conf = new ZoneConf(_path, _name);
	this.loadStatic();
	/*************************/
}

function ZoneConf(_path, _name)
{

	this.path = _path + _name + '/';
	this.name = _name;
	var defConf = { "version": "0.0.0.0", "uri": this.name };

	this.readConf = function()
	{
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
			  this.config = require(file);
			  UTILS.defaultConf(this.config, defConf);
			}
			catch(e)
			{
			  console.log("[!] Error Zone conf : " + file);
			}
		}
	};

	/* FONCTION DECLARATIONS */
	this.readConf();
	/*************************/
}

function hookZoneCss(h, z, name)
{
	var path = wf.CONF.HOST_PATH + h + "/" + wf.CONF.ZONE_FOLDER + z + name;
	if (fs.existsSync(path) && fs.lstatSync(path).isDirectory())
	{
		var zone = new Zone(path, name);
		if(zone.conf.config.css.length > 0 && fs.existsSync(zone.conf.config.css) && zone.zoneState && zone.conf.config.state)
		{
			var zoneCss = require(zone.conf.config.css);
			for(var prop in zoneCss)
			{
				zoneCss[prop].path = zone.path + '/';
				if(zoneCss[prop].code !== undefined) zoneCss[prop].code();
			}
		}
	}
}

function cbZones(s, h)
{
	var zDir = wf.CONF.SRV_PATH + s + "/" + wf.CONF.HOST_FOLDER + wf.SERVERS[s].HOSTS[h].name + '/' + wf.CONF.ZONE_FOLDER;
	if(fs.existsSync(zDir) && fs.lstatSync(zDir).isDirectory())
	{
		wf.SERVERS[s].HOSTS[h].ZONES = { };
		var hArr = fs.readdirSync(zDir);
		for(var d in hArr)
		{
			var zTmp = new Zone(zDir, hArr[d]);
			if(zTmp.zoneState && zTmp.conf.config.state)
			{
			wf.SERVERS[s].HOSTS[h].ZONES[zTmp.conf.config.uri] = {'path': zDir, 'name': zTmp.name, 'conf': zTmp.conf.config, "shared": zTmp.shared };
			}
		}
	}
}

function LoadZones()
{
	wf.parseServersAndHosts(cbZones);
}
