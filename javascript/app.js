var map, infoWindow;
var area = document.getElementById("area-shelters");
var submit = document.getElementById("submit");
var filter = $("#filter-by")
var APIKey = "2BaEcf0ZgdGwgCVUIyjT2UPf4jU9zxevFmBqo3hap8bQXM09uf";
var secret = "ChtFchPni9L0Arf2Z2A3RAKwNtxflJ48oRRI93mC";
var queryURL = "https://api.petfinder.com/v2/oauth2/token";
var city = "Chicago, IL";
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
      fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                city = data.results[0].address_components[6].long_name;
                console.log(data);
                // get organization data
                getOrg();
                // wait for getOrg to finish, we'll need a better solution later
                // first thing here is to loop thru the orgs array fetched by getOrgs
                setTimeout(func => {for (i = 0; i < orgs.length; i++) {
                  // check to see if address exists, if not, we'll use the zip code
                  var addr = orgs[i].address.address1;
                  if(addr === null) {
                    addr = orgs[i].address.postcode;
                  } else { // if address line exists, we'll use both the address line and zip
                    addr = orgs[i].address.address1 + ", " + orgs[i].address.postcode;
                  }
                  // good to go to set a Marker on the map
                  console.log(addr);
                  var infoText = "Name: " + orgs[i].name;
                  setMarker(addr, infoText);
                }
                }, 2000);
            })
    }); 
  }
  // call getOrg so it can fill the global 'orgs' array with organization data
  // iterate through orgs array and set markers on the map for each one
  // the problem here is that 'orgs' is still an empty array at this point, since getOrg() hasn't fully finished setting the data

});

submit.addEventListener("click", function () {
  console.log(filter.val())
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
    console.log("step 1 returning json");
    orgs = resp.json();
    return orgs;

  }).then(function (data) {
    // console logs token as json, then the api call happens
    console.log("step 2 returning token data");
    console.log('token', data)

    return fetch('https://api.petfinder.com/v2/organizations?location=' + city, {
      headers: {
        'Authorization': data.token_type + ' ' + data.access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }).then(function (resp) {

    // Return the API response as JSON and sets orgs to the response, returns it
    console.log("step 3 returning response");
    return (resp.json());

  }).then(function (data) {

    // Log the pet data
    console.log("step 4 we have our data now");
    orgs = data.organizations;
    console.log('orgs', data);
    

  }).catch(function (err) {

    // Log any errors
    console.log('something went wrong', err);

  })

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
    return fetch('https://api.petfinder.com/v2/animals?location=' + city + '&limit=18' + '&page=' + page, {
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
      var picturetag = (data.animals[i].photos[0]?.large || "images/d6e35b19-3dee-41b3-b052-4e7e9db58292_200x200.png")
      pics.append('<img src="' + picturetag + '"/>')

    }
    console.log(results)

  }).catch(function (err) {

    // Log any errors
    console.log('something went wrong', err);

  });

}
// calls both functions
//getOrg();
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

function setMarker(address, infoText) {
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
      title: infoText
    });
  });
  request.open("GET", url);
  request.send();
}

function getZip () {
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
  
};