const validate_name = (name) => {return name}

const validate_email = (email) => {
	const num_of_at = (email.match(/@/g) || []).length;
	const at_position = email.indexOf('@');
	const dot_position = email.indexOf('.', at_position);

	return !(num_of_at !== 1 || dot_position < 1)
}

const validate_password = (password) => {return password.length >= 6}

const validate_register_fields = (name, email, password) =>{
	return validate_name(name) && 
		   validate_email(email) && 
		   validate_password(password);
}

const validate_signin_fields = (email, password) =>{
	return validate_email(email) && 
		   validate_password(password);
}



module.exports = {
	validate_register_fields,
	validate_signin_fields
}