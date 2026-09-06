// ========================================
// WEATHER SERVICE
// ========================================

const service =
    new WeatherService(
        CONFIG.API_KEY
    );


// ========================================
// ELEMENTS
// ========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const locationBtn =
    document.getElementById(
        "locationBtn"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const unitToggle =
    document.getElementById(
        "unitToggle"
    );

const favoriteBtn =
    document.getElementById(
        "favoriteBtn"
    );

const shareBtn =
    document.getElementById(
        "shareBtn"
    );


// ========================================
// APP STATE
// ========================================

let currentWeatherData = null;

let currentForecastData = null;

let currentCity = "";

let currentUnit = getUnit();

let weatherMap = null;

let weatherMarker = null;

let weatherLayer = null;


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateUnitButton();

        loadTheme();

        displayFavorites(
            searchFavoriteCity
        );

    }
);


// ========================================
// SEARCH BUTTON
// ========================================

searchBtn.addEventListener(
    "click",
    () => searchWeather()
);


// ========================================
// ENTER KEY
// ========================================

searchInput.addEventListener(
    "keypress",
    event => {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);


// ========================================
// SEARCH WEATHER
// ========================================

async function searchWeather(cityFromSuggestion = null) {

    const city =
        cityFromSuggestion
        || searchInput.value.trim();


    if (!city) {

        showError(
            "Please enter a city name."
        );

        return;

    }


    try {

        showLoading();

        clearError();

        hideSuggestions();


        // ==================================
        // CHECK CACHE
        // ==================================

        const cachedData =
            getCachedWeather(city);


        if (cachedData) {

            currentWeatherData =
                cachedData.currentWeather;

            currentForecastData =
                cachedData.forecastData;

            currentCity =
                cachedData.city;


            searchInput.value =
                currentCity;


            displayCurrentWeather(
                currentWeatherData,
                currentUnit
            );


            displayForecast(
                currentForecastData,
                currentUnit
            );


            updateFavoriteButton();


            updateMap(
                currentWeatherData
            );


            loadAlerts(
                currentWeatherData
            );


            hideLoading();

            return;

        }


        // ==================================
        // GET CURRENT WEATHER
        // ==================================

        const current =
            await service.getCurrentWeather(
                city
            );


        // ==================================
        // GET FORECAST
        // ==================================

        const forecastData =
            await service.getForecast(
                city
            );


        // ==================================
        // SAVE CACHE
        // ==================================

        saveWeatherData(
            current.name,
            current,
            forecastData
        );


        // ==================================
        // UPDATE STATE
        // ==================================

        currentWeatherData =
            current;

        currentForecastData =
            forecastData;

        currentCity =
            current.name;


        searchInput.value =
            currentCity;


        // ==================================
        // DISPLAY
        // ==================================

        displayCurrentWeather(
            current,
            currentUnit
        );


        displayForecast(
            forecastData,
            currentUnit
        );


        updateFavoriteButton();


        updateMap(
            current
        );


        // ==================================
        // ALERTS
        // ==================================

        await loadAlerts(current);


        hideLoading();

    }


    catch (error) {

        hideLoading();

        showError(
            error.message
            || "Unable to fetch weather data."
        );

    }

}


// ========================================
// AUTOCOMPLETE
// ========================================

let autocompleteTimer;


searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            autocompleteTimer
        );


        const query =
            searchInput.value.trim();


        if (query.length < 2) {

            hideSuggestions();

            return;

        }


        autocompleteTimer =
            setTimeout(
                async () => {

                    try {

                        const cities =
                            await service.searchCities(
                                query
                            );


                        displaySuggestions(
                            cities
                        );

                    }

                    catch (error) {

                        hideSuggestions();

                    }

                },
                400
            );

    }
);


// ========================================
// LOCATION BUTTON
// ========================================

locationBtn.addEventListener(
    "click",
    getUserLocation
);


function getUserLocation() {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    showLoading();

    clearError();


    navigator.geolocation.getCurrentPosition(

        async position => {

            try {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                // Current weather

                const current =
                    await service.getWeatherByCoordinates(
                        latitude,
                        longitude
                    );


                // Forecast

                const forecastData =
                    await service.getForecastByCoordinates(
                        latitude,
                        longitude
                    );


                // State

                currentWeatherData =
                    current;

                currentForecastData =
                    forecastData;

                currentCity =
                    current.name;


                searchInput.value =
                    currentCity;


                // Display

                displayCurrentWeather(
                    current,
                    currentUnit
                );


                displayForecast(
                    forecastData,
                    currentUnit
                );


                // Save

                saveWeatherData(
                    current.name,
                    current,
                    forecastData
                );


                updateFavoriteButton();


                updateMap(
                    current
                );


                await loadAlerts(current);


                hideLoading();

            }


            catch (error) {

                hideLoading();

                showError(
                    error.message
                    || "Unable to fetch your location weather."
                );

            }

        },


        error => {

            hideLoading();


            if (error.code === 1) {

                showError(
                    "Location permission was denied."
                );

            }

            else if (error.code === 2) {

                showError(
                    "Your location could not be determined."
                );

            }

            else {

                showError(
                    "Unable to get your location."
                );

            }

        }

    );

}


// ========================================
// WEATHER ALERTS
// ========================================

async function loadAlerts(data) {

    try {

        const alerts =
            await service.getAlerts(
                data.coord.lat,
                data.coord.lon
            );


        displayAlerts(alerts);

    }

    catch (error) {

        displayAlerts([]);

    }

}


// ========================================
// TEMPERATURE UNIT
// ========================================

unitToggle.addEventListener(
    "click",
    toggleUnit
);


function toggleUnit() {

    currentUnit =
        currentUnit === "C"
        ? "F"
        : "C";


    saveUnit(
        currentUnit
    );


    updateUnitButton();


    if (currentWeatherData) {

        displayCurrentWeather(
            currentWeatherData,
            currentUnit
        );

    }


    if (currentForecastData) {

        displayForecast(
            currentForecastData,
            currentUnit
        );

    }

}


function updateUnitButton() {

    unitToggle.textContent =
        currentUnit === "C"
        ? "🌡️ °C"
        : "🌡️ °F";

}


// ========================================
// DARK MODE
// ========================================

themeToggle.addEventListener(
    "click",
    toggleTheme
);


function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeToggle.textContent =
            "☀️ Light Mode";

        saveTheme("dark");

    }

    else {

        themeToggle.textContent =
            "🌙 Dark Mode";

        saveTheme("light");

    }

}


function loadTheme() {

    const theme =
        getTheme();


    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
            "☀️ Light Mode";

    }

}


// ========================================
// FAVORITES
// ========================================

favoriteBtn.addEventListener(
    "click",
    () => {

        if (!currentCity) {

            showError(
                "Search for a city first."
            );

            return;

        }


        const favorites =
            getFavorites();


        const exists =
            favorites.some(
                city =>
                    city.toLowerCase()
                    === currentCity.toLowerCase()
            );


        if (exists) {

            removeFavorite(
                currentCity
            );

        }

        else {

            addFavorite(
                currentCity
            );

        }


        updateFavoriteButton();


        displayFavorites(
            searchFavoriteCity
        );

    }
);


function searchFavoriteCity(city) {

    searchInput.value =
        city;

    searchWeather();

}


function updateFavoriteButton() {

    if (!currentCity) {

        favoriteBtn.textContent =
            "⭐ Add Favorite";

        return;

    }


    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            city =>
                city.toLowerCase()
                === currentCity.toLowerCase()
        );


    favoriteBtn.textContent =
        exists
        ? "⭐ Remove Favorite"
        : "⭐ Add Favorite";

}


// ========================================
// SHARE
// ========================================

shareBtn.addEventListener(
    "click",
    shareWeather
);


async function shareWeather() {

    if (!currentWeatherData) {

        showError(
            "Search for a city first."
        );

        return;

    }


    const temperature =
        convertTemperature(
            currentWeatherData.main.temp,
            currentUnit
        );


    const text =
        `${currentWeatherData.name}: ${temperature}${getTemperatureSymbol(currentUnit)}, ${currentWeatherData.weather[0].description}`;


    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Weather Dashboard",

                text:
                    text

            });

        }

        catch (error) {

            // User cancelled sharing

        }

    }

    else {

        try {

            await navigator.clipboard.writeText(
                text
            );


            alert(
                "Weather information copied to clipboard."
            );

        }

        catch (error) {

            alert(text);

        }

    }

}


// ========================================
// WEATHER MAP
// ========================================

function updateMap(data) {

    const latitude =
        data.coord.lat;

    const longitude =
        data.coord.lon;


    // Create map

    if (!weatherMap) {

        weatherMap =
            L.map(
                "weatherMap"
            ).setView(
                [
                    latitude,
                    longitude
                ],
                10
            );


        // OpenStreetMap

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(
            weatherMap
        );


        // OpenWeather cloud layer

        weatherLayer =
            L.tileLayer(
                `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${CONFIG.API_KEY}`,
                {
                    opacity: 0.5,
                    attribution:
                        "Weather data © OpenWeather"
                }
            );


        weatherLayer.addTo(
            weatherMap
        );

    }

    else {

        weatherMap.setView(
            [
                latitude,
                longitude
            ],
            10
        );

    }


    // Remove old marker

    if (weatherMarker) {

        weatherMap.removeLayer(
            weatherMarker
        );

    }


    // New marker

    weatherMarker =
        L.marker([
            latitude,
            longitude
        ]).addTo(
            weatherMap
        );


    weatherMarker.bindPopup(

        `<b>${data.name}</b>
        <br>
        ${data.weather[0].description}
        <br>
        ${Math.round(data.main.temp)}°C`

    ).openPopup();


    setTimeout(
        () => {

            weatherMap.invalidateSize();

        },
        100
    );

}
