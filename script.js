const APIkey = 'a8c5ce5092e4ae85e34b3bc5df582c77';

const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const output = document.getElementById('search-results');

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

    const temperature = location.main.temp;
    const temperatureHolder = document.createElement('div');
    temperatureHolder.classList.add('temperature');
    temperatureHolder.innerText = temperature;


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

    weatherDashboard.appendChild(dashboardPhoto);
    weatherDashboard.appendChild(locationTitle);
    weatherDashboard.appendChild(temperatureHolder);
    weatherDashboard.appendChild(weatherTypeHolder);

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

            const locationTitle = document.createElement('div');
            locationTitle.classList.add('location-title');
            const loactionName = location.name;
            locationTitle.innerText = loactionName;

            locationCard.appendChild(locationTitle);

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

searchBtn.addEventListener('click', () => {getGeoLocations(searchBar)});