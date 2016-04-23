var wf = WF();
wf.TMP = {};

// GET CURRENT NODE VERSION
var nv = getNodeVersion();

// REQUIRE STD Object

global.cluster = require('cluster');
global.os = require('os');
global.child_process = require('child_process');
global.exec = child_process.exec;
global.spawn = child_process.spawn;
global.execFile = child_process.execFile;
global.fs = require('fs');
global.http = require('http');
global.https = require('https');
if( nv.major === 0 || (nv.major === 1 && nv.minor < 12) ){global.http.setMaxHeaderLength(10000000);} // SET HTTP MAXHEADER
global.http.globalAgent.maxSockets = Infinity;
global.path = require('path');
global.net = require('net');
global.url  = require('url');
global.querystring = require('querystring');
global.zlib  = require('zlib');
global.crypto = require('crypto');

global.cluster = require('cluster');
global.extend = require('util')._extend;
global.events = require('events');
global.stream = require("stream");
wf.eventEmitter = new events.EventEmitter();
global.EOL = os.EOL;

// CREATE UTILS OBJECT
global.UTILS = {};

wf.Default = function(arg, def)
{
	if(arg === undefined) return def;
	else return arg;
};
UTILS.Default = wf.Default;

wf.DefaultStr = function(arg)
{
	return wf.Default(arg, "");
};
UTILS.DefaultStr = wf.DefaultStr;

wf.Redirect = function(res, url)
{
		res.writeHead(302, 
        {
			'Location': url
		});
	res.stop = true;
	res.end("");
};
UTILS.Redirect = wf.Redirect;

wf.Clone = function(obj)
{
  return Object.create(obj);
};
UTILS.Clone = wf.Clone;

UTILS.checkState = function(state)
{
	if(state == "true") this.config.state = true;
	else this.config.state = false;
};
UTILS.checkPos = function(pos)
{
	if(!isNan(this.config.pos)) this.config.pos = parseInt(pos);
};

UTILS.defaultConf = function(config, more)
{
	if(!config) config = {};
	if(config.state === undefined) config.state = true;
	if(!config.pos) config.pos = 100;
	if(more)
	{
		for(var m in more)
		{
			if(!config[m]){config[m] = more[m];}
		}
	}
};

wf.Load = new wfLoader();
function wfLoader()
{
	/* PUBLIC */
	this.Base = function(path, cpath)
	{
		var bpath = "";
		if(cpath === undefined)
			bpath = wf.CONF.BASE_PATH + path + "/";
		else bpath = cpath + path + "/";
		var files = this.loadFiles(path, bpath);
		if(files !== undefined)
		{
			files.forEach(function(file)
			{
				var t = require(bpath + file);
				for(var prop in t)
				{
					(wf)[prop] = t[prop];
				}
			});
		}
	};

	this.loadFiles = function(path, bpath, complete)
	{
		if(complete === undefined) complete = false;
		if(fs.existsSync(bpath))
		{
			return fs.readdirSync(bpath).filter(function (file)
			{
				var ext = "";
				if(!complete)
				{
					ext = "." + path + ".js";
				}
				else
				{
					ext = path;
				}
				if(file.substr(-(ext.length)) === ext)
					return fs.statSync(bpath + file).isFile();
			});
		}
	};
    
    /* PRIVATE */
	function getDirectories() 
	{
	  return fs.readdirSync(wf.CONF.BASE_PATH + path).filter(function (file) 
	  {
		return fs.statSync(wf.CONF.BASE_PATH + path + '/' + file).isDirectory();
	  });
	}
}

function getNodeVersion()
{
	var v = process.version;
	v = v.split('.');
	var res =
	{
		major: v[0],
		minor: v[1],
		rev: v[2],
	};
	return res;
}
