

var map, infoWindow;
var area = document.getElementById("area-shelters");
var submit = document.getElementById("submit");
var APIKey = "XlBR3viVn8RGIGcXwVQc7sYBJPFg1PwnPeLNVO9eXBty1nYguo";
var secret = "zgMOcpFX72jNbDYwW7WWY1WPrvnuouonOXjXGBfc";
var queryURL = "https://api.petfinder.com/v2/oauth2/token";
var state = 'WI';
var status = 'adoptable'; 
var coat = ''
var type = ''
var page = 1
var pics = $("#pics");

area.addEventListener("click", function () {
    // code for area button goes here
});

submit.addEventListener("click", function () {
    // code for submit button goes here
});

function getAnimals(){
      
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



  // Log the API data
  console.log('token', data);

  // Return a second API call
  // This one uses the token we received for authentication
  return fetch('https://api.petfinder.com/v2/animals?location=' + state + '&status=' + status + '&coat=' + coat + '&type=' + type + '&page=' + page, {
      headers: {
          'Authorization': data.token_type + ' ' + data.access_token,
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  });

}).then(function (resp) {

  // Return the API response as JSON
  return resp.json();

}).then(function (data) {

  // Log the pet data
  console.log('pets', data);
var results = data.animals.length
for (var i = 0; i < results; i++){
var picturetag = (data.animals[i].photos[0]?.large || "https://via.placeholder.com/150")
pics.append('<img src="' + picturetag + '"/>')
}
console.log(results)
}).catch(function (err) {

  // Log any errors
  console.log('something went wrong', err);

});

}

getAnimals()

$("#page").on("click", function(){
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

function setMarker (address) {
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


