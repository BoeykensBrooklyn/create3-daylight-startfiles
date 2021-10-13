// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = function(procent, DOMElement, timeObject){
  DOMElement.setAttribute("data-time", timeObject.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  }) );

  let bottomPercentage = 100 - procent;

  DOMElement.style.bottom = `${bottomPercentage}%`;
  DOMElement.style.left = `${procent}%`;

}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  let sunDOMElement = document.querySelector('.js-sun');
  let aantalResterendeMinutenDOMElement = document.querySelector('.js-time-left')
  // Bepaal het aantal minuten dat de zon al op is.
  let timeAtTheMoment = new Date();
  let zonOpMinuten = totalMinutes - timeAtTheMoment.getMinutes();
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  let percentage = Math.round(zonOpMinuten/totalMinutes *100);
  updateSun(percentage, sunDOMElement, timeAtTheMoment)
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  console.log(queryResponse);
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  let location = document.querySelector('.js-location');
  location.innerHTML = queryResponse.name + ', ' + queryResponse.sys.country;
  let sunRiseTime = document.querySelector('.js-sunrise');
  let sunRiseTimeDate = new Date(queryResponse.sys.sunrise * 1000);
  sunRiseTime.innerHTML = sunRiseTimeDate.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  });
  let sunsetTime = document.querySelector('.js-sunset');
  let sunsetTimeDate = new Date(queryResponse.sys.sunset * 1000);
  sunsetTime.innerHTML = sunsetTimeDate.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  });

  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  console.log(sunRiseTimeDate)
  let totalMinutes = (sunsetTimeDate.getTime() - sunRiseTimeDate.getTime()) / 1000 / 60;
  console.log(totalMinutes);
  placeSunAndStartMoving(totalMinutes, sunRiseTimeDate);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
  // Eerst bouwen we onze url op
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=608fd61813fc09c7e5aff2f7d055db85`;
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw Error(`looks like there was a problem. Status Code: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(function (jsonObject) {
      showResult(jsonObject);
    });
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
