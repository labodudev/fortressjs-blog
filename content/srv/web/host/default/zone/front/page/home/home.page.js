module.exports = homePage;

function homePage()
{
    this.code = function(req, res)
    {

        res.end(this.view['home']);

    }
}