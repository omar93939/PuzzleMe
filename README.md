# PuzzleMe: A CS50 Experience
### Final project. Concluding CS50 course. 19 years old, from the Netherlands.

## The following languages and frameworks were used:
HTML, CSS, JavaScript, Python, SQL (SQLite3), Flask (Python Web Framework), Jinja (through Flask), Bootstrap (CSS Framework)

## The following libraries were used:
CS50 Python Library (only SQL features), Werkzeig Security (generate and check password hashes)

## Project Name: PuzzleMe
## Video Demo: (https://youtu.be/azbpTCtYaBw)


## What is the project? The Big Picture:
PuzzleMe is a website/web application which exists for one purpose. Well, 2. The first is, of course, to serve as my final project, concluding the CS50 course.
The second purpose is that PuzzleMe is a web-application which (theoretically) allows users to play various puzzle games. At the moment, it only supports one
puzzle game in particular: 2048. However, everything has been setup behind the scenes to allow for the easy integration of more puzzle games!

How was this application made and how is it future-proof? Read on to find out more.


## The Creation Story:
I quickly realized I wanted to make a game as my final project. However, I wanted to make some interface around the game, and I wanted there to be an ability
to somehow "host" multiple games in addition to just the one I would be making. I believed the best option therefore was a web-application. It also helped that
there was some baseline set up with the last week's problem set, of course.

Now knowing I would make a website hosting puzzle games, I would need to think of a name. Quite simply, I looked up a site to combine two words, and found this:
https://www.wordunscrambler.net/word-combiner.aspx

I used the above site to simply combine the words "Puzzle" and "Game" and "PuzzleMe" immediately struck my eye. This is, of course, because it is a combination
of "Puzzle" and "Game", yet it also allows for the interpretation of a simple combination of "Puzzle" and "Me" (which it quite literally is), referring to one's
enjoyment focusing on completing this challenge using their own skills.

I'm not the first person to have the game 2048, so I had the advantage of basing the visuals of the game on another's work (open-source). However, the
gameplay implementation was produced by me, and proved quite a large challenge, as I will describe later on. The implementation whose visuals I based mine on is
the following:
https://play2048.co/

It was still actually quite challenging to replicate the visuals, as it involved a lot of various CSS stylization which I quickly needed to wrap my mind around.

2048 is essentially a game about combining tiles' values until one tile reaches the value of "2048", hence the name of the game. Two tiles generate in a random
location at the start of the game, and any time the user makes a move, another one is generated in a random, empty, location. The values of any of these tiles
is either "2" or "4", with a 50% (ideally, although JavaScript's random function is, of course, not perfectly random) probability of it generating either one.

I decided that I wanted to make several different difficulties which involved varying grid sizes; a larger grid allowed for more movement and therefore an easier
time getting to the final value of "2048". This would mean, however, that, in order to practice good code styling and practice, I would ensure that the
implementation of the game would be flexible with any grid size I would desire later on. The implementation and calculations were therefore not based on 1 set 
grid/grid-size and its dimensions, but rather a fluid implementation based on calculations involving an initially chosen grid-size (probably made that sound
way more complicated that it needed to).

All of the gameplay was handled using HTML, CSS, and Pure JavaScript (challenging!).

Pushing the pages to the user were handled using Python and Flask.

I decided to implement a sort of "leaderboard" system, as well as a "history" system. For this, SQL was used (SQLite3), as well as Flask and its use of "Jinja".

The largest feature allowing for some idea of "future-proofing" is the implementation of the SQL Database and its tables.

A demonstration of the web application, as well as going over some of the code, can be seen on the video linked at the top and below:
## (https://youtu.be/azbpTCtYaBw)

Oh yeah, and some CSS animations/transitions were used to make switching pages a bit less boring :)
