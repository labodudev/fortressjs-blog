var test;
var wf = WF();
test = require('../api.app.js');

var apiTest = new test({});
apiTest.code(wf.Emulate.req, wf.Emulate.res);

console.log('[+] PLUGIN API OK');
