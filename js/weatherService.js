// ========================================
// WEATHER SERVICE
// ========================================

class WeatherService {

    constructor(apiKey) {

        this.apiKey = apiKey;

        this.baseUrl =
            "https://api.openweathermap.org/data/2.5";

        this.geoUrl =
            "https://api.openweathermap.org/geo/1.0";

    }


    // ========================================
    // CURRENT WEATHER BY CITY
    // ========================================

    async getCurrentWeather(city) {

        const url =
            `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`;

        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "City not found. Please check the city name."
                );

            }

            if (response.status === 401) {

                throw new Error(
                    "Invalid API key."
                );

            }

            throw new Error(
                "Unable to fetch weather data."
            );

        }

        return await response.json();

    }


    // ========================================
    // 5-DAY FORECAST BY CITY
    // ========================================

    async getForecast(city) {

        const url =
            `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}`;

        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 401) {

                throw new Error(
                    "Invalid API key."
                );

            }

            throw new Error(
                "Unable to fetch forecast data."
            );

        }

        return await response.json();

    }


    // ========================================
    // CURRENT WEATHER BY COORDINATES
    // ========================================

    async getWeatherByCoordinates(
        latitude,
        longitude
    ) {

        const url =
            `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;

        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 401) {

                throw new Error(
                    "Invalid API key."
                );

            }

            throw new Error(
                "Unable to fetch weather for your location."
            );

        }

        return await response.json();

    }


    // ========================================
    // FORECAST BY COORDINATES
    // ========================================

    async getForecastByCoordinates(
        latitude,
        longitude
    ) {

        const url =
            `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch location forecast."
            );

        }

        return await response.json();

    }


    // ========================================
    // CITY SEARCH / AUTOCOMPLETE
    // ========================================

    async searchCities(query) {

        if (!query || query.length < 2) {

            return [];

        }


        const url =
            `${this.geoUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            return [];

        }


        return await response.json();

    }


    // ========================================
    // WEATHER ALERTS
    // ========================================

    async getAlerts(latitude, longitude) {

        const url =
            `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily&units=metric&appid=${this.apiKey}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            return [];

        }


        const data =
            await response.json();


        return data.alerts || [];

    }

}
