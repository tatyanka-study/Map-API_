
let latitude = 0;
let longitude = 0;
let marker;
let myLatLng = {lat: latitude, lng: longitude};
let people = [];
let urlCoordinates = "http://api.open-notify.org/iss-now.json";
let numberOfPeople = "http://api.open-notify.org/astros.json";
let locationValueLat = document.querySelector("#locate span:first-child");
let locationValueLng = document.querySelector("#locate span:nth-child(2)");

let template = document.querySelector("#people-list").innerHTML;
let peopleName = document.querySelector("#people-name");
let peopleNumber = document.querySelector("#total");
let sumPeople = 0;

function getTime() {
  let dateNow = new Date();
  let hour = dateNow.getHours().toString().length < 2 ? '0' + dateNow.getHours() : dateNow.getHours();
  let minut = dateNow.getMinutes().toString().length < 2 ? '0' + dateNow.getMinutes() : dateNow.getMinutes();
  let timeNow = `${hour}:${minut}`;
  let outputTime = document.querySelector("#time").innerHTML = timeNow;
} 
setInterval(getTime, 1000);

function getDayToday () {
  let dateNow = new Date();
  let day = dateNow.getDay();
  let month = dateNow.getMonth();  
  let dayToday = document.querySelector("#day-today").innerHTML = `${day}, ${month}`;
}
getDayToday ();


function getNumberOfPeople () {
  fetch(numberOfPeople)
    .then(response => response.json())
    .then(peopleCraft => {
      people = peopleCraft.people.filter(peopleInArr => peopleInArr.craft === "ISS");
      return people;
    })
    .then(peopleCraft => {      
      peopleCraft.forEach(el => {
        let n = el;
        let html = "";        
        html = Mustache.render(template, n);
        peopleName.insertAdjacentHTML("beforeend", html);       
        sumPeople += 1;      
      });
      peopleNumber.textContent = sumPeople;      
    }) 
}

function update () { 
  peopleName.innerHTML = " ";
  sumPeople = 0;
  getCoordinates().then(() => {
    marker.setPosition(myLatLng);
    console.log('title' + latitude)
    marker.setTitle(`latitude ${latitude} longitude ${longitude}`); 
  });   
  getNumberOfPeople();
}

setInterval(update, 5000);

function getCoordinates () {
  return fetch(urlCoordinates)
    .then(response => response.json())
    .then(coordinates => {
      latitude = +(coordinates.iss_position.latitude);
      console.log('fetch' + latitude)
      longitude = +(coordinates.iss_position.longitude);
      locationValueLat.textContent = latitude;
      locationValueLng.textContent = longitude;  
         
      // console.log(latitude + "</br>" + longitude);
      return myLatLng = {lat: latitude, lng: longitude};                   
    })           
  };

  getCoordinates().then(() => {
   initMap();
  })
      
function initMap() {
  //myLatLng = {lat: latitude, lng: longitude};

   const map = new google.maps.Map(
    document.getElementById("map"), 
    {
      zoom: 2,
      center: myLatLng,
    });
  
    marker = new google.maps.Marker({    
    position: myLatLng,
    map,
    title: `latitude ${latitude} longitude ${longitude}`,
  });
}

getNumberOfPeople();
