/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports = PostHttp;

function PostHttp()
{
    var wf = WF();
	
	function parseMultipartReq(req, multipart)
	{
		for(var r in multipart.parts)
		{
			req.post[r] = multipart.parts[r].body;
		}
		req.field = multipart.fields;
		req.multipart = multipart.isMultipart;
	}
	
	function parseReqRaw(req)
	{
		var tmp = req.postData.toString();
		var obj = tmp.split("&");
		for(var o = 0; o < obj.length; o++)
		{
			var t = obj[o].split("=");
			if(t[1] === undefined) t[1] = "";
			req.post[t[0]] = unescape(t[1].replace(/\+/gi, " "));
		}
	}
	
	function parseReqPost(req)
	{
		var multipart = new wf.MultipartParser(req.headers['content-type'], req.postData);
		if(multipart.isMultipart)
		{
			parseMultipartReq(req, multipart);
		}
		else if(req.postData.lastIndexOf !== undefined && req.postData.indexOf("{", 0) === 0)
		{
			try
			{
				req.post = JSON.parse(req.postData);
			}
			catch(e){}
		}
		else
		{
			parseReqRaw(req);
		}
	}
	
	function parseReqJSON(req)
	{
		for(var p in req.post)
		{
			if(req.post[p].indexOf && req.post[p].indexOf("{", 0) === 0)
			{
				try
				{
					var tmpJ = JSON.parse(req.post[p]);
					req.post[p] = tmpJ;
				}catch(e){ }
			}
		}
	}
	
	this.code = function(req, res)
	{
        req.post = {};
        if(req.method == "POST" || req.method == "PUT") 
        {
            if(req.postData !== undefined)
            {
				parseReqPost(req);
				// PARSE JSON
				parseReqJSON(req);
            }
		}
	};
}
