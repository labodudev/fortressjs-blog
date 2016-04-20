/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.Launch = Launch;

var wf = WF();

function Launch(req, res)
{
      var app = req.app[req.loop];
      var env = {};
      if(!app.hooked)
      {
          req.SERVER = wf.SERVERS[req.srv];
      }
      if(app.exec.code)
      {
        app.exec.code(req, res);
      }
}

/******************************* APP VIEWS BUILDER **********************************/

global.loadView = function(req, res, v)
{
    if(req.app[req.loop].view[v] !== undefined)
    {
      res.tpl.inner += req.app[req.loop].view[v];
    }
};
global.getView = function(req, res, v)
{
    if(req.app[req.loop].view[v] !== undefined)
    {
      return req.app[req.loop].view[v];
    }
};
global.endView = function(req, res, v)
{
    req.continue = false;
    if(req.app[req.loop].view[v] !== undefined)
    {
      res.end(req.app[req.loop].view[v]);
    }
    else res.end("Undefined view");
};
/****************************************************************************/