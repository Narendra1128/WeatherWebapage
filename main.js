const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector(".api-error-container")

// initially variables need
const API_KEY = "fbf843feac2b55b931b80f9faa3cf504";

let currentTab = userTab;
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
    console.log(clickedTab)
        currentTab.classList.toggle("current-tab");
        clickedTab.classList.toggle("current-tab");
        currentTab = clickedTab;
    }
    if(currentTab==userTab){
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.remove("active")
        getfromSessionStorage();}

    else if(currentTab==searchTab){
        searchForm.classList.add("active");
        userInfoContainer.classList.remove("active")}
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});


function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
        getLocation();
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
         alert("Search City Name only");
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);    
})

function renderWeatherInfo(weatherInfo){
    console.log(weatherInfo?.name, weatherInfo?.sys?.country.toLowerCase())

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
 
    //fetch values from weatherInfo object and put UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
 
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
 }

async function fetchUserWeatherInfo(coordinates){
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    notFound.classList.remove("active")
    const {lat, lon} = coordinates;
   
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`    
        );
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active")
        notFound.classList.add('active');
    }
}

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active")


    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch (err) {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.add('active');
    }
}


