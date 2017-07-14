import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin.onCreated(function(){
	Meteor.subscribe('users');
	this.filterUsers = new ReactiveVar( '' )
});

Template.Admin.helpers({
	//returns users based on the search input field
	getUsers(){
		return Meteor.users.find({ 'username': { '$regex': Template.instance().filterUsers.get()}});
	},
	//check if user is in role admin
	isAdmin(){
		return Roles.userIsInRole(this._id, 'admin');
	},
	//exclude current user and "super admin" toggle button
	currentUser(){
		return ((this._id === Meteor.userId()) || (this.username === 'admin'));
	}
});

Template.Admin.events({
	//event to filter user when a key is pressed
	'keyup .search-input'(event, template){
		event.preventDefault();

		template.filterUsers.set('.*' + $('.search-input').val() + '.*');
	},
	//event to toggle admin privilegies
	'click .toggle-admin'(){
		Meteor.call('toggleAdmin', this._id);
	}
});