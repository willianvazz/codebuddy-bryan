Template.MainNavigation.events({
	'click .logout'(){
		AccountsTemplates.logout();
	}
});

Template.MainNavigation.helpers({
	isSelected(){
		return FlowRouter.getRouteName();
	}
});