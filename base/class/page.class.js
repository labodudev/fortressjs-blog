/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.PageClass = {Page: Page, PageConf: PageConf};
var wf = WF();

function Page(_path, _name)
{
	this.path = _path + _name + "/";
	this.name = _name;
	this.view = {};

	this.checkPage = function()
	{
		var file = this.path + this.name + wf.CONF.PAGE_END;
		if(fs.existsSync(file))
		{
			this.pageState = true;
			this.page = file;
			this.conf = new PageConf(_path, _name);
			this.getPageModules();
		}
		else this.pageState = false;
	};

	this.loadViews = function()
	{
		var v = this.path + this.conf.config.view + "/";
		if(fs.existsSync(v) && fs.lstatSync(v).isDirectory())
		{
			var dArr = fs.readdirSync(v);
			var dArrL = dArr.length;
			for(var d = 0; d < dArrL; d++)
			{
				if(wfStringEndsWith(dArr[d], wf.CONF.VIEW_END))
				{
					var ind = dArr[d].replace(wf.CONF.VIEW_END, "");
					this.view[ind] = fs.readFileSync(v + dArr[d], 'utf8');
				}
			}
		}
	};

	function getPageModulesArray(c, state)
	{
		if(state === undefined) state = false;
		var mArr = [];
		if(fs.existsSync(c) && fs.lstatSync(c).isDirectory())
		{
			var dArr = fs.readdirSync(c);
			for(var d in dArr)
			{
				if (fs.lstatSync(c + '/' + dArr[d]).isDirectory())
				{
					var mod = new Module(c, dArr[d]);
					if(mod.modState && state === false && mod.conf.config.state) {  mArr.push(mod); }
					else if(mod.modState && state) {  mArr.push(mod); }
				}
			}
		}
		mArr.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
		return mArr;
	}
	
	this.getPageModules = function()
	{
		var mPath = this.path + this.conf.config.mod;
		if(this.conf.config.mod !== undefined && fs.existsSync(mPath) && fs.lstatSync(mPath).isDirectory())
		{
			this.modules = getPageModulesArray(mPath, true);
		}
	};
	
	/* FONCTION DECLARATIONS */
	this.checkPage();
	this.conf = new PageConf(_path, _name);
	this.loadViews();
	/*************************/
}

function PageConf(_path, _name)
{
	this.path = _path + _name + "/";
    this.name = _name;
    this.config = { "state": true, "pos": 100, "view": "view", "uri": this.name, };

	this.readConf = function()
	{
		var file = this.path + this.name + wf.CONF.CONFIG_END;
		if(fs.existsSync(file))
		{
			try
			{
			  this.config = require(file);
			  UTILS.defaultConf(this.config, {uri:this.name,view:"view"});
			}
			catch(e)
			{
			  console.log("[!] Error Page conf : " + file);
			}
		}
	};
      
	/* FONCTION DECLARATIONS */
	this.readConf();
	/*************************/
}