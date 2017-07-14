import { Courses } from '../../../lib/collections.js';

Template.Course.onCreated(function() {
    Meteor.subscribe('courses');
    Meteor.subscribe('users');
    Meteor.subscribe('userStatus');
    this.day = new ReactiveVar(0);
    this.snippet = new ReactiveVar(-1);
});

Template.Course.helpers({
    //get the course information 
    course() {
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course) {
            Template.instance().day.set(course.days.length-1);
        }
        return course;
    },
    //check if it is own message for the chat box
    ownMessage(username) {
        if (username === Meteor.user().username) {
            return true;
        }
        else {
            return false;
        }
    },
    //getting the selected day
    selected(dayIndex) {
        if (dayIndex === Template.instance().day.get()){
            return "selected";
        }
    },
    //getting current day information
    currentDay(){
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course){
            return course.days[Template.instance().day.get()];
        }        
    },
    //getting snippets of code for the selected day
    codeSnippets(){
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course){
            return course.code_snippets.filter(function(snippet) {
                return snippet.day === Template.instance().day.get();
            }).reverse();
        }
        else {
            return [{code: ''}];
        }    
    },
    editingSnippet(id){
        return parseInt(id) === parseInt(Template.instance().snippet.get());
    },
    //getting the list of days
    days(){
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course) {
            return course.days.reverse();
        }    
    },
    //getting chat on/off value
    toggleChat(){
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });
        if (course){
            return course.chat;
        }
    },
    //getting all online users
    onlineUsers(){
		var usersOnline = Meteor.users.find({ "status.online": true }).fetch();
        var course = Courses.findOne({ slug: FlowRouter.getParam("slug") });

        if (course){
            var usernames = []
            for(user in usersOnline){
                usernames.push(usersOnline[user].username)
            }
            return course.students.filter(function(student){
                if (usernames.indexOf(student.username) > 0) {
                    return student;
                }
            });
        }
	}
});

Template.Course.events({
    //displaying the field when add day is clicked
    'click .add-day'(){
        $("#add-day-form").fadeIn(10);
        document.getElementById("addDay").focus();
    },
    'click .day'(event, template){
        template.day.set(parseInt(event.target.getAttribute('data-pos')));
    },
    //adding day to the database
    'submit #add-day-form'(event){
        event.preventDefault();

        var courseSlug = FlowRouter.getParam("slug");
        var course = Courses.findOne({ slug: courseSlug });
        Meteor.call('courses.addDay', courseSlug,{
            title: event.target.addDay.value,
            index: course.days.length
        });

        event.target.addDay.value = '';
        $("#add-day-form").fadeOut(10);
    },
    //hidding field if escape key is pressed
    'keyup #addDay'(event){
        if(event.keyCode == 27){
            $("#add-day-form").fadeOut(10);
        }
    },
    'click .edit-day'(){
        $("#edit-day-form").fadeIn(10);
        document.getElementById("editDay").focus();
    },
    //saving edited day
    'submit #edit-day-form'(event, template){
        event.preventDefault();

        var courseSlug = FlowRouter.getParam("slug");
        Meteor.call('courses.updateDay', courseSlug, {
            title: event.target.editDay.value,
            index: template.day.get()
        });

        event.target.editDay.value = '';
        $("#edit-day-form").fadeOut(10);
    },
    //hidding field if escape key is pressed
    'keyup .edit-day'(event){
        if(event.keyCode == 27){
            $("#edit-day-form").fadeOut(10);
        }
    },
    //deleting day
    'click .delete-day'(event, template){
        //function to show confirmation message
        swal({
            title: "Are you sure you want to delete the lecture?",
            text: "You will not be able to recover your lecture!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function(){
            var courseSlug = FlowRouter.getParam("slug");
            Meteor.call('courses.removeDay', courseSlug, {
                index: template.day.get()
            });

            swal("Deleted!", "Your lecture has been deleted.", "success");
        });
    },
    //display add code form
    'click .add-code'(){
        $("#add-code-form-wrapper").fadeIn(10);
        document.getElementById("codeTitle").focus();
    },
    //closing form
    'click .fa-times'(){
        $("#add-code-form-wrapper").fadeOut(10);
    },
    //adding snipped to the selected day
    'submit #add-code-form'(event, template){
        event.preventDefault();
        
        var courseSlug = FlowRouter.getParam("slug");
        var course = Courses.findOne({ slug: courseSlug });
        Meteor.call('courses.addCode', courseSlug,{
            day: template.day.get(),
            title: event.target.codeTitle.value,
            code: event.target.code.value,
            id: course.code_snippets.length
        });

        event.target.codeTitle.value = '';
        event.target.code.value = '';
        $("#add-code-form-wrapper").fadeOut(10);
    },
    'click .fa-pencil'(event, template){
        template.snippet.set(event.target.getAttribute('data-id'));
    },
    //saving edited code
    'submit #edit-code-form'(event, template){
        event.preventDefault();
        
        var courseSlug = FlowRouter.getParam("slug");
        var course = Courses.findOne({ slug: courseSlug });
        Meteor.call('courses.updateCode', courseSlug,{
            title: event.target.codeTitle.value,
            code: event.target.code.value,
            id: parseInt(event.target.getAttribute('data-id'))
        });

        event.target.codeTitle.value = '';
        event.target.code.value = '';
        $("#edit-code-form-wrapper").fadeOut(10);
        template.snippet.set(!template.snippet.get());
    },
    'click .cancel'(event, template){
        template.snippet.set(-1);
    },
    //deleting code
    'click .delete-snippet'(event, template){
        //function to show confirmation message
        swal({
            title: "Are you sure you want to delete the code snippet?",
            text: "You will not be able to recover your code!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function(){
            var courseSlug = FlowRouter.getParam("slug");
            Meteor.call('courses.removeCode', courseSlug, {
                id: parseInt(event.target.getAttribute('data-id'))
            });

            swal("Deleted!", "Your code snippet has been deleted.", "success");
            template.snippet.set(!template.snippet.get());
        });        
    },
    //adding a new message
    'submit #new-message-form'(event, template){
        event.preventDefault();
        
        var courseSlug = FlowRouter.getParam("slug");
        Meteor.call('courses.addMessage', courseSlug,{
            create_date: new Date(),
            username: Meteor.user().username,
            first_name: Meteor.user().profile.first_Name,
            day: template.day.get(),
            text: event.target.message.value
        });

        event.target.message.value = '';
    },
    //on/off chat switch
    'click .switch'(event){
        event.preventDefault();
        
        var courseSlug = FlowRouter.getParam("slug");
        var current = document.getElementById("toggle-chat").checked;        

        Meteor.call('courses.toggleChat', courseSlug, !current );
    },
    //show chat
    'click #chat-toggle'(){
        $("#people").fadeOut(10);
        $("#chat").fadeIn(10);
    },
    //show people online
    'click #people-toggle'(){
        $("#chat").fadeOut(10);
        $("#people").fadeIn(10);
    },
    //showing helper text for chat
    'mouseenter #chat-toggle'(){
        $("#chat-helper-text").fadeIn(1000);
    },
    //hidding helper text for chat
    'mouseleave #chat-toggle'(){
        $("#chat-helper-text").fadeOut(1000);
    },
    //showing helper text for people
    'mouseenter #people-toggle'(){
        $("#people-helper-text").fadeIn(1000);
    },
    //hidding helper text for people
    'mouseleave #people-toggle'(){
        $("#people-helper-text").fadeOut(1000);
    },
});