

var map, infoWindow;
var area = document.getElementById("area-shelters");
var submit = document.getElementById("submit");
var APIKey = "XlBR3viVn8RGIGcXwVQc7sYBJPFg1PwnPeLNVO9eXBty1nYguo";
var secret = "zgMOcpFX72jNbDYwW7WWY1WPrvnuouonOXjXGBfc";
var queryURL = "https://api.petfinder.com/v2/oauth2/token";
var city = "Janesville, WI";
var status = 'adoptable';
var coat = ''
var type = ''
var page = 1
var pics = $("#pics");
var orgs = []
var pets = []

area.addEventListener("click", function () {
  // get user coordinates
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // get user location based on coordinates
      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng + "&key=AIzaSyBc7c_SM6teDzFusELkTEd6P35pCsWjMd8";
      var request = new XMLHttpRequest();
      request.addEventListener("load", function () {
        var obj = JSON.parse(this.responseText);
        // this is users zip code
        city = obj.results[0].address_components[6].long_name;
        console.log(obj);
        console.log("current location = " + city);
        
      });

      request.open("GET", url);
      request.send();
    });
  }
});

submit.addEventListener("click", function () {
  // code for submit button goes here
});

async function getOrg() {
  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + APIKey + '&client_secret=' + secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (resp) {

    // Return the response as JSON
    return resp.json();

  }).then(function (data) {
    // console logs token as json, then the api call happens
    console.log('token', data)

    return fetch('https://api.petfinder.com/v2/organizations?location=' + city, {
      headers: {
        'Authorization': data.token_type + ' ' + data.access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }).then(function (resp) {

    // Return the API response as JSON and sets orgs to the response, returns it
    orgs = resp.json();
    return orgs;

  }).then(function (data) {

    // Log the pet data
    console.log('orgs', data);
    orgs = data.organizations;

  }).catch(function (err) {

    // Log any errors
    console.log('something went wrong', err);

  });

}

// Adds function that makes API call to return Animals object as json object
function getAnimals() {

  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + APIKey + '&client_secret=' + secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (resp) {

    // Return the response as JSON
    return resp.json();

  }).then(function (data) {

    // makes api call with search parameters
    return fetch('https://api.petfinder.com/v2/animals?location=' + city + '&limit=18', {
      headers: {
        'Authorization': data.token_type + ' ' + data.access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }).then(function (resp) {

    // Return the API response as JSON
    pets = resp.json();
    return pets

  }).then(function (data) {

    // Log the pet data
    console.log('pets', data);

    var results = data.animals.length
    for (var i = 0; i < results; i++) {
      var picturetag = (data.animals[i].photos[0]?.large || "https://via.placeholder.com/150")
      pics.append('<img src="' + picturetag + '"/>')

    }
    console.log(results)

  }).catch(function (err) {

    // Log any errors
    console.log('something went wrong', err);

  });

}
// calls both functions
getOrg();
getAnimals();

// this button increases the page number and displays new set of pets
$("#page").on("click", function () {
  page++
  pics.html("")
  getAnimals()
})

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      /* infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map); */
      map.setCenter(pos);
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "You are here"
      });

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function setMarker(address) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBc7c_SM6teDzFusELkTEd6P35pCsWjMd8";
  var request = new XMLHttpRequest();
  request.addEventListener("load", function () {
    // response needs to be formatted for use
    var obj = JSON.parse(this.responseText);
    // get address lat & lng coordinates
    var coords = obj.results[0].geometry.location;
    map.setCenter(coords);
    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title: "Information Text"
    });
  });
  request.open("GET", url);
  request.send();
}
