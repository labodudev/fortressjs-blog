var test;
var wf = WF();
test = require('../about.page.js');

var aboutPage = new test({});
aboutPage.view = {about:"About test, IP : _IP"};
aboutPage.code(wf.Emulate.req, wf.Emulate.res);
