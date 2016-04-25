module.exports = homePage;

function homePage(ok)
{
    this.code = function(req, res)
    {
        var view = this.view.home;
        res.end(view);
    };
}
