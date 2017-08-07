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
	const clientButton = document.getElementById("clients-button");
	const logButton = document.getElementById("client-log-button");
	const workoutButton = document.getElementById("workout-button");
	const pushButton = document.getElementById("push-button");

	//Master View Enum
	var MasterViews = {
		NONE: 0,
		CLIENT_INFO: 1,
		CLIENT_LOGS: 2,
		NEW_WORKOUT: 3,
		PUSH_NOTIFICATION: 4
	};
	var currentMView = MasterViews.NONE;

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
			$("#main-collapse-container").collapse("show");
		}else{
			//Else we have just logged out so display notification.
			firebase.auth().signOut().then(function(){
				loginBtn.innerHTML = "Login"
				popup("Logged out");
			}).catch(function(error){
				popup(error);
			});
			$("#main-collapse-container").collapse("hide");
		}

	});

	//Function which displays a message at the bottom of the screen
	function popup(message){
		toast.innerHTML = message;
		toast.className = "show";
		setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
	};

	clientButton.addEventListener('click', e => {
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			if(currentMView != MasterViews.CLIENT_INFO){
				clearCollapse();
				currentMView = MasterViews.CLIENT_INFO;
				var clientNames = [];
				var rootQuery = firebase.database().ref("/Clients/").orderByKey();
				rootQuery.once("value")
				.then(function(snapshot){
					snapshot.forEach(function(childSnapshot){
						clientNames.push(childSnapshot.key);
					});
					populateClientCollapse(clientNames);
				});
			}
			
		}else{
			popup("You are not logged in and cannot access this functionality.");
		}
	});

	logButton.addEventListener('click', e => {
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			if(currentMView != MasterViews.CLIENT_LOGS){
				clearCollapse();
				currentMView = MasterViews.CLIENT_LOGS;
				//TODO: Set up nodes to view client logs(i.e. Buttons)
			}
		}
	});

	workoutButton.addEventListener('click', e => {
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			if(currentMView != MasterViews.NEW_WORKOUT){
				clearCollapse();
				currentMView = MasterViews.NEW_WORKOUT;
				//TODO: Set up fields to push new Workout to devices.
			}
		}
	});

	pushButton.addEventListener('click', e => {
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			if(currentMView != MasterViews.PUSH_NOTIFICATION){
				clearCollapse();
				currentMView = MasterViews.PUSH_NOTIFICATION;
				//TODO: Set up fields to push a simple message to devices.
			}
		}
	});

	function populateClientCollapse(clientNames){
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			var left = document.getElementById("left-col1");
			var right = document.getElementById("right-col1");
			for (var i = 0; i < clientNames.length; i+=2) {
				var newBtn = document.createElement("button");
				newBtn.className = "btn btn-success";
				newBtn.innerHTML = clientNames[i];
				newBtn.addEventListener("click", displayClientInfo);
				left.appendChild(newBtn);
			}
			for (var i = 1; i < clientNames.length; i+=2) {
				var newBtn = document.createElement("button");
				newBtn.className = "btn btn-primary";
				newBtn.innerHTML = clientNames[i];
				newBtn.addEventListener("click", displayClientInfo);
				right.appendChild(newBtn);
			}
			$("#secondary-collapse-container").collapse("show");
		}else{
			popup("You are not logged in and cannot access this functionality.");
		}
	}

	function displayClientInfo(e){
		//Ensure authentication
		var user = firebase.auth().currentUser;
		if(user != null){
			var left = document.getElementById("left-col2");
			var right = document.getElementById("right-col2");
			var row = document.getElementById("tertiary-collapse-container");
			var Query = firebase.database().ref("/Clients/" + e.target.innerHTML).orderByKey();
			Query.once("value")
			.then(function(snapshot){
				clearCollapse();
				snapshot.forEach(function(childSnapshot){
					switch(childSnapshot.key) {

						case "email":
						var email = document.createElement("p");
						email.innerHTML = "Email:";
						email.className = "info";
						var emailValue = document.createElement("p");
						emailValue.innerHTML = childSnapshot.val();	
						emailValue.className = "info";					
						left.appendChild(email);
						right.appendChild(emailValue);
						break;

						case "full-name":
						var fullName = document.createElement("p");
						fullName.innerHTML = "Full Name:";
						fullName.className = "info";
						var fullNameValue = document.createElement("p");
						fullNameValue.className = "info";
						fullNameValue.innerHTML = childSnapshot.val();
						left.appendChild(fullName);
						right.appendChild(fullNameValue);
						break;

						case "number":
						var number = document.createElement("p");
						number.innerHTML = "Contact Number:";
						number.className = "info";
						var numberValue = document.createElement("p");
						numberValue.className = "info";
						numberValue.innerHTML = childSnapshot.val();
						left.appendChild(number);
						right.appendChild(numberValue);
						break;

						case "weight":
						var weight = document.createElement("p");
						weight.innerHTML = "Weight:";
						weight.className = "info";
						var weightValue = document.createElement("p");
						weightValue.className = "info";
						weightValue.innerHTML = childSnapshot.val() + "Kgs";
						left.appendChild(weight);
						right.appendChild(weightValue);
						break;

						default:
						console.log("New data type unaccounted for in switch statement: '" + childSnapshot.key + "'.");
					}
					
				});
				//TODO add client log button here.
				var btn = document.createElement("button");
				btn.setAttribute("id", "food-log-button");
				btn.className = "btn btn-info food-log";
				btn.innerHTML = "View Food Log";
				//row.appendChild(btn);
				document.getElementById("tertiary-collapse-container").appendChild(btn);
				$("#tertiary-collapse-container").collapse("show");	
			});

		}else{
			popup("You are not logged in and cannot access this functionality.");
		}
	}



	function clearCollapse(){

		var left = document.getElementById("left-col2");
		var right = document.getElementById("right-col2");
		var row = document.getElementById("tertiary-collapse-container");
		while(left.firstChild){
			left.removeChild(left.firstChild);
		}
		while(right.firstChild){
			right.removeChild(right.firstChild);
		}
		var toRemove = document.getElementById("food-log-button")
		if(toRemove){
			row.removeChild(toRemove);
		}

	}

}());