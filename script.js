const APIkey = 'a8c5ce5092e4ae85e34b3bc5df582c77';
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const output = document.getElementById('search-results');
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');
const savedLocationsHolder = document.getElementById('saved-locations-holder');
let currentMap = null;

function createWeatherMap(lat, lon){
    if(currentMap){
        currentMap.remove();
    }

    currentMap = L.map('weather-map').setView([lat, lon], 10);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(currentMap);
  
    L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${APIkey}`,
        { opacity: 0.8 }
    ).addTo(currentMap);
  
  L.marker([lat, lon]).addTo(currentMap)
}

function kelvinToCelcius(kelvin){
    return Math.floor(kelvin - 273.15);
}

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });
});

function renderWeatherDashboard(location){
    output.innerHTML = '';

    const weatherDashboard = document.createElement('div');
    weatherDashboard.classList.add('weather-dashboard');

    const mapHolder = document.createElement('div');
    mapHolder.classList.add('map-holder');

    const mapDiv = document.createElement('div');
    mapDiv.id = 'weather-map';
    mapDiv.style.height = '400px';
    mapDiv.style.width = '100%';

    mapHolder.appendChild(mapDiv);

    const photoAndHeaderHolder = document.createElement('div');
    photoAndHeaderHolder.classList.add('photo-header-container');

    const dashboardPhoto = document.createElement('div');
    dashboardPhoto.classList.add('dashboard-photo');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('dashboard-header-container');

    photoAndHeaderHolder.appendChild(dashboardPhoto);
    photoAndHeaderHolder.appendChild(headerContainer);

    const locationTitle = document.createElement('div');
    locationTitle.classList.add('location-title');
    const loactionName = location.name;
    const locationCountry = location.sys.country;
    locationTitle.innerText = `${loactionName}, ${locationCountry}`;
    const temperature = Math.floor(kelvinToCelcius(location.main.temp));
    const temperatureHolder = document.createElement('div');
    temperatureHolder.classList.add('temperature');
    temperatureHolder.innerText = `${temperature}°`;
    const tempAndTitleHolder = document.createElement('div');
    tempAndTitleHolder.classList.add('temp-and-title-holder');
    tempAndTitleHolder.appendChild(locationTitle);
    tempAndTitleHolder.appendChild(temperatureHolder);


    const weatherType = location.weather[0].main;
    const weatherTypeDiv = document.createElement('div');
    weatherTypeDiv.classList.add('weather-type-div');
    weatherTypeDiv.innerText = `${weatherType},`;

    const weatherDescription = location.weather[0].description;
    const weatherDescriptionDiv = document.createElement('div');
    weatherDescriptionDiv.classList.add('weather-description-div')
    weatherDescriptionDiv.innerText = weatherDescription;

    const weatherTypeHolder = document.createElement('div');
    weatherTypeHolder.classList.add('weather-type-holder');

    weatherTypeHolder.appendChild(weatherTypeDiv);
    weatherTypeHolder.appendChild(weatherDescriptionDiv);

    headerContainer.appendChild(tempAndTitleHolder);
    headerContainer.appendChild(weatherTypeHolder);
    
    //sunset/sunrise
    const timeDivHolder = document.createElement('div');
    timeDivHolder.classList.add('time-div-holder');

    const sunrise = location.sys.sunrise;
    const sunset = location.sys.sunset;
    //Weather info cards
    const weatherInfoCardsHolder = document.createElement('div');
    weatherInfoCardsHolder.classList.add('weather-info-cards-holder');

    const mainWeatherInfo = [];

    const humidity = location.main.humidity;
    const humidityTitle = 'Humidity';
    mainWeatherInfo.push([humidityTitle, humidity]);

    const feelsLike = kelvinToCelcius(location.main.feels_like);
    const feelsLikeTitle = 'Feels like';
    mainWeatherInfo.push([feelsLikeTitle, feelsLike])

    const maxTemp = kelvinToCelcius(location.main.temp_max);
    const maxTempTitle = 'Max Temperature';
    mainWeatherInfo.push([maxTempTitle, maxTemp]);

    const minTemp = kelvinToCelcius(location.main.temp_min);
    const minTempTitle = 'Min Temperature';
    mainWeatherInfo.push([minTempTitle, minTemp]);

    const windSpeed = location.wind.speed;
    const windSpeedTitle = 'Wind Speed';
    mainWeatherInfo.push([windSpeedTitle, windSpeed])

    createWeatherInfoCards(mainWeatherInfo, weatherInfoCardsHolder);
    
    const saveLocationBtn = document.createElement('button');
    saveLocationBtn.classList.add('save-location-btn');
    saveLocationBtn.innerText = 'Save';
    saveLocationBtn.addEventListener('click', () => {saveLocation(location); renderSavedLocations()});

    
    weatherDashboard.appendChild(photoAndHeaderHolder);
    weatherDashboard.appendChild(timeDivHolder);
    weatherDashboard.appendChild(saveLocationBtn);
    weatherDashboard.appendChild(weatherInfoCardsHolder);
    weatherDashboard.appendChild(mapHolder);

    output.appendChild(weatherDashboard);
    createWeatherMap(location.coord.lat, location.coord.lon);
}

function createWeatherInfoCards(array, cardHolder){
    const weatherInfoCard = document.createElement('div');
    weatherInfoCard.classList.add('weather-info-card');

    array.forEach(i => {
        const infoRow = document.createElement('div');
        infoRow.classList.add('info-row');

        const infoRowTitle = document.createElement('div');
        infoRowTitle.classList.add('info-row-title');
        infoRowTitle.innerText = i[0];

        const infoRowInfo = document.createElement('div');
        infoRowInfo.classList.add('info-row-info');
        infoRowInfo.innerText = i[1];

        infoRow.appendChild(infoRowTitle);
        infoRow.appendChild(infoRowInfo);

        weatherInfoCard.appendChild(infoRow);
        cardHolder.appendChild(weatherInfoCard);
    })

}

async function getWeatherInfo(lat, lon) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    try {
        const response = await fetch(currentWeatherUrl);

        const data = await response.json();
        console.log(data);

        renderWeatherDashboard(data);

    } catch(error){
        console.log(error);
    }
}


function renderLocationCards(array) {
    output.innerHTML = ``;

    array.forEach(location => {
            const locationCard = document.createElement('div');
            locationCard.classList.add('location-card');

            const locationCardPhoto = document.createElement('div');
            locationCardPhoto.classList.add('location-card-photo');

            const locationTitle = document.createElement('div');
            locationTitle.classList.add('location-title');
            const loactionName = location.name;
            locationTitle.innerText = loactionName;

            locationCard.appendChild(locationTitle);
            locationCard.appendChild(locationCardPhoto);

            output.appendChild(locationCard);

            const locationIndex = array.findIndex(l => l.name === loactionName);

            locationCard.addEventListener('click', () => {
                getWeatherInfo(array[locationIndex].lat, array[locationIndex].lon)
            })
        });
    }

async function getGeoLocations(input) {
    const cityName = input.value;
    const geoCodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`
    try{
        console.log('url:', geoCodingURL);
        const response = await fetch(geoCodingURL);
        console.log('response status:', response.status);
        console.log('city name:', cityName);

        const data = await response.json();
        console.log(data);

        renderLocationCards(data);

    } catch (error){
        console.log(error);
    };
    
}

