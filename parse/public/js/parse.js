Parse.$ = jQuery;

// Initialize Parse with your Parse application javascript keys
Parse.initialize("8fhsO5d7WTt6c7ffpVrPpHTVvuAi6vArrciyt8cK", 
  "1GHMsEbKTKr7ZhLqcJUPcOJdi7CLD1YZeT4hGuEv");

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "https://connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


  // set up Facebook
// facebook API
 
 logOut = function(e) {
   Parse.User.logOut();
   location.reload();
 }
