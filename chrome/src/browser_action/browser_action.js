Firebase.enableLogging(true);

var myFirebaseRef = new Firebase("https://glaring-fire-3108.firebaseio.com/");

usersRef = myFirebaseRef.child('users')

usersRef.push({
	email: "nathan.gould@gmail.com",
	first_name: "Nathan",
	last_name: "Gould"
});
