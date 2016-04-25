var test;
var wf = WF();
test = require('../article.app.js');

var articleTest = new test({});
articleTest.code(wf.Emulate.req, wf.Emulate.res);
