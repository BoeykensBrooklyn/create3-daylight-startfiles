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
const updateSun = function(sunLeft, sunBottom, DOMElement, timeObject){
  DOMElement.setAttribute("data-time", timeObject.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  }) );

  DOMElement.style.bottom = `${sunBottom}%`;
  DOMElement.style.left = `${sunLeft}%`;

}

const updateSunEveryMinute = function(){
  let percentage = Math.round(zonOpMinuten/totalMinutes *100);
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  let sunDOMElement = document.querySelector('.js-sun');
  let aantalResterendeMinutenDOMElement = document.querySelector('.js-time-left')
  // Bepaal het aantal minuten dat de zon al op is.
  let timeAtTheMoment = new Date();
  let sunriseTime = new Date(sunrise * 1000)
  let zonOpMinuten = (timeAtTheMoment.getHours()*60 + timeAtTheMoment.getMinutes()) - (sunriseTime.getHours()*60 + sunriseTime.getMinutes());
  if (zonOpMinuten > 0) {
    document.querySelector('html').classList.remove("is-night");
    document.querySelector('html').classList.add("is-day")
  }
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  let percentage = (100 / totalMinutes) * zonOpMinuten,
  sunLeft = percentage;
  sunBottom = percentage< 50? percentage * 2 : (100-percentage) * 2;

  updateSun(sunLeft, sunBottom, sunDOMElement, timeAtTheMoment)
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  const htmlDOM = document.querySelector("html")
  htmlDOM.classList.add("is-loaded")
  // Vergeet niet om het resterende aantal minuten in te vullen.
  aantalResterendeMinutenDOMElement.innerText = `${Math.round((totalMinutes - zonOpMinuten) /60)}`
  // Nu maken we een functie die de zon elke minuut zal updaten
  const t = setInterval(() => {
    today = new Date;
      // Bekijk of de zon niet nog onder of reeds onder is
    if (zonOpMinuten < 0 || zonOpMinuten > totalMinutes) {
      document.querySelector('html').classList.add("is-night");
      document.querySelector('html').classList.remove("is-day")
    }else{
      //Percentage Left
      //Percentage Right
      //percentage zon weer wat verder zetten
      //minuten updaten
      let percentage = (100 /totalMinutes) * zonOpMinuten,
      sunLeft = percentage;
      sunBottom = percentage< 50? percentage * 2 : (100-percentage) * 2;

      updateSun(sunLeft, sunBottom, sunDOMElement, today);
      aantalResterendeMinutenDOMElement.innerText = Math.round((totalMinutes - zonOpMinuten) /60)
    }

    zonOpMinuten++;
    // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  }, 60000);

  
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  console.log(queryResponse);
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  let location = document.querySelector('.js-location');
  location.innerHTML = queryResponse.city.name + ', ' + queryResponse.city.country;
  let sunRiseTime = document.querySelector('.js-sunrise');
  let sunRiseTimeDate = new Date(queryResponse.city.sunrise * 1000);
  sunRiseTime.innerHTML = sunRiseTimeDate.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  });
  let sunsetTime = document.querySelector('.js-sunset');
  let sunsetTimeDate = new Date(queryResponse.city.sunset * 1000);
  sunsetTime.innerHTML = sunsetTimeDate.toLocaleString('nl-BE', {
    hour: 'numeric',
    minute: 'numeric',
  });

  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  let timeDifference = new Date(queryResponse.city.sunset *1000 - queryResponse.city.sunrise * 1000)
  placeSunAndStartMoving(timeDifference.getHours() * 60 + timeDifference.getMinutes(), queryResponse.city.sunrise);
};

const get = (url) => fetch(url).then((r) => r.json())
// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=608fd61813fc09c7e5aff2f7d055db85&units=metric&lang=nl&cnt=1`
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  const weatherResponse = await get(url)
  showResult(weatherResponse)
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
