module.exports = blogPage;

function blogPage()
{
    this.code = function(req, res)
    {
        res.end(this.view.blog);
    };
}