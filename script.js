const APIkey = 'a8c5ce5092e4ae85e34b3bc5df582c77';
const unsplashKey = 'Jlvh39NnPNb7HcfxgokVK97NVZSzwFpGiLfB23orMLc';
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const output = document.getElementById('search-results');
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');
const savedLocationsHolder = document.getElementById('saved-locations-holder');
const homeBtn = document.getElementById('home-btn');
let currentMap = null;
let isHomePageShowing = true;

async function getPhoto(city, state) {
    const location = `${city}, ${state}`;
    const url = `https://api.unsplash.com/search/photos?query=${location}&client_id=${unsplashKey}&per_page=1`;

    try {
        const response = await fetch(url);

        const data = await response.json();
        console.log(data);

        const extractedData = [data.results[0].urls.regular, data.results[0].user.name];
        console.log(extractedData);

        return extractedData;
    } catch(error) {
        console.log(error);
    }
}

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

function convertToLocalTime(utcTimestamp, timezoneOffset){
    const localTime = new Date((utcTimestamp + timezoneOffset) * 1000);

    return localTime.toLocaleTimeString('en-UK', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
  });;
}

//Weather Dashboard
function renderWeatherDashboard(location, photoData){
    console.log('photoData received:', photoData);
    console.log('photoData type:', typeof photoData);
    console.log('photoData[0]:', photoData[0]);
    console.log('photoData[1]:', photoData[1]);
    output.innerHTML = '';

    const weatherDashboard = document.createElement('div');
    weatherDashboard.classList.add('weather-dashboard');

    const mapHolder = document.createElement('div');
    mapHolder.classList.add('map-holder');

    const mapDiv = document.createElement('div');
    mapDiv.id = 'weather-map';

    const photoAndHeaderHolder = document.createElement('div');
    photoAndHeaderHolder.classList.add('photo-header-container');
    
    const dashboardPhoto = document.createElement('div');
    dashboardPhoto.classList.add('dashboard-photo');
    dashboardPhoto.style.backgroundImage = `url(${photoData[0]})`;
    
    const imageCreds = document.createElement('div');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('dashboard-header-container');


    photoAndHeaderHolder.appendChild(dashboardPhoto);
    photoAndHeaderHolder.appendChild(headerContainer);
    photoAndHeaderHolder.appendChild(imageCreds);

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

    const timeModules = []

    const localTime = convertToLocalTime(location.dt, location.timezone);
    const timeImage = `url('./time.svg')`;
    timeModules.push([timeImage, localTime]);

    const sunrise = convertToLocalTime(location.sys.sunrise, location.timezone);
    const sunriseImage = `url('./sunrise.svg')`;
    timeModules.push([sunriseImage, sunrise]);

    const sunset = convertToLocalTime(location.sys.sunset, location.timezone);
    const sunsetImage = `url('./sunset.svg')`;
    timeModules.push([sunsetImage, sunset]);

    timeModules.forEach(item => {
        const moduleCard = document.createElement('div');
        moduleCard.classList.add('time-module');

        const imageHolder = document.createElement('div');
        imageHolder.classList.add('time-image-holder');
        imageHolder.style.backgroundImage = item[0];

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('time-div');
        timeDiv.innerText = item[1];

        moduleCard.appendChild(imageHolder);
        moduleCard.appendChild(timeDiv);

        timeDivHolder.appendChild(moduleCard);
    })

    //Weather info cards
    const weatherInfoCardsHolder = document.createElement('div');
    weatherInfoCardsHolder.classList.add('weather-info-cards-holder');


    const mainWeatherInfo = [];

    const humidity = location.main.humidity;
    const humidityTitle = 'Humidity';
    mainWeatherInfo.push([humidityTitle, humidity]);

    const feelsLike = `${kelvinToCelcius(location.main.feels_like)}°`;
    const feelsLikeTitle = 'Feels like';
    mainWeatherInfo.push([feelsLikeTitle, feelsLike])

    const maxTemp = `${kelvinToCelcius(location.main.temp_max)}°`;
    const maxTempTitle = 'Max Temperature';
    mainWeatherInfo.push([maxTempTitle, maxTemp]);

    const minTemp = `${kelvinToCelcius(location.main.temp_min)}°`;
    const minTempTitle = 'Min Temperature';
    mainWeatherInfo.push([minTempTitle, minTemp]);

    const windSpeed = location.wind.speed;
    const windSpeedTitle = 'Wind Speed';
    mainWeatherInfo.push([windSpeedTitle, windSpeed])

    const windTemp = `${kelvinToCelcius(location.wind.deg)}°`;
    const windTempTitle = 'Wind Temperature';
    mainWeatherInfo.push([windTempTitle, windTemp]);

    const pressure = location.main.pressure;
    const pressureTitle = 'Pressure';
    mainWeatherInfo.push([pressureTitle, pressure]);

    const groundLevel = location.main.grnd_level;
    const groundLevelTitle = 'Ground Level';
    mainWeatherInfo.push([groundLevelTitle, groundLevel]);
    
    const seaLevel = location.main.sea_level;
    const seaLevelTitle = 'Sea Level';
    mainWeatherInfo.push([seaLevelTitle, seaLevel]);

    const visibility = `${Math.floor(location.visibility / 100)}%`;
    const visTitle = 'Visibility';
    mainWeatherInfo.push([visTitle, visibility]);

    createWeatherInfoCards(mainWeatherInfo, weatherInfoCardsHolder);
    
    const saveLocationBtn = document.createElement('div');
    saveLocationBtn.classList.add('save-location-btn');

    const isInitiallyBookmarked = savedLocations.findIndex(loc => loc.id === location.id) != -1;
        if(isInitiallyBookmarked){
            saveLocationBtn.classList.add('bookmarked');
        } else {
            saveLocationBtn.classList.add('bookmark');
        }

    saveLocationBtn.addEventListener('click', () => {
        const currentIndex = savedLocations.findIndex(l => l === location) != -1;
        if(currentIndex){
            savedLocations.splice(currentIndex, 1);
            saveLocationBtn.classList.remove('bookmarked');
            saveLocationBtn.classList.add('bookmark');
            localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
            renderSavedLocations();
        } else {
            saveLocation(location, saveLocationBtn);
            renderSavedLocations();
        }
    })

    
    weatherDashboard.appendChild(photoAndHeaderHolder);
    weatherDashboard.appendChild(timeDivHolder);
    weatherDashboard.appendChild(saveLocationBtn);
    weatherDashboard.appendChild(weatherInfoCardsHolder);
    weatherDashboard.appendChild(mapHolder);

    output.appendChild(weatherDashboard);
    weatherInfoCardsHolder.appendChild(mapDiv);
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

// Current Weather Info
async function getWeatherInfo(lat, lon, state) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    try {
        const response = await fetch(currentWeatherUrl);

        output.innerHTML = ``;
        const spinner = document.createElement('span');
        spinner.classList.add('loading-spinner');

        const data = await response.json();
        console.log(data);

        const photoData = await getPhoto(data.name, state);
        console.log(photoData);

        renderWeatherDashboard(data, photoData);

    } catch(error){
        logError(error);
    }
}

