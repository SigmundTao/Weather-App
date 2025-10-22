const APIkey = 'a8c5ce5092e4ae85e34b3bc5df582c77';
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const output = document.getElementById('search-results');
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');
const savedLocationsHolder = document.getElementById('saved-locations-holder');
const homeBtn = document.getElementById('home-btn');
let currentMap = null;
let isHomePageShowing = true;

//Map Creation
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

// Unit conversion
function kelvinToCelcius(kelvin){
    return Math.floor(kelvin - 273.15);
}

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });
});

//Weather Dashboard
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

        output.innerHTML = ``;
        const spinner = document.createElement('span');
        spinner.classList.add('loading-spinner');

        const data = await response.json();
        console.log(data);

        renderWeatherDashboard(data);

    } catch(error){
        console.log(error);
        output.innerHTML = ''
        const errorCard = document.createElement('div');
        errorCard.classList.add('error-message');
        errorCard.innerText = 'failed to load location';
        output.appendChild(errorCard);
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

        if(!data.length){
            output.innerHTML = ''
            const errorCard = document.createElement('div');
            errorCard.classList.add('error-message');
            errorCard.innerText = 'failed to load location';
            output.appendChild(errorCard);
        } else {
            renderLocationCards(data);
        }

    } catch (error){
        console.log(error);
        output.innerHTML = ''
        const errorCard = document.createElement('div');
        errorCard.classList.add('error-message');
        errorCard.innerText = 'failed to load location';
        output.appendChild(errorCard);
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

    if(savedLocations.length < 1){
        const emptyState = document.createElement('div');
        emptyState.classList.add('empty-sidebar-state');
        emptyState.innerText = 'You have no locations saved';

        savedLocationsHolder.appendChild(emptyState);
    }

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
}

// Home Page Fucntionality
async function renderDashboardFromHomePage(city) {
    const geoCodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`

    try {
        const response = await fetch(geoCodingURL);

        const data = await response.json();
        console.log(data);

        const lat = data[0].lat;
        const lon = data[0].lon;

        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`);

        const currentWeatherData = await currentResponse.json();
        console.log(currentWeatherData);

        renderWeatherDashboard(currentWeatherData);
    } catch (error){
        console.log(error);
        output.innerHTML = ''
        const errorCard = document.createElement('div');
        errorCard.classList.add('error-message');
        errorCard.innerText = 'failed to load location';
        output.appendChild(errorCard);
    }
}


const homePageLocations = [
    {name: 'London', picture: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Tokyo', picture: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928'},
    {name: 'Lisbon', picture: 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Seoul', picture: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=975'},
    {name: 'Cape Town', picture: 'https://images.unsplash.com/photo-1591742708307-ce49d19450d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074'},
    {name: 'New York', picture: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Shanghai', picture: 'https://images.unsplash.com/photo-1523281855495-b46cf55b1e7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074'},
    {name: 'Toronto', picture: 'https://images.unsplash.com/photo-1632857997897-9418428d7368?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Santiago', picture: 'https://images.unsplash.com/photo-1597006438013-0f0cca2c1a03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074'},
]

function renderHomePage(){
    output.innerHTML = '';

    const homePage = document.createElement('div');
    homePage.classList.add('home-page');

    const searchArea = document.createElement('div');
    searchArea.classList.add('search-area');

    const searchOverlay = document.createElement('div');
    searchOverlay.classList.add('search-overlay');

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.classList.add('search-area-bar');

    const searchBtn = document.createElement('button');
    searchBtn.classList.add('search-area-btn');

    searchOverlay.appendChild(searchBar);
    searchOverlay.appendChild(searchBtn);
    searchArea.appendChild(searchOverlay)

    const locationsHolder = document.createElement('div');
    locationsHolder.classList.add('home-page-locations-holder');

    homePageLocations.forEach(location => {
        const card = document.createElement('div');
        card.classList.add('home-page-location-card');

        const cardTitle = document.createElement('div');
        cardTitle.classList.add('home-page-location-card-title');
        cardTitle.innerText = location.name;

        const cardPhoto = document.createElement('div');
        cardPhoto.classList.add('home-page-location-card-photo');
        cardPhoto.style.backgroundImage = `url('${location.picture}')`;

        card.appendChild(cardTitle);
        card.appendChild(cardPhoto);
        locationsHolder.appendChild(card);

        card.addEventListener('click', () => {
            renderDashboardFromHomePage(location.name)
            isHomePageShowing = false;
        });
    })

    homePage.appendChild(searchArea);
    homePage.appendChild(locationsHolder);

    output.appendChild(homePage);
    isHomePageShowing = true;
}

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
homeBtn.addEventListener('click', renderHomePage);
searchBtn.addEventListener('click', () => {getGeoLocations(searchBar)});

renderHomePage();
renderSavedLocations();