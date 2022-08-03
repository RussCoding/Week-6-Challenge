var key = 'bd61b721840998375efc9f89c8e77c6c';
let searchForm = $("#search-form");
let searchHistory = $("#search-history");
let currentWeather = $("#today");
let weeklyWeather = $("#5-day-forecast");
let weeklyTitle = $("#5-day-title");

var date = moment();
var cityHist = [];

function init() {
    searchForm.children("button").on("click", getData)
}

function storeCities() {
    if(localStorage.getItem("cityHist") !== null) {
        cityHist = JSON.parse(localStorage.getItem("cityHist"));
    }
    localStorage.setItem("cityHist", JSON.stringify(cityHist));
}

function printCities() {
    let i = 0;
    while (i < cityHist.length && i < 8) {
        let city = $("<button>");
        city.text(`${cityHist[i]}`);
        searchHistory.append(city);
        i++;
    }
    searchHistory.children("button").on("click", getData);
}

function getData(e) {
    e.preventDefault();
    let city = "";
    if(e.target.textContent === "Search") {
        city = searchForm.children("input").val();
        //clears search bar after a search
        searchForm.children("input").val("");
    }
    else {
        city = e.target.textContent;
    }
    city = city.toUpperCase();

    let requestURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}&units=metric`;
    fetch(requestURL)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        if(data.length) {
            let lattitude = data[0].lat;
            let longitude = data[0].lon;
            requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
            fetch(requestURL)
            .then (function (res) {
                return res.json();
            })
            .then(function(data) {
                displayWeather(data, city);
                displayForecast(data);
                saveCity(city);
            });
        }
    });
}

function displayWeather(data, city) {
    //assigns variable to html weather elements
    let title = currentWeather.children().eq(0).children("h2");
    let weatherImage = currentWeather.children().eq(0).children("img");
    let temp = currentWeather.children().eq(1);
    let wind = currentWeather.children().eq(2);
    let humidity = currentWeather.children().eq(3);
    let uV = currentWeather.children().eq(4);
    currentWeather.addClass("card bg-secondary mb-3");

    title.text(`${city}: ${date.format('dddd, MMMM Do YYYY')}`);
    weatherImage.attr("src", `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
    temp.text(`Temperature: ${data.current.temp}°C`);
    wind.text(`Wind Speed: ${Math.round((data.current.wind_speed * 3.6))} km/h`);
    humidity.text(`Humidty: ${data.current.humidity}%`);
    uV.text(`UV Index: ${data.current.uvi}`);

    let uvIndex = data.current.uvi;
    if(uvIndex < 4) {
        uvIndex.css("background-color", "green");
    }else if(uv < 7) {
        uvIndex.css("background-color", "yellow");
    }else {
        uvIndex.css("background-color", "red");
    }
}


function displayForecast(data) {
    for(let i = 0; i<5; i++) {
        let dates = weeklyWeather.children().eq(i).children().eq(0);
        let weatherImage = weeklyWeather.children().eq(i).children("img");
        let temp = weeklyWeather.children().eq(i).children().eq(2);
        let wind = weeklyWeather.children().eq(i).children().eq(3);
        let humidity = weeklyWeather.children().eq(i).children().eq(4);

        weeklyWeather.children().eq(i).addClass("card bg-secondary mb-3 mx-1");

        let index = i+1;
        dates.text(date.add(index, 'days').format("MMM Do YY"));
        weatherImage.attr("src", `https://openweathermap.org/img/w/${data.daily[index].weather[0].icon}.png`);
        temp.text(`Temp: ${data.daily[index].temp.day}°C`);
        wind.text(`Wind: ${Math.round(data.daily[index].wind_speed * 3.6)} kph`);
        humidity.text(`Humidity: ${data.daily[index].humidity}%`);
    }
}


