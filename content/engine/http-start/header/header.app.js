module.exports.Header = new Header();

function Header()
{
    this.code = function(req, res)
    {
        res.setHeader('Server', 'SerIOS/0.2');
        res.setHeader('X-Powered-By', 'CoreFortress/0.2');
    }
}
