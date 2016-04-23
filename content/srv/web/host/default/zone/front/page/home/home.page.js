module.exports = homePage;

function homePage(ok)
{
    this.code = function(req, res)
    {
        res.end(this.view.home);
    };
}