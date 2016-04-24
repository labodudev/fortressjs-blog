function demo()
{
	this.code = function(req, res)
	{
		console.log("[+] In demo plugin");
	};
}
module.exports = demo;
