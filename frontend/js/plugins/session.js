/**
 * React components: Entities list (left menu).
 *
 * @author: Daniele Gazzelloni / daniele@danielegazzelloni.com
 * @created: 22/10/2015
 **/


$(document).ready(function () {

  // Check for user token
  var user = JSON.parse(sessionStorage.getItem("user"));

  // No user found: login required
  if (window.location.href.indexOf("signup.html") < 0) {
    if (user == null && window.location.href.indexOf("login.html") < 0) {
      window.location.replace("login.html");
    }
  }


  $('#loginForm').submit(function (event) {

    if (!$('#loginForm')[0].checkValidity()) {
      return true;
    }

    event.preventDefault();

    var formData = {
      email: $('#loginForm-email').val(),
      password: $('#loginForm-password').val()
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.email && formData.password) {
      $.ajax({
        type: 'POST',
        url: "api/v1/user/login",
        data: formData,
        dataType: 'json',

        beforeSend: function () {
          $('#loginResult').html("<strong>Logging in...</strong>");
        },

        error: function (res) {
          $('#loginResult').html("<strong>Invalid email or password</strong>");
        },

        success: function (res) {
          //console.log(res);
          if (res !== undefined) {
            sessionStorage.setItem('user', JSON.stringify(res));
            window.location.replace("index.html");
          }
        }

      });

    }

  });


  $('#signupForm').click(function (event) {
    event.preventDefault();
    console.log('Inside signupForm');
    if (!$('#signupForm')[0].checkValidity()) {
      return true;
    }

    var formData = {
      name: $('#signupForm-name').val(),
      age: $('#signupForm-age').val(),
      email: $('#signupForm-email').val(),
      password: $('#signupForm-password').val()
    };

    // Otherwise the HTML5 validation will just do the job for us
    if (formData.email && formData.password) {
      console.log('START AJAX CALL');
      $.ajax({
        type: 'POST',
        url: "/api/v1/user/signup",
        data: formData,
        dataType: 'json',

        beforeSend: function () {
          $('#signupResult').html("<strong>Creating user account...</strong>");
        },

        error: function (res, error, message, messageText) {
          //console.log(res);
          //console.log(res.responseJSON.error.message);
          var text = 'Error while signing in';
          if (res.responseJSON.error.message !== undefined) {
            text = res.responseJSON.error.message;
          }
          $('#signupResult').html("<strong>" + text + "</strong>");
        },

        success: function (res) {
          if (res.id !== undefined) {
            $.ajax({
              type: 'POST',
              url: "/api/v1/user/login",
              data: {
                email: formData.email,
                password: formData.password
              },
              dataType: 'json',

              beforeSend: function () {
                $('#signupResult').html("<strong>Logging in...</strong>");
              },

              error: function (res) {
                $('#signupResult').html("<strong>Invalid email or password</strong>");
              },

              success: function (res) {
                //console.log(res);
                if (res !== undefined) {
                  sessionStorage.setItem('user', JSON.stringify(res));
                  window.location.replace("index.html");
                }
              }

            });
          }
        }

      });

    }

  });

  // if the key 'user' is removed from the localStorage
  // then redirect the users to login page
  $(window).bind('storage', function (e) {
    // check if the originalEvent key is 'user'
    if(e.originalEvent.key==='user'){
      if(e.originalEvent.newValue === null){
        if (window.location.href.indexOf("login.html")===-1) {
          window.location.replace("login.html");
        }
      }
    }
    else{
      console.log(e.originalEvent.key, e.originalEvent.newValue);
    }
  });

  // this event is also checks the value of 'user' is null or not
  // if it is null then it takes the user to login page
  $('#app-mount-point').on('click',function(e){
    var user = JSON.parse(sessionStorage.getItem('user'));
    if(user===null){
      window.location.replace("login.html");
    }
    else{
      // check for field names
      if(!user.hasOwnProperty('email')
        || !user.hasOwnProperty('name')
        || !user.hasOwnProperty('token')){
        console.log('user data is invalid!');
        // may be some user or hacker may changing this value manually
        // redirect the user to login page
        window.location.replace("login.html");
      }
    }
  });

});
