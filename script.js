const APIkey = 'a8c5ce5092e4ae85e34b3bc5df582c77';

const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const output = document.getElementById('search-results');
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');
const savedLocationsHolder = document.getElementById('saved-locations-holder');

function kelvinToCelcius(kelvin){
    return kelvin - 273.15;
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

    const dashboardPhoto = document.createElement('div');
    dashboardPhoto.classList.add('dashboard-photo');

    const loactionName = location.name;
    const locationTitle = document.createElement('div');
    locationTitle.classList.add('location-title');
    locationTitle.innerText = loactionName;

    const temperature = Math.floor(kelvinToCelcius(location.main.temp));
    const temperatureHolder = document.createElement('div');
    temperatureHolder.classList.add('temperature');
    temperatureHolder.innerText = `${temperature}`;


    const weatherType = location.weather[0].main;
    const weatherTypeDiv = document.createElement('div');
    weatherTypeDiv.classList.add('weather-type-div');
    weatherTypeDiv.innerText = weatherType;

    const weatherDescription = location.weather[0].description;
    const weatherDescriptionDiv = document.createElement('div');
    weatherDescriptionDiv.classList.add('weather-description-div')
    weatherDescriptionDiv.innerText = weatherDescription;

    const weatherTypeHolder = document.createElement('div');
    weatherTypeHolder.classList.add('weather-type-holder');
    
    weatherTypeHolder.appendChild(weatherTypeDiv);
    weatherTypeHolder.appendChild(weatherDescriptionDiv);

    const saveLocationBtn = document.createElement('button');
    saveLocationBtn.classList.add('save-location-btn');
    saveLocationBtn.innerText = 'Save';
    saveLocationBtn.addEventListener('click', () => {saveLocation(location); renderSavedLocations()});

    weatherDashboard.appendChild(dashboardPhoto);
    weatherDashboard.appendChild(locationTitle);
    weatherDashboard.appendChild(temperatureHolder);
    weatherDashboard.appendChild(weatherTypeHolder);
    weatherDashboard.appendChild(saveLocationBtn);

    output.appendChild(weatherDashboard);
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