//Render Search Results
function renderLocationCards(array) {
    output.innerHTML = ``;

    const searchResultsHolder = document.createElement('div');
    searchResultsHolder.classList.add('search-results-holder');

    array.forEach(location => {
            const locationCard = document.createElement('div');
            locationCard.classList.add('location-card');

            const locationTitle = document.createElement('div');
            locationTitle.classList.add('location-search-title');

            const locationName = document.createElement('div');
            locationName.innerText = location.name;
            locationName.classList.add('search-location-name');

            const locationState = document.createElement('div');
            locationState.innerText = location.state;
            locationState.classList.add('search-location-state');

            locationTitle.appendChild(locationName);
            locationTitle.appendChild(locationState);

            const locationPhoto = document.createElement('div');
            locationPhoto.classList.add('location-photo');

            locationCard.appendChild(locationPhoto);
            locationCard.appendChild(locationTitle);

            searchResultsHolder.appendChild(locationCard);

            const locationIndex = array.findIndex(l => l.name === location.name);

            locationCard.addEventListener('click', () => {
                getWeatherInfo(array[locationIndex].lat, array[locationIndex].lon, location.state);
            })
        });
    
    output.appendChild(searchResultsHolder);
}

//Get geo locations
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
            logError('No data');
        } else {
            renderLocationCards(data);
        }

    } catch (error){
        logError(error);
    };
    
}

//Saved locations functionality
const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];


function saveLocation(location, btn) {
    const locationIndex = savedLocations.findIndex(l => l.id === location.id) != -1;
    if(locationIndex){
        btn.classList.remove('bookmark');
        btn.classList.add('bookmarked');
    } else {
        savedLocations.push(location);
        localStorage.setItem('savedLocations',JSON.stringify(savedLocations));
        btn.classList.remove('bookmark');
        btn.classList.add('bookmarked');
    }
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
        locationPhoto.classList.add('saved-location-photo');
        const photo = getPhoto(location.name, location.state);
        locationPhoto.style.backgroundImage = `url(${photo[0]})`;
        console.log(photo)
        console.log(photo[0]);
        console.log(photo[1]);

        const creds = document.createElement('div');
        creds.innerText = `${photo[1]}`

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

        savedLocationCard.appendChild(locationTitle);
        savedLocationCard.appendChild(locationPhoto);
        savedLocationCard.appendChild(removeSavedLocationBtn);
        savedLocationCard.appendChild(creds)
    });
}

// Home Page Fucntionality
async function renderDashboardFromHomePage(city, state) {
    const place = `${city}, ${state}`
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

        const getPhotoData = await getPhoto(data.name, state);

        renderWeatherDashboard(currentWeatherData, getPhotoData);
    } catch (error){
        logError(error);
    }
}


const homePageLocations = [
    {name: 'London',country: "England", picture: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Tokyo',country: "Japan", picture: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928'},
    {name: 'Lisbon',country: "Portugal", picture: 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Seoul',country: "South korea", picture: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=975'},
    {name: 'Cape Town',country: "South Africa", picture: 'https://images.unsplash.com/photo-1591742708307-ce49d19450d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074'},
    {name: 'New York',country: "USA", picture: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Shanghai',country: "China", picture: 'https://images.unsplash.com/photo-1627484986972-e544190b8abb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1168'},
    {name: 'Toronto',country: "Canada", picture: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
    {name: 'Santiago',country: "Chile", picture: 'https://images.unsplash.com/photo-1597006438013-0f0cca2c1a03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074'},
]

function renderHomePage(){
    output.innerHTML = '';

    const homePage = document.createElement('div');
    homePage.classList.add('home-page');

    const searchArea = document.createElement('div');
    searchArea.classList.add('search-area');

    const searchOverlay = document.createElement('div');
    searchOverlay.classList.add('search-overlay');

    const mainText = document.createElement('div');
    mainText.classList.add('search-text');
    mainText.innerText = 'Get the Weather anywhere in the World!'

    const searchHolder = document.createElement('div');
    searchHolder.classList.add('search-bar-btn-container');

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.classList.add('search-area-bar');
    searchBar.placeholder = 'New Mexico...';
    searchBar.addEventListener('keypress', (event) => {
        if(event.key === "Enter"){
            getGeoLocations(searchBar);
        }
    })

    const searchBtn = document.createElement('div');
    searchBtn.classList.add('search-area-btn');
    searchBtn.addEventListener('click', () => {
        getGeoLocations(searchBar);
    })

    searchHolder.appendChild(searchBar);
    searchHolder.appendChild(searchBtn);
    searchOverlay.appendChild(mainText);
    searchOverlay.appendChild(searchHolder);
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
        cardPhoto.style.backgroundSize = 'cover';
        cardPhoto.style.backgroundRepeat = 'no-repeat';
        cardPhoto.style.backgroundPosition = 'center';

        card.appendChild(cardTitle);
        card.appendChild(cardPhoto);
        locationsHolder.appendChild(card);

        card.addEventListener('click', () => {
            renderDashboardFromHomePage(location.name, location.country)
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
    } else if(!sidebar.classList.contains('closed')){
        sidebar.classList.add('closed');
    }
}

function logError(error){
    console.log(error);
        output.innerHTML = ''
        const errorCard = document.createElement('div');
        errorCard.classList.add('error-message');
        const errorText = document.createElement('div');
        errorText.classList.add('error-text');
        errorText.innerText = 'Failed to load location';
        const worldLogo = document.createElement('div');
        worldLogo.classList.add('world-logo');

        errorCard.appendChild(worldLogo);
        errorCard.appendChild(errorText);
        output.appendChild(errorCard);
};

sidebarBtn.addEventListener('click', openSidebar);
homeBtn.addEventListener('click', renderHomePage);
searchBtn.addEventListener('click', () => {getGeoLocations(searchBar)});

renderHomePage();
renderSavedLocations();