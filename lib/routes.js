//when user logs in redirect to myclasses
Accounts.onLogin(function(){
	// FlowRouter.go('mycourses');
});

//if the user is not logged in redirect to the homepage
FlowRouter.triggers.enter( [ function( context, redirect ){
	if(!Meteor.userId()){
		FlowRouter.go('home');
	}
} ] );

FlowRouter.route('/', {
	name: 'home',
	action(){
		//if the user is already logged in and access the homepage will be redirected to the intro
		if(Meteor.userId()){
			FlowRouter.go('mycourses');
		}
		BlazeLayout.render('LoginLayout');
	}
});

FlowRouter.route('/admin', {
	name: 'admin',
	action() {
		BlazeLayout.render("AppLayout", {main: "Admin"});
	}
});

FlowRouter.route('/mycourses', {
	name: 'mycourses',
	action() {
		BlazeLayout.render("AppLayout", {main: "MyCourses"});
	}
});

FlowRouter.route('/whoisonline', {
	name: 'whoisonline',
	action() {
		BlazeLayout.render("AppLayout", {main: "WhoIsOnline"});
	}
});

FlowRouter.route('/addcourse', {
	name: 'addcourse',
	action() {
		BlazeLayout.render("AppLayout", {main: "AddCourse"});
	}
});

FlowRouter.route('/course/:slug', {
	name: 'course',
	action() {
		BlazeLayout.render("AppLayout", {main: "Course"});
	}
});

FlowRouter.route('/edit/:slug', {
	name: 'editcourse',
	action() {
		BlazeLayout.render("AppLayout", {main: "EditCourse"});
	}
});
