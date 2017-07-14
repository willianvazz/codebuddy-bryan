import { Courses } from '../../../lib/collections.js';

Template.AddCourse.onCreated(function() {
    Meteor.subscribe('users');
    Meteor.subscribe('courses');
    this.students = new ReactiveVar([]);
    this.courseId = new ReactiveVar(null);
});

Template.AddCourse.helpers({

    students(){
        return Template.instance().students.get();
    },
    course(){
        return Template.instance().courseId.get();
    }
});

Template.AddCourse.events({
    //retuns a parsed object with the csv information
    'change .upload-csv'(event, template) {
        var count = 0;
        Papa.parse( event.target.files[0], {
            header: true,
            complete(results, file) {
                results.data.forEach(function(data) {
                        addStudent(template, data.Username);
                });
            },
            error(error, file){
                console.log(error);
            }
        });
    },
    //preventing form submition when enter is pressed
    'keydown .add-course'(event, template){
		//prevent defaut browser form submit
        if (event.keyCode == 13) {
		    event.preventDefault();
            return false;
        }
	},
    //adding a student to the table when enter is pressed
    'keyup .search-input'(event, template){
		event.preventDefault();

        if (event.keyCode == 13) {
            addStudent(template, $('.search-input').val());
            $('.search-input').val('');                        
        }        
	},
    //remove student from the table
	'click .remove-student'(event, template){
        var newStudents = template.students.get().filter(function(student) {
            return student.username !== event.target.getAttribute('data-id');
        });
        template.students.set(newStudents);
	},
    //adding form to the database    
    'submit .add-course'(event, template) {
        event.preventDefault();
    
        const target = event.target;
        
        var course = {
            create_date: new Date(), 
            name: target.name.value,
            semester: target.semester.value,
            year: target.year.value,
            professor: Meteor.user().username,
            students: [],
            days: [],
            chat: false,
            messages: [],
            code_snippets: []
        };
        //validating form before inserting
       if (validateForm()){
            Meteor.call('courses.insert', course, template.students.get(), function(error, result) {
                template.courseId.set(result);
            });            
            $("#course-added-message").fadeIn(1000);
            $("#course-added-message").fadeOut(4000);
            target.name.value = '';
            target.semester.value = 'Spring';
            target.year.value = '';
            template.students.set([]);
       }
    },
    //helper text for csv file
    'mouseenter #csv-helper'(){
        // document.getElementById('csv-helper-text').style.display = 'block';
        $("#csv-helper-text").fadeIn(1000);
    },
    //helper text for csv file
    'mouseleave #csv-helper'(){
        // document.getElementById('csv-helper-text').style.display = 'none';
        $("#csv-helper-text").fadeOut(1000);
    },
    //redirect user to the course that was inserted
    'click .btn-go-to-course'(event, template){
        FlowRouter.go('course', { slug: Courses.findOne({ _id: template.courseId.get() }).slug });
    }
});

//Check to see if fields are not empty
function validateForm(){
    var courseName = document.getElementById("name").value,
        courseYear = document.getElementById("year").value;
    
    if(courseName === ""){
        document.getElementById("nameValidation").style.display = block;
        return false;
    }
    if(courseYear === ""){
        document.getElementById("yearValidation").style.display = block;
        return false;
    }

    return true;
}

//add student to the reactive var to be displayed in the table
//if student is registered in the system his/her name will be displayed
//otherwise 'Student not registered yet' will be displayed
function addStudent(template, username){
    var user = Meteor.users.findOne({ 'username': username });
    if (user) {
        var student = {
            name: user.profile.first_Name + ' ' + user.profile.last_Name,
            username: user.username
        }
    }
    else {
        var student = {
            name: 'Student not registered yet',
            username: username
        }
    }
    var newStudents = template.students.get();
    newStudents.push(student);
    template.students.set(newStudents);
}