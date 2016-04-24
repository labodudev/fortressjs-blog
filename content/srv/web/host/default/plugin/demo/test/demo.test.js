var test;
var wf = WF();
test = require('../demo.app.js');

var demoTest = new test({});
demoTest.code(wf.Emulate.req, wf.Emulate.res);
