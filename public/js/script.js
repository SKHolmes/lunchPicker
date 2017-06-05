(function(){

	//Initialise Firebase
	const config = {
		apiKey: "AIzaSyCOUlE05sODroBfsNyLxsh40JkWHPFZ58E",
		authDomain: "transform8-8840f.firebaseapp.com",
		databaseURL: "https://transform8-8840f.firebaseio.com",
		projectId: "transform8-8840f",
		storageBucket: "transform8-8840f.appspot.com",
		messagingSenderId: "903581469141"
	};

	firebase.initializeApp(config);

	//Add elements
	const emailTxt = document.getElementById("email-textbox");
	const passTxt = document.getElementById("password-textbox");
	const loginBtn = document.getElementById("login-btn");
	const toast = document.getElementById("snackbar");


	//Add login event
	loginBtn.addEventListener('click', e => {
		if(firebase.auth().currentUser){
			firebase.auth().signOut();
		}else{
		//Get email and password
		const email = emailTxt.value;
		const pass = passTxt.value;
		const auth = firebase.auth();
		//Sign in
		const promise = auth.signInWithEmailAndPassword(email, pass);
		//Catch anything that goes wrong with the sign in and display it.
		promise.catch(e => popup(e.message));
	}
});

	//Add a realtime listener
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			//Upon successfully logging in. Empty fields and change button, display login notification. Display buttons.
			loginBtn.innerHTML = "Log Out"
			emailTxt.value = "";
			passTxt.value = "";
			popup("Logged in");
			$(".collapse").collapse("show");
		}else{
			//Else we have just logged out so display notification.
			popup("Logged out");
			loginBtn.innerHTML = "Login"
			$(".collapse").collapse("hide");
		}

	});

	function popup(message){
		toast.innerHTML = message;
		toast.className = "show";
		setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
	};

}());