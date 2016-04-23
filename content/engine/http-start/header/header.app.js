/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports = Header;

function Header()
{
    this.code = function(req, res)
    {
        res.setHeader('Server', 'CoreFortress/0.0.5');
        res.setHeader('X-Powered-By', 'FortressJS/0.0.5');
    };
}
