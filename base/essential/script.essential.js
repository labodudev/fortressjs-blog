/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadScripts = LoadScripts;
var wf = WF();

function LoadScripts()
{
	var sArr = [];
	var c = wf.CONF.SCRIPT_PATH;
	if(fs.existsSync(c) && fs.lstatSync(c).isDirectory())
	{
		var dArr = fs.readdirSync(c);
		for(var d in dArr)
		{
			if (fs.lstatSync(c +'/' + dArr[d]).isDirectory() && dArr[d] != "." && dArr[d] != "..")
			{
				var script = new wf.ScriptClass.Script(c, dArr[d]);
				if(script.scriptState && script.conf.config.state)
				{
					var sFile = require(script.script);
					for(var prop in sFile)
					{
						for(var index in sFile[prop])
						{
							script[index] = sFile[prop][index];
						}
					}
					sArr.push(script);
				}
			}
		}
		sArr.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
	}
	wf.SCRIPT = sArr;
}

