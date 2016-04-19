var test;
test = require('../about.page.js');

var aboutPage = new test({});
aboutPage.view = {about:"About test, IP : _IP"};
aboutPage.code(Emulate.req, Emulate.res);
