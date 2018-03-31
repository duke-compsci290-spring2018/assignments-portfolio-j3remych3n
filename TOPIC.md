CS 290.02 Final Project Topic
===

## Authors
Lucas Tiger Liu [ltl9] & Jeremy Chen [jc587]

## Overview
 **Collaborative Group Game Creation:** Have you ever struggled to find your motivation? Do you miss having your helicopter parents constantly hovering over your shoulder? Well we have the solution for you!
 
 Our application aims to create a peer-to-peer system that gamifies tasks of any nature (self-improvement, productivity, or debauchery, whatever you like)! 
 
 The structure of our application resonates with some aspects of Scrum. There will be boards of some form, where participants can vote on challenges and point values/rewards associated with these challenges. The more interesting aspects of our application will be found in the means of confirming the completion of challenges, analyzing/visualizing player/challenge data, and the structure of our data (possible implementation of a dApp/distributed ledger).
 
 
 
## Details
**Topic**. In no more than 1 page, describe the application you would like to build, what makes it interesting, and a list of possible data sources it may use.  
Your goal is to convince us your project is interesting and appropriately sized.




Features User Log-in System


Games are composed of a Game Master and Players

Individual users may propose challenges- then the project group must vote to approve/modify task, select reward level (points)

Points leaderboards displayed, points shown on user profile

Challenges can be filled with information, lists, images, assigned users, location based components

Challenges can be directed for individual players, or be open contracts for anyone to complete

Multiple methods of verifying progress (location check in (possible use of Google Maps API, verification of task by other users, provide evidence (images))

User Hierarchy
* Game Master
    * top level resource control
    * Chooses Initial Game Settings
    * Can invite/remove members
* Player
    * complete tasks
    * recieve rewards/points
    * vote on various game aspects
* Spectator
    * No login required. Can look up public games by name, view standings


## Stack
* Vuetify
* Vue
* Firebase
* Node
## Frameworks/External APIs
* Javascript D3
* Google Maps API
* Integration with Google Calendar/Reminders for time-sensitive challenges

## Possible Ambitious/Challenging Feature
* Use Ethereum block chain/smart contracts to create a distributed ledger representing task completion
* Could possibly replace significant portion of database with this block chain

