# Feed-Kelso

Help Kelso get to school on time! Our little application focuses on adding functionality to an existing project in order to do just that.

# [Play it here!](https://davealdon.github.io/Feed-Kelso/)

We came up with three target areas of improvement when we found the original project here:
https://software.intel.com/en-us/html5/hub/blogs/how-to-make-a-mobile-virtual-pet-game-with-html5-and-cordova/

1. Leaderboard
2. Visual Appeal
3. Game Logic Improvement

This project uses HTML and Javascript at its core, and the 2D physics operate using Phaser. CSS was added for more visual control, and the Firebase api is used heavily for the leaderboard. Below are the three functions in more detail.

# Leaderboard

This area resulted in a live high-score board that sits next to the game area, so that users can see the scores change in realtime. Users can create a simple password-less username that immediately begins reporting scores efficiently to a Firebase database. In order to be as efficient as possible, the high-score logic uses database indexes on Firebase to keep everything sorted when retrieved, and listeners/triggers on the client side to reduce database calls to a minimum.

User account creation has limited features, but includes special character validation and duplicate username checks.

# Visual Appeal

The original pet feeder was too visually boring for us, so we used CSS to alter the layout and make it colorful, adding the user registration interface and high-score board. The high-scores highlight the current user's name so that they can easily see themselves move around as their score changes or is replaced by another user.

Additionally, we changed the sprites around so that the protagonist is Kelso, and some other resources such as the background and food items.

# Game Logic Improvement

Because the game uses one state in Phaser, we needed a pause button so that everything doesn't start immediately, and so the user can take a break. Additionally, the difficulty was changed by altering how quickly the health/fun meters drop, and how much health/fun is recieved from items.

# Credits

We seperated our team of three into each of the functionalities we wanted to add:
1. Leaderboard - David
2. Visual Appeal - Kelso
3. Game Logic Improvement - Alisha
