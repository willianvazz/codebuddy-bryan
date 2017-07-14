import { Courses } from '../lib/collections.js';

Meteor.publish('users', function(){
	if(Roles.userIsInRole(this.userId, 'admin')){		
		return Meteor.users.find({});
	}
});
//publishing courses
Meteor.publish('courses', function(){
	var user = Meteor.users.findOne({ _id: this.userId });
	return Courses.find({
		$or: [{ 
				students: {
					$elemMatch: {
						username: user.username
					}
				} 
			},
			{ 
				professor: user.username 
			}]
	});
});

Meteor.publish("userStatus", function() {
	if(Roles.userIsInRole(this.userId, 'admin')){
  		return Meteor.users.find({ "status.online": true });
	}
});