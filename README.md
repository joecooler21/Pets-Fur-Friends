# Project-01

## Pet Adoption App for Rescue Animals from Shelters (Name in Progress)

## Team

* Bradley Wilson
* Joe Cooler
* Fabian Ramirez
* Brian Emmons

## API’s

* Geolocation
* Google Maps
* Petfinder
* Wing CSS (alternative CSS framework)

## Basic Function

Our app takes the user’s location either by a geolocation API or by user inputting city/state. This information is then used in conjucture with Google Maps API to display map and all pets for adoption in their search area. The Petfinder API links them with local animal shelters with pets for adoption. User can also input desired breed / age of pet(s) and the API will link them to available rescue pets in their area.

## Under The Hood

* Store responses to Firebase (for keeping/deleting data)
* Use browser geolocation to pull location based on current location (lat and lon) automatically
* localStorage lat/long (store city of where user is searching from)
* Add forms / buttons to allow user to input desired city/state (if searching outside of their geolocation)
* Add forms / submit buttons for searching for breed / age of desired pet
* Have pet images and descriptions pulled from petfinder show up on HTML

## Sketch / Wireframe

![Wireframe](Untitled Diagram.png)

