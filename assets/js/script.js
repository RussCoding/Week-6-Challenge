var key = 'bd61b721840998375efc9f89c8e77c6c';
let searchForm = $("#search-form");
let searchHistory = $("#search-history");
let currentWeather = $("#today");
let weeklyWeather = $("#5-day-forecast");
let weeklyTitle = $("#5-day-title");

var date = moment().format('dddd, MMMM Do YYYY');
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
    let title = currentWeather.children().eq(0).children("h2");
    let weatherImage = currentWeather.children().eq(0).children("img");
    let temp = currentWeather.children().eq(1);
    let wind = currentWeather.children().eq(2);
    let humidity = currentWeather.children().eq(3);
    let uV = currentWeather.children().eq(4);
    currentWeather.addClass("card bg-secondary")
}




