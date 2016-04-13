# FortressJS
Nodejs extremly fast, simple, and secure net &amp; web framework

Run on Windows, Mac, Linux, Smartphone ...

3 steps installation with git
-----------------------------

```
$ git clone https://github.com/seraum/fortressjs/
$ cd fortressjs
$ node wf.js
```

or

3 steps installation with npm
-----------------------------

```
$ npm install fortressjs
$ echo "require('fortressjs')" > app.js
$ node app.js
```

You can now browse http://127.0.0.1/ or http://localhost/

Understand FortressJS
---------------------

## server 

FortressJS come with a particular approach on servers, web page etc ... So a server (in base/server/) is a squeleton of how your server should work.

### basic server conf file

	a conf file always end by .conf.js (editable in conf/settings.conf.js)
	
```
var webConf=
{
	"state": true, // true | false, default is true
	"type": "http", // "http", "net", ... see base/server/
	"name": "Default name", // "my name"
	"port": {"http": 80}, // { "http": 80, "http2":81 }
	"thread": 2, // int value or os.cpus().length
	"engine": 
	{
	  "http-start": {at: "start"},
	  "http-data": {at: "start"},
	  "http-zone": {at: "start"},
	  "http-page": {at: "start"},
	  "http-default": { at: "default"},
	  "http-route": {at: "route"},
	  "http-error": {at: "error"}
	},
	"map": ["start", "app", "default", "route", "error" ] // Order app/engine launching map
}
module.exports.webConf = webConf;
```
	
## engine 

Once a server is described, you can customize it with engines. Engines are pieces of code that "make" your server run. For example, in http-data engines folder, you'll find cookie engine. Cookie engine parse request cookie. 

If you don't need to hack in FortressJS, don't touch it. Engines are configured in the server conf file.

### basic engine, app and plugin conf file

```
var engineConf=
{
	"state": true, // true | false , default is true
	"pos": 0 // position of execution
}
module.exports.engineConf = engineConf
```

## app 

Now your server is ready with engines, you can create a host. Hosts can have apps, in app folder, that acts as engines, but at host level.

Apps are configured in host conf file.

### basic host conf file

```
var hostConf=
{
	"state": true,
	"pos": 0,
	"default_zone": "front", // default zone for /
	"default_page": "home", // default view for /
    "host":
    {
      "mydomain.com": "my domain description",
    },

    "app":
    {
		// here goes apps
    },
}
module.exports.hostConf = hostConf
```

## zone 

Once in a host, you can create zones. Zones are a feature of FortressJS, that acts like containers. If you don't need zones, simply create one named default.

### basic zone conf file

```
var zoneConf =
{
	'uri': 'front', // zone uri, if default zone => /
	'state': true, 
	'pos': 0,
	'shared': 'jail', // shared folder name in zone 
	'cache': ['.js', '.css'] // '*' for cache all, only for little sites or testing purpose	
}
module.exports.zoneConf = zoneConf;
```


## page and shared folder

In a zone, you've got a shared folder with simple cache (jail by default), and page folder, which contains basic page. Page are stored in ram and delivered very fast. Pages got a view folder, with .htll filed. You can called them in a page with this.view['view_name_without_html']. Views are also stored in ram.

### default page conf file

```
var pageConf=
{
	"pos": 0, // position if menu app or conflict
	"uri": "home" // page uri if not default page
}
module.exports.pageConf = pageConf
```

Begin work
----------

Once you get your copy of FortressJS and tested that it works, you can know discover the structure :

* root folder
	* base => the code base of FortressJS folder
		* core => the core code, that make work FortressJS
		* essential => essential code for master/worker to work
		* master => code exclusively for master 
		* proto => modify or add functions to objects
		* server => describe how a server work (net,http,message ...)
		* util => util code, for simple smtp, zip etc
		* worker => code exclusively for worker
	* conf => contain the main conf files
		* load.conf.js => to load custom node_modules or other
		* settings.conf.js => the main conf file that describe FortressJS
		* xxx.conf.js => your own conf files
	* content => app and logical folder content
		* engine => engines make servers run
		* process => process folder, launch process with FortressJS
		* script => script folder, act as cron job
		* squel => squeleton files for deployment and installation
		* srv => contains servers code to run
			* web => a server folder, name could be what you want
				* app => the logical app for you server (api, auth ...)
				* host => hosts folder
					* default => default host folder, could me what you want
						* zone => folder with zone container
							* demo => demo zone 
							* front => front FortressJS.com zone 
								* jail => contain css, js, html files
								* page => contain zone pages 
									* about =>about demo page
									* home => home page
										* view => contains .html files to call in page
						* model => model folder for mongodb or other db support (see model.core.js and db.essential.js)
						* plugin => plugin folder
			* xxxxx => an other server folder
		* tmp => as in linux, a tmp folder
		* var => as in linux, a var folder
	* start => launch code, don't touch
		
	* wf.js => the main app file, don't modify

See more
--------

Visit http://fortressjs.com && http://seraum.com