//Saved locations functionality
const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];


function saveLocation(location) {
    savedLocations.push(location);

    localStorage.setItem('savedLocations',JSON.stringify(savedLocations));
}

function renderSavedLocations(){
    savedLocationsHolder.innerHTML = '';

    savedLocations.forEach(location => {
        const index = savedLocations.findIndex(l => l.name === location.name);

        const savedLocationCard = document.createElement('div');
        savedLocationCard.classList.add('saved-location-card');

        const locationTitle = document.createElement('div');
        locationTitle.classList.add('saved-location-title');
        locationTitle.innerText = location.name;

        const locationPhoto = document.createElement('div');

        savedLocationsHolder.appendChild(savedLocationCard);

        savedLocationCard.addEventListener('click', (event) => {
            const target = event.target;

            if(target === removeSavedLocationBtn){

            } else {
                const lon = location.coord.lon;
                const lat = location.coord.lat;

                getWeatherInfo(lat, lon);
                openSidebar();
            }
        })

        const removeSavedLocationBtn = document.createElement('button');
        removeSavedLocationBtn.classList.add('remove-saved-location-btn');
        removeSavedLocationBtn.innerText = 'X';

        removeSavedLocationBtn.addEventListener('click', () => {
            savedLocations.splice(index, 1);
            localStorage.setItem('savedLocations',JSON.stringify(savedLocations));
            renderSavedLocations();
        })

        savedLocationCard.appendChild(locationPhoto);
        savedLocationCard.appendChild(locationTitle);
        savedLocationCard.appendChild(removeSavedLocationBtn);
    });
};

const openSidebar = () => {
    if(sidebar.classList.contains('closed')){
        sidebar.classList.remove('closed');
        output.classList.add('sidebar-open');
        output.classList.remove('sidebar-closed');
    } else if(!sidebar.classList.contains('closed')){
        sidebar.classList.add('closed');
        output.classList.add('sidebar-closed');
        output.classList.remove('sidebar-open');
    }
}

sidebarBtn.addEventListener('click', openSidebar);

searchBtn.addEventListener('click', () => {getGeoLocations(searchBar)});

renderSavedLocations();