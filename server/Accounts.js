var postSignUp = function(userId, info){
	Roles.addUsersToRoles(userId, ['student']);
}

AccountsTemplates.configure({
	postSignUpHook: postSignUp,
});