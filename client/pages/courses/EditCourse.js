import { Courses } from '../../../lib/collections.js';

Template.EditCourse.onCreated(function() {
    Meteor.subscribe('courses');
    Meteor.subscribe('users');
    this.students = new ReactiveVar([]);
    this.courseSlug = new ReactiveVar();
});

Template.EditCourse.helpers({
    course() {
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course){
            Template.instance().students.set(course.students);
        }
        return course;
    },
    students() {
        return Template.instance().students.get();
    },
    courseURL(){
        console.log(FlowRouter.getParam("slug"));
    }
});

Template.EditCourse.events({
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
    'keydown .edit-course'(event, template){
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
    //updating form in the database 
    'submit .edit-course'(event, template) {
        event.preventDefault();
    
        const target = event.target;
        var course = {
            id: target.name.getAttribute('data-id'),
            name: target.name.value,
            semester: target.semester.value,
            year: target.year.value
        };
        
       if (validateForm()){
           console.log('here');
            Meteor.call('courses.update', course, Template.instance().students.get());
            $("#course-added-message").fadeIn(2000);
            $("#course-added-message").fadeOut(4000);
            FlowRouter.go('editcourse', { slug: Courses.findOne({ _id: course.id }).slug });
       }
    },
	'click .btn-back'(event, template){
        FlowRouter.go('mycourses');
	},
    //delete course
	'click .btn-delete'(event, template){
        swal({
            title: "Are you sure you want to delete the course?",
            text: "You will not be able to recover your course!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function(){
            swal("Deleted!", "Your course has been deleted.", "success");
            Meteor.call('courses.remove', event.target.getAttribute('data-id'));
            FlowRouter.go('mycourses');
        });
	},
    //helper text for csv file
    'mouseenter #csv-helper'(){
        // document.getElementById('csv-helper-text').style.display = 'block';
        $("#csv-helper-text").fadeIn(1000);
    },
    'mouseleave #csv-helper'(){
        // document.getElementById('csv-helper-text').style.display = 'none';
        $("#csv-helper-text").fadeOut(1000);
    },
});

//check if the fields in the form have been filled
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
