//redirect user when logging in
var myLoginFunction = function(){
    FlowRouter.go('/mycourses');
}
//redirect user when logging out
var myLogoutFunction = function(){
    FlowRouter.go('/');
}
//Setting up some field text for login and signup messages
AccountsTemplates.configure({
    texts: {
      title: {
        signIn: "Welcome to CodeBuddy",
        signUp: "Create your CodeBuddy Account",
      }
    },
    onSubmitHook: myLoginFunction,
    onLogoutHook: myLogoutFunction,
});

//Had to remove form fields here and add them again so it showed in the right order!
AccountsTemplates.removeField('email');
AccountsTemplates.removeField('password');

//adding fields to the login form
AccountsTemplates.addFields([
    {
        _id: 'first_Name',
        type: 'text',
        displayName: 'First Name',
        required: true,
    },
    {
        _id: 'last_Name',
        type: 'text',
        displayName: 'Last Name',
        required: true,
    },
    {
        _id: 'email',
        type: 'email',
        required: true,
        displayName: "email",
        re: /.+@(.+){2,}\.(.+){2,}/,
        errStr: 'Invalid email',
    },
    {
      _id: "username",
      type: "text",
      displayName: "Username (same as your RIT account)",
      required: true,
      minLength: 4,
    },
    {
        _id: 'password',
        type: 'password',
        placeholder: {
            signUp: "At least six characters"
        },
        required: true,
        minLength: 6,
        re: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        errStr: 'At least 1 digit, 1 lowercase and 1 uppercase',
    }
]);