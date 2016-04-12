module.exports.TPL = TPL;
module.exports.LoadTPL = LoadTPL;
var wf = WF();

function TPL()
{

	this.Reset = function()
	{
			this.inner = "";
			this.css = "";
			this.err = "";
			this.tmp = "";
			this.tpl = "";
			this.tpl_path = "";
	}

	this.add = function(code)
	{
		wf.TPL.tmp += code;
	}

	this.gettemplate = function()
	{

		var z = new Zone(wf.CONF['MAIN_PATH'] + wf.CONF['CONTENT_FOLDER'] + wf.CONF['ZONE_FOLDER'], wf.TPL.zone);
		if(z.conf !== undefined)
		{
			if(z.conf.config['state']) wf.TPL.tpl =  z.conf.config['tpl'];
			else die();
		}
		if(wf.TPL.tpl !== undefined && wf.TPL.tpl.length > 0)
		{
			wf.TPL.path = z.path + z.name + '/' + wf.CONF['TPL_FOLDER'] + wf.TPL.tpl + '/' + wf.TPL.tpl + wf.CONF['TPL_END'];
		}
		else wf.TPL.path = wf.CONF['MAIN_PATH'] +  wf.CONF['CONTENT_FOLDER'] + wf.CONF['GLOBAL_FOLDER'] + wf.CONF['TPL_FOLDER'] + wf.CONF['DEFAULT_TPL'] + '/' + wf.CONF['DEFAULT_TPL'] + wf.CONF['TPL_END'];
		require(wf.TPL.path);
	}

	this.getcss = function()
	{
		var z = new Zone(wf.CONF['MAIN_PATH'] + wf.CONF['CONTENT_FOLDER'] + wf.CONF['ZONE_FOLDER'], wf.TPL.zone);
		if(z.conf !== undefined)
		{
			wf.TPL.tpl =  z.conf.config['tpl'];
		}

		if(wf.TPL.tpl !== undefined && wf.TPL.tpl.length > 0)
		{
			wf.TPL.path = z.path + z.name + '/' + wf.CONF['TPL_FOLDER'] + wf.TPL.tpl + '/' + wf.TPL.tpl + wf.CONF['CSS_END'];
		}
		else wf.TPL.path = wf.CONF['MAIN_PATH'] +  wf.CONF['CONTENT_FOLDER'] + wf.CONF['GLOBAL_FOLDER'] + wf.CONF['TPL_FOLDER'] + wf.CONF['DEFAULT_TPL'] + '/' + wf.CONF['DEFAULT_TPL'] + wf.CONF['CSS_END'];

		if(fs.existsSync(wf.TPL.path))
		{
			var cArr = require(wf.TPL.path);
			for(var prop in cArr)
			{
				if(cArr[prop] !== undefined) css.code();
			}
		}
	}

	this.Clear = function()
	{
		this.Reset();
	}

	this.Reset();

}

function LoadTPL()
{
  for(var s in wf.SERVERS)
  {
    for(var h in wf.SERVERS[s].HOSTS)
    {
      for(var z in wf.SERVERS[s].HOSTS[h].ZONES)
      {
        var pDir = wf.CONF['SRV_PATH'] + s + "/" + wf.CONF['HOST_FOLDER'] + wf.SERVERS[s].HOSTS[h].name + "/" + wf.CONF['ZONE_FOLDER'] + wf.SERVERS[s].HOSTS[h].ZONES[z].name + '/'  + wf.CONF['TPL_FOLDER'];

        if(fs.existsSync(pDir) && fs.lstatSync(pDir).isDirectory())
        {
          wf.SERVERS[s].HOSTS[h].ZONES[z].TPL = {};
          var pArr = fs.readdirSync(pDir);
          var pArrL = pArr.length;

          for(var p = 0; p < pArrL; p++)
          {
              var cTmp = require(pDir + pArr[p] + "/" + pArr[p] + wf.CONF['TPL_END']);
              var eTmp = {}
              for( var c in cTmp)
              {
                for(var f in cTmp[c])
                {
                  if(typeof(cTmp[c][f]) == "function")
                  eTmp[f] = cTmp[c][f];
                }
              }
              wf.SERVERS[s].HOSTS[h].ZONES[z].TPL[pArr[p]] = { 'exec': eTmp };
          }
        }
      }
    }
  }
}
