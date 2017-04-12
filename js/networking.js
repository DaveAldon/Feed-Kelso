//Game state to control listeners
var GameAwake = false;

//Global hunger score
var global_user;
var global_score;

//Easily accessible reference to user objects
var ref = firebase.database().ref("users/");

//Button events for updates
document.getElementById("registerBtn").onclick = function() {register(document.getElementById("usernameInput").value)};

//Listener for any database changes. Upon a change, we call the high score update function for incredible efficiency
ref.on("value", function(snapshot) {
  updateHighScore();
});

//Listener for the score var, calls the database update function whenever its value changes
Object.defineProperty(window, "score", { 
  set: function(value) {
    global_score = value;
    //We don't want it to update until given the ability
    if(GameAwake) {
    updateScore(global_score, global_user);
    }
  }
});

//Registers user to firebase if the username is not a duplicate
function register(userId) {
  ref.once('value', function(snapshot) {
    if (!snapshot.hasChild(userId)) {
      //After the user registers, the game is awakened and the listeners can begin updating Firebase
      GameAwake = true;
      global_user = userId;
      firebase.database().ref('users/' + userId).set({
          username: userId,
          playerScore: score
      });
    }
    else alert('That username is already in use.');
  });
}

//Updates score to firebase
function updateScore(score, userId) {
firebase.database().ref('users/' + userId).update({
    //While it may seem inneficient to update the username repeatedly, it won't be as the value hasn't changed. It is necessary in the
    //update function however, in order to stay set in Firebase
    username: userId,
    playerScore: score
  });
}

//Calling this function repeatedly just wipes the inner HTML and replaces it with the specified napshot value. Firebase sorts it for us automatically for efficiency
function updateHighScore() {
  //Incrementer for determining which element to place the data. We have a top 5 leaderboard, so it begins at 5
  var i = 10;
  ref.orderByChild("playerScore").limitToLast(10).on("child_added", function(snapshot) {
    var score = snapshot.val().playerScore + " " + snapshot.val().username;
    var entry = document.getElementById("s" + i);

	//Sets color of leaderboard usernames
	if(global_user == snapshot.val().username) {
		entry.style.color = "GREEN";
	} else {
		entry.style.color = "WHITE";
	  }

    entry.innerHTML = score;
    i--;
    //Activate below for troubleshooting
    //console.log(snapshot.val());
    //console.log(i);
  });
}