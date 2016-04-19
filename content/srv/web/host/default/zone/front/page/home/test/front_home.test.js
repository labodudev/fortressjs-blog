var test;
var wf = WF();
test = require('../home.page.js');

var homePage = new test({});
homePage.view = {home:"Home test"};
homePage.code(wf.Emulate.req, wf.Emulate.res);
