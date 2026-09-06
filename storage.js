// ========================================
// LOCAL STORAGE
// ========================================

const WEATHER_STORAGE_KEY =
    "weatherAppData";

const FAVORITES_STORAGE_KEY =
    "weatherFavorites";

const UNIT_STORAGE_KEY =
    "weatherUnit";

const THEME_STORAGE_KEY =
    "weatherTheme";


// Cache duration = 10 minutes

const CACHE_DURATION =
    10 * 60 * 1000;


// ========================================
// SAVE WEATHER DATA
// ========================================

function saveWeatherData(
    city,
    currentWeather,
    forecastData
) {

    const weatherData = {

        city: city,

        currentWeather: currentWeather,

        forecastData: forecastData,

        timestamp: Date.now()

    };


    localStorage.setItem(

        WEATHER_STORAGE_KEY,

        JSON.stringify(weatherData)

    );

}


// ========================================
// GET SAVED WEATHER
// ========================================

function getSavedWeatherData() {

    const savedData =
        localStorage.getItem(
            WEATHER_STORAGE_KEY
        );


    if (!savedData) {

        return null;

    }


    try {

        return JSON.parse(savedData);

    }

    catch (error) {

        return null;

    }

}


// ========================================
// GET CACHED WEATHER
// ========================================

function getCachedWeather(city) {

    const savedData =
        getSavedWeatherData();


    if (!savedData) {

        return null;

    }


    if (
        savedData.city.toLowerCase()
        !== city.toLowerCase()
    ) {

        return null;

    }


    if (
        Date.now() - savedData.timestamp
        >= CACHE_DURATION
    ) {

        clearWeatherData();

        return null;

    }


    return savedData;

}


// ========================================
// CLEAR WEATHER CACHE
// ========================================

function clearWeatherData() {

    localStorage.removeItem(
        WEATHER_STORAGE_KEY
    );

}


// ========================================
// FAVORITES
// ========================================

function getFavorites() {

    const favorites =
        localStorage.getItem(
            FAVORITES_STORAGE_KEY
        );


    if (!favorites) {

        return [];

    }


    try {

        return JSON.parse(favorites);

    }

    catch (error) {

        return [];

    }

}


// ========================================
// SAVE FAVORITES
// ========================================

function saveFavorites(favorites) {

    localStorage.setItem(

        FAVORITES_STORAGE_KEY,

        JSON.stringify(favorites)

    );

}


// ========================================
// ADD FAVORITE
// ========================================

function addFavorite(city) {

    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            item =>
                item.toLowerCase()
                === city.toLowerCase()
        );


    if (!exists) {

        favorites.push(city);

        saveFavorites(favorites);

    }

}


// ========================================
// REMOVE FAVORITE
// ========================================

function removeFavorite(city) {

    let favorites =
        getFavorites();


    favorites =
        favorites.filter(
            item =>
                item.toLowerCase()
                !== city.toLowerCase()
        );


    saveFavorites(favorites);

}


// ========================================
// TEMPERATURE UNIT
// ========================================

function saveUnit(unit) {

    localStorage.setItem(
        UNIT_STORAGE_KEY,
        unit
    );

}


function getUnit() {

    return (
        localStorage.getItem(
            UNIT_STORAGE_KEY
        )
        || "C"
    );

}


// ========================================
// THEME
// ========================================

function saveTheme(theme) {

    localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
    );

}


function getTheme() {

    return (
        localStorage.getItem(
            THEME_STORAGE_KEY
        )
        || "light"
    );

}