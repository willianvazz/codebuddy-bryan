Template.WhoIsOnline.onCreated(function(){
	Meteor.subscribe('userStatus');
});

Template.WhoIsOnline.helpers({
	onlineUsers(){
		//retrieving all users online but myself
        console.log(Meteor.users.find({ "status.online": true }));
		return Meteor.users.find({ "status.online": true });
		// return Meteor.users.find({ 
		// 				"status.online": true, 
		// 				_id: { $ne: Meteor.userId() },
		// 				matchId: null
		// });
	}
});