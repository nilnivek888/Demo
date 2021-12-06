## Assignment 11 and 12 Questions

Note: this questions file is designed to help you document what you've done in your assignment. It is important as this is the way we will understand what you have done for grading.

An example `QUESTIONS.md` file is in the `Examples` directory (QUESTIONS-example.md).

## Assignment 11

The rubric has a list of 13 items.

Item 2: List at least 3 distinct behaviors. If you have made more than 3, list up to 5 and choose the ones you think are most interesting. A single sentence describing each one should be sufficient.

2.A: Cars spawn from certain spots and randoms decides direction at intersections.
2.B: Cars explode when they collide. Their color gradually turn black
2.C: Helicopters ascend and move to the location of the collision as soon as it occurs.
2.D: Helicopter shines a light and destroys the car wreck after they arrive.
2.E: Red jet follows the spline curve.

Item 3: Do you have a spline train track? What object should we look at? How do we know it's a spline?
The "spline train track" is the jet track. By observation, it is C1 continuous. In the code, it is a Catmull-Rom curve with a tension of 1.
Item 4: Do you have a train that faces forward on the track and is ridable?
Yes
Optional Complexity Points: For each one that you've done, give the number (5-13) on the list, describe the behavior, and tell us what object we can see it on. This might take 2-3 sentences per item.

List which other "Behavior Challenges" you completed (from the list of 13 - anything 5 and above). For each, give the number as well as a short (1 sentence is OK) description. And tell us where in the world to see it (what object should we "lookat" and/or "ride"):
5.3D curved path : the spline jet track
6.particle effect: the explosion when cars collide.
7. Secondary action: the helicopters remove car wreckages upon arrival.
12. arc-length parameterization: the spline jet track is arc-length parameterized. The 10 glowing balls are the segments of the track.

## Assignment 12

Object Diversity: List 8 of the different kinds of objects that appear in your world. If you made more than 8 kinds of objects, only list the 8 that are most interesting visually.

O.1 Cars
O.2 Helicopters
O.3 Jet
O.4 Tree1
O.5 House1
O.6 Tree2
O.7 House2
O.8 Cloud Gate (Bean)

Object Diversity: list one object in your world that is loaded from a model file (e.g., OBJ or FBX). Remember to give proper attribution in your README file, and to include the object in your repository.
Jet is a loaded fbx file.
Object Diversity: list one of each category
Building: House1
Natural Element: Tree1
Vehicle (object meant to move): Cars

Technical Challenges: For each technical challenge you attempted (from the list of 7), give the number of the challenge, a description of what you did, and a description of the object that it was used on. What objects should we "look at".
2. Environmental map on the Bean
6. Two-pass rendering also on the Bean. Dynamic reflection of surrounding area.
Pictures: confirm that you placed the required pictures in the Pictures directory.

Consent: do you agree to allow us to use your pictures in future gallery pages? (please answer Yes or No)
Yes
