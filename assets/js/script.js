var key = 'bd61b721840998375efc9f89c8e77c6c';
let searchForm = $("#search-form");
let searchHistory = $("#search-history");
let currentWeather = $("#today");
let weeklyWeather = $("#5-day-forecast");
let weeklyTitle = $("#5-day-title");

var date = moment().format('dddd, MMMM Do YYYY');
var cityHist = [];

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



