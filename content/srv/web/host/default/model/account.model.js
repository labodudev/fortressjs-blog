module.exports = account;

function account(empty)
{
	this.collection = "account";
	this.rest = true;

	this.sanitize = 
	{
		_id: null, // Hide _id 
		password: null, // Hide password
	};
    
    this.access = function(req, res)
    {
        // ADD LOGIN SCHEMA HERE
		// return false OR true
        return true;
    };
	
	this.field =
	{
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
