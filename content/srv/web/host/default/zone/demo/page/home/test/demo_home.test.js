var test;
test = require('../home.page.js');

var homePage = new test({});
homePage.view = {home:"Home test"};
homePage.code(Emulate.req, Emulate.res);
