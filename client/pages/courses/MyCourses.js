import { Courses } from '../../../lib/collections.js';

Template.MyCourses.onCreated(function() {
    Meteor.subscribe('courses');
    this.filterCourses = new ReactiveVar( '' )
});

Template.MyCourses.helpers({
    //returns the list of course of that user
    courses() {
        var courses = Courses.find({ 'name': { '$regex': Template.instance().filterCourses.get()}});
        if (courses) {
            // return courses.reverse();
            return courses;
        } 
    }
});

Template.MyCourses.events({
	//event to filter user when a key is pressed
	'keyup .search-input'(event, template){
		event.preventDefault();

		template.filterCourses.set('.*' + $('.search-input').val() + '.*');
	}
});