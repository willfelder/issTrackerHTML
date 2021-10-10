// grab all elements needed
let timeData = document.querySelector('.time');
let latitudeData = document.querySelector('.latitude');
let longitudeData = document.querySelector('.longitude');
let speedData = document.querySelector('.speed');
let altitudeData = document.querySelector('altitude');
let visibilityData = document.querySelector('.visibility');

/* default latitude and longitude. Here lat and long is for "London" */
let lat = 51.505;
let long = -0.09;
let zoomLevel = 8;

// set iss.png image as Marker
const map = L.map('map-div').setView([lat, long], zoomLevel);

const icon = L.icon({
    iconUrl: './img/iss.png',
    iconSize: [90, 45],
    iconAnchor: [25, 94],
    popupAnchor: [20, -86]
  });

// drawing map interface on #map-div


// add map tiles from Mapbox's Static Tiles API
/* Make sure you replaced 'your.mapbox.access.token' with your Mapbox API accessToken, otherwise the Map willnot show anything */
/* to get Mapbox API accessToken --> https://account.mapbox.com/access-tokens/ (do Signup or SignIn) */

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/satellite-v9',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoid2lsbGZlbGRlciIsImEiOiJja3VscXVkZHEwM2ZxMm5saXp3aGFjanZ6In0._Abn5b6yxQEE3A1U_cNg2w'
}).addTo(map);

// adding the Marker to map

const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findIss(){
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
    .then(response => response.json())
    .then(data => {
        lat = data.latitude.toFixed(2);
        long = data.longitude.toFixed(2);
        
        const timestamp = new Date(data.timestamp * 1000).toUTCString();
        const speed = data.velocity.toFixed(2);
        const altitude = data.altitude.toFixed(2);
        const visibility = data.visibility;

        // updateISS() function definition
        updateISS(lat, long, timestamp, speed, altitude, visibility)
    })
    .catch(e => console.log(e));
}

function updateISS(lat, long, timestamp, speed, altitude, visibility){
    //update marker lat and long on map
    marker.setLatLng([lat, long]);
    //update map view according to marker's new position
    map.setView([lat, long]);
    latitudeData.innerText = lat;
    longitudeData.innerText = long;
    timeData.innerText = timestamp;
    speedData.innerText = speed;
    altitudeData.innerText = altitude;
    visibilityData.innerText = visibility;
}

findIss();
setInterval(findIss, 2000);


/* call findISS() initially to immediately set the ISS location */


// call findISS() for every 2 seconds