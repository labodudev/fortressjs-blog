module.exports = aboutPage;

function aboutPage()
{
    this.code = function(req, res)
    {
		var view = this.view.about;
		view = view.replace('_IP', req.connection.remoteAddress);
        res.end(view);
    };
}