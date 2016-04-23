/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/

/******************************* MOD UTILS ******************************/
UTILS.LoadMod = function(req, res, v)
{
    var view = req.HOST.ZONES[req.zone].MODS[req.modPath][req.mod].view;
    if(view[v] !== undefined)
    {
      res.tpl.inner += view[v];
    }
};
UTILS.GetModView = function(req, res, v)
{
    var view = req.HOST.ZONES[req.zone].MODS[req.modPath][req.mod].view;
    if(view[v] !== undefined)
    {
      return view[v];
    }
};
UTILS.EndMod = function(req, res, v)
{
    if(req.HOST.ZONES[req.zone].MODS[req.modPath][req.mod].view[v] !== undefined)
    {
      res.end(req.HOST.ZONES[req.zone].MODS[req.modPath][req.mod].view[v]);
    }
    else res.end("Undefined view");
};
/****************************************************************************/