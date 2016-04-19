module.exports.Emulate = new Emulate();

function Emulate()
{
	
	this.res = 
	{
		end: function(writable){ console.log("[+] res.end -> " + writable) },
	}
	
	this.req = 
	{
		url: "/test",
		method: "GET",
	}
	
}