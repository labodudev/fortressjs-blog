/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.CreatePage = CreatePage;
module.exports.AddPage = addPage;
UTILS.AddPage = addPage;
var wf = WF();

function addPage(req, res)
{
  if(!req.zone || !req.page) return;
  var page = req.HOST.ZONES[req.zone].PAGES[req.page];
  var exec = UTILS.Clone(page.exec);
  if(exec.code) exec.code(req, res);
}

function CreatePage(p, n)
{
	var page = new wf.PageClass.Page(p, n);
	return page;
}

/******************************* PAGE UTILS ******************************/
UTILS.Load = function(req, res, v)
{
    var view = req.HOST.ZONES[req.zone].PAGES[req.page].view;
    if(view[v] !== undefined)
    {
      res.tpl.inner += view[v];
    }
};
UTILS.GetView = function(req, res, v)
{
    var view = req.HOST.ZONES[req.zone].PAGES[req.page].view;
    if(view[v] !== undefined)
    {
      return view[v];
    }
};
UTILS.End = function(req, res, v)
{
    if(req.HOST.ZONES[req.zone].PAGES[req.page].view[v] !== undefined)
    {
      res.end(req.HOST.ZONES[req.zone].PAGES[req.page].view[v]);
    }
    else res.end("Undefined view");
};
/****************************************************************************/