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
facebookLogIn = function() {
    Parse.FacebookUtils.init({
      appId      : '438605306303003',
      xfbml      : true,
      version    : 'v2.3'
    });
    
    console.log("something");

    Parse.FacebookUtils.logIn(null, {
        success: function(user) {
            if (!user.existed()) {
                console.log("!");
            } else {
                console.log("User logged in through Facebook!");
                location.reload();
            }
        },
        error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
        }
    });
 }
 
 logOut = function(e) {
   Parse.User.logOut();
   location.reload();
 }
