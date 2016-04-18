module.exports = account;

function account(empty)
{
	this.collection = "account";
	this.rest = true;
	this.PUT = true;
    this.GET = true;
	this.POST = false;
	this.DELETE = false;

	
	this.sanitize = 
	{
		_id: null,
		password: null,
	}
    
    
    this.access = function(req, res)
    {
        // ADD LOGIN SCHEMA HERE
        if(req.userRight && req.apiUser)
        {
            if(req.post && req.post.query)
                req.post.query.account_key = req.apiUser.account_key;
            if(req.get)
            {
                req.get.query = {};
                req.get.query.account_key = req.apiUser.account_key;
            }
            return true;
        }
        return false;
    }
	
	this.field =
	{

        storage:
        {
            private: true,  
        },
        bandwith:
        {
            private: true,
        },
        account_key:
        {
            
        },
		email:
		{
			unique: true,
            validator: function(data) 
			{
				var validEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				return validEmail.test(data);
			},
		},
		
		password:
		{
            validator: function(data)
			{
				// at least one number, one lowercase and one uppercase letter
				// at least height characters
				var validPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
				return validPass.test(data); 
			},
			modifier: function(data) { return UTILS.Crypto.createSHA512(data); },
		},

	};

  // CALL MODEL CLASS
	UTILS.Model.apply(this, new Array(empty));

}
