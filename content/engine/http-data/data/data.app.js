/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports = dataEngine;
var wf = WF();

function dataEngine()
{
	function parseData(req, res)
	{
		try
		{
			var cl = parseInt(req.headers['content-length']);
			if(cl > wf.CONF.MAX_POST_SIZE)
			{
				res.destroy();
			}
			else
			{
				req.on("data", function(d)
				{                         
					try
					{
						req.postData += d.toString("binary");
					}
					catch(e){}
					 
					if(req.postData.length > wf.CONF.MAX_POST_SIZE)
					{
						res.destroy();
					}
				});

				var root = this;
				req.on("end", function()
				{
					next(req, res);
				});
			}
		}
		catch(e)
		{
			 res.destroy();
		}
	}
	
	this.code = function(req, res)
	{
		var cbDestroy = function()
		{
			 req.destroy();
		};
        req.postData = "";
        req.on("error", cbDestroy);
        req.on("clientError",  cbDestroy);
        
        if(req.method != "POST" && req.method != "PUT") 
        {
            return;
        }
        else
        {
			req.continue = false;
            parseData(req, res);
        }
	};
}
