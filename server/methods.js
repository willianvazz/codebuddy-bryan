import { Courses } from '../lib/collections.js';
import { check } from 'meteor/check';

Meteor.methods({
	//toggle admin in the admin page
	'toggleAdmin'(id){
		if (Roles.userIsInRole(id, 'admin')){
			Roles.removeUsersFromRoles(id, 'admin');
		}else{
			Roles.addUsersToRoles(id, 'admin');
		}
	},
	//insert a new course in the system
	'courses.insert'(course, students) {
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(course.name) && validadeField(course.semester) && validadeField(course.year)){
			check(course.name, String);
			check(course.semester, String);
			var courseId = Courses.insert(course);
			updateStudentsList(courseId, students);
			return courseId;
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//update a course in the system
	'courses.update'(course, students){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(course.name) && validadeField(course.semester) && validadeField(course.year)){
			check(course.name, String);
			check(course.semester, String);
			Courses.update(
				{_id: course.id}, 
				{
					$set: {
						name: course.name,
						semester: course.semester,
						year: course.year,
						students: []
					}
				}
			);
			updateStudentsList(course.id, students);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//remove a course in the system
	'courses.remove'(courseId){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		Courses.remove({_id: courseId});
	},
	//add a day within a specific course
	'courses.addDay'(courseSlug, day){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(day)){
			check(day.title, String);
			Courses.update(
				{slug: courseSlug}, 
				{
					$push: { 
						days: day
					}
				}
			);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//update a day within a specific course
	'courses.updateDay'(courseSlug, day){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(day)){
			check(day.title, String);
			Courses.update(
				{slug: courseSlug, "days.index": day.index},
				{
					$set: { 
						"days.$.title": day.title
					}
				}
			);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//remove a day within a specific course
	'courses.removeDay'(courseSlug, day){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(day)){
			Courses.update(
				{slug: courseSlug},
				{
					$pull: { 
						days: { index: day.index },
						code_snippets: { day: day.index }
					}
				}
			);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//add message within a specific course
	'courses.addMessage'(courseSlug, message){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		check(message.text, String);
		Courses.update(
			{slug: courseSlug}, 
			{
				$push: { 
					messages: message
				}
			}
		);
	},
	//add a snippet of code within a specific course
	'courses.addCode'(courseSlug, code){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		check(code.title, String);
		check(code.code, String);
		Courses.update(
			{slug: courseSlug}, 
			{
				$push: { 
					code_snippets: code
				}
			}
		);
	},
	//update a snippet of code within a specific course
	'courses.updateCode'(courseSlug, code){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(code)){
			check(code.title, String);
			check(code.code, String);
			Courses.update(
				{slug: courseSlug, "code_snippets.id": code.id},
				{
					$set: { 
						"code_snippets.$.title": code.title,
						"code_snippets.$.code": code.code
					}
				}
			);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//remove a snippet of code within a specific course
	'courses.removeCode'(courseSlug, code){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		if (validadeField(code)){
			Courses.update(
				{slug: courseSlug},
				{
					$pull: { 
						code_snippets: { id: code.id }
					}
				}
			);
		}else{
			throw new Meteor.Error('Invalid information');
		}
	},
	//turn on and off chat within a specific course
	'courses.toggleChat'(courseSlug, value){
		if (! this.userId) {
			throw new Meteor.Error('unauthorized');
		}
		Courses.update(
			{slug: courseSlug}, 
			{
				$set: { chat: value }
			}
		);
	}
});
//function to update the list of students in a course
function updateStudentsList(courseId, students) {
	Courses.update(
		{_id: courseId}, 
		{
			$addToSet: { 
				students: {	
					$each: students
				}
			}
		}
	);
}
//function to check if the field coming from the client is not empty
function validadeField(field){
	if(field == ''){
		return false;
	}
	return true
}
//function to strip tags from a string
function stripTags(field){
	var stripTag = field.replace(/(<([^>]+)>)/ig,"");
	return stripTag;
}