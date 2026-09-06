// ========================================
// UI ELEMENTS
// ========================================

const currentWeather =
    document.getElementById(
        "currentWeather"
    );

const forecast =
    document.getElementById(
        "forecast"
    );

const loading =
    document.getElementById(
        "loading"
    );

const errorMessage =
    document.getElementById(
        "error"
    );

const suggestions =
    document.getElementById(
        "suggestions"
    );

const favoritesContainer =
    document.getElementById(
        "favorites"
    );

const alertsContainer =
    document.getElementById(
        "alerts"
    );


// ========================================
// TEMPERATURE CONVERSION
// ========================================

function convertTemperature(
    celsius,
    unit
) {

    if (unit === "F") {

        return Math.round(
            (celsius * 9 / 5) + 32
        );

    }

    return Math.round(celsius);

}


function getTemperatureSymbol(unit) {

    return unit === "F"
        ? "°F"
        : "°C";

}


// ========================================
// CURRENT WEATHER
// ========================================

function displayCurrentWeather(
    data,
    unit = "C"
) {

    const temperature =
        convertTemperature(
            data.main.temp,
            unit
        );


    const feelsLike =
        convertTemperature(
            data.main.feels_like,
            unit
        );


    const iconCode =
        data.weather[0].icon;


    const iconUrl =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


    currentWeather.innerHTML = `

        <div class="weather-card">

            <h2>
                ${data.name}, ${data.sys.country}
            </h2>

            <img
                src="${iconUrl}"
                alt="${data.weather[0].description}"
                class="weather-icon"
            >

            <h1>
                ${temperature}${getTemperatureSymbol(unit)}
            </h1>

            <p class="weather-description">
                ${data.weather[0].description}
            </p>

            <div class="weather-details">

                <p>
                    🌡️ Feels like:
                    ${feelsLike}${getTemperatureSymbol(unit)}
                </p>

                <p>
                    💧 Humidity:
                    ${data.main.humidity}%
                </p>

                <p>
                    💨 Wind:
                    ${data.wind.speed} m/s
                </p>

                <p>
                    ⏲️ Pressure:
                    ${data.main.pressure} hPa
                </p>

                <p>
                    👁️ Visibility:
                    ${(data.visibility / 1000).toFixed(1)} km
                </p>

            </div>

        </div>

    `;

}


// ========================================
// 5-DAY FORECAST
// ========================================

function displayForecast(
    data,
    unit = "C"
) {

    forecast.innerHTML = "";


    const dailyData = {};


    data.list.forEach(item => {

        const date =
            new Date(item.dt * 1000);


        const dateKey =
            date.toLocaleDateString(
                "en-CA"
            );


        if (!dailyData[dateKey]) {

            dailyData[dateKey] = item;

        }

    });


    const days =
        Object.values(
            dailyData
        ).slice(0, 5);


    days.forEach(item => {

        const date =
            new Date(item.dt * 1000);


        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const temperature =
            convertTemperature(
                item.main.temp,
                unit
            );


        const iconCode =
            item.weather[0].icon;


        const iconUrl =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>
                ${day}
            </h3>

            <img
                src="${iconUrl}"
                alt="${item.weather[0].description}"
                class="forecast-icon"
            >

            <p class="temperature">
                ${temperature}${getTemperatureSymbol(unit)}
            </p>

            <p class="forecast-description">
                ${item.weather[0].description}
            </p>

            <p>
                💧 ${item.main.humidity}%
            </p>

        `;


        forecast.appendChild(card);

    });

}


// ========================================
// AUTOCOMPLETE
// ========================================

function displaySuggestions(cities) {

    suggestions.innerHTML = "";


    if (!cities.length) {

        suggestions.style.display =
            "none";

        return;

    }


    cities.forEach(city => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "suggestion-item";


        item.textContent =
            `${city.name}, ${city.state ? city.state + ", " : ""}${city.country}`;


        item.addEventListener(
            "click",
            () => {

                document.getElementById(
                    "searchInput"
                ).value =
                    city.name;

                hideSuggestions();

                searchWeather(city.name);

            }
        );


        suggestions.appendChild(item);

    });


    suggestions.style.display =
        "block";

}


function hideSuggestions() {

    suggestions.innerHTML = "";

    suggestions.style.display =
        "none";

}


// ========================================
// FAVORITES
// ========================================

function displayFavorites(onSelect) {

    const favorites =
        getFavorites();


    favoritesContainer.innerHTML = "";


    if (!favorites.length) {

        favoritesContainer.innerHTML =
            "<p>No favorite cities yet.</p>";

        return;

    }


    favorites.forEach(city => {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "favorite-item";


        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            `⭐ ${city}`;


        button.addEventListener(
            "click",
            () => onSelect(city)
        );


        const removeButton =
            document.createElement(
                "button"
            );


        removeButton.textContent =
            "✕";


        removeButton.className =
            "remove-favorite";


        removeButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                removeFavorite(city);

                displayFavorites(onSelect);

                updateFavoriteButton();

            }
        );


        wrapper.appendChild(button);

        wrapper.appendChild(
            removeButton
        );


        favoritesContainer.appendChild(
            wrapper
        );

    });

}


// ========================================
// ALERTS
// ========================================

function displayAlerts(alerts) {

    alertsContainer.innerHTML = "";


    if (!alerts || !alerts.length) {

        alertsContainer.innerHTML = `

            <p class="no-alert">
                ✅ No active weather alerts.
            </p>

        `;

        return;

    }


    alerts.forEach(alert => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "alert-card";


        div.innerHTML = `

            <h3>
                ⚠️ ${alert.event}
            </h3>

            <p>
                <strong>Source:</strong>
                ${alert.sender_name}
            </p>

            <p>
                ${alert.description}
            </p>

        `;


        alertsContainer.appendChild(
            div
        );

    });

}


// ========================================
// LOADING
// ========================================

function showLoading() {

    loading.style.display =
        "block";

    loading.textContent =
        "⏳ Loading weather data...";

    errorMessage.style.display =
        "none";

}


function hideLoading() {

    loading.style.display =
        "none";

}


// ========================================
// ERROR
// ========================================

function showError(message) {

    loading.style.display =
        "none";

    errorMessage.style.display =
        "block";

    errorMessage.textContent =
        message;

}


function clearError() {

    errorMessage.style.display =
        "none";

    errorMessage.textContent =
        "";

}