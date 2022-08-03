let searchform = $("#search-form");
let searchHistory = $("#prev-search");
let weather = $("#current-date");
let forecast = $("#5-day-forecast");
let forecastTitle= $("#forecast-title")

let cityArr = [];
let isClearing = false;
let clearMessageCode;

let today = dayjs();

function init() {
    searchform.children("button").on("click", getData);
    searchHistory.children("button").on("click", getData);
    initiateStorage();
    initiatePrev();
}

// Stores searches in localstorage
function initiateStorage() {
    if(localStorage.getItem("cityArr") !== null) {
        cityArr = JSON.parse(localStorage.getItem("cityArr"));
    }
    localStorage.setItem("cityArr", JSON.stringify(cityArr));
}

//appends stored searches to the search history tab
function initiatePrev() {
    let i = 0;
    while(i < cityArr.length && i < 10) {
        let prev = $("<button>");
        prev.text(`${cityArr[i]}`);
        prev.attr("class", "col-8 my-1 btn btn-dark");
        searchHistory.append(prev);
        i++;
    }
    searchHistory.children("button").on("click", getData)
}

//takes value from search and uses lat and longitude of area for query to get information
function getData(event) {
    event.preventDefault();
    let city = "";
    if(event.target.textContent === "Search") {
        city = searchform.children("input").val();
        searchform.children("input").val("");
    }
    else {
        city = event.target.textContent;
    }
    city = city.toUpperCase();
    if(!city) {
        invalidInput();
        return;
    }

    let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=64f2ee2a8261daa4d9f780f5b365f275&units=metric`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(data.length) {
                let lat = data[0].lat;
                let lon = data[0].lon;
                requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=64f2ee2a8261daa4d9f780f5b365f275&units=metric`;
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        displayWeather(data, city);    
                        displayForecast(data);
                        saveCity(city);   
                    });
            } else {
                invalidInput();
            }
        });
}

function invalidInput() {
    if(!isClearing) {
        let messageSpace = $("<p>");
        messageSpace.text("Please provide a valid city");
        messageSpace.css("color", "red");
        searchform.append(messageSpace); 
        clearAnswer();  
    } else {
        clearAnswer();
    }
}

function clearAnswer() {
    if(isClearing) {
        isClearing = false;
        clearTimeout(clearMessageCode);
        clearAnswer();
    } else {
        isClearing = true;
        clearMessageCode = setTimeout(function() {
            searchform.children().eq(3).remove();
            isClearing = false;
        }, 1500);
    }
}

// Shows the current weather
function displayWeather(data, city) {
    let title = weather.children().eq(0).children("h2")
    let conditions = weather.children().eq(0).children("img");
    let temp = weather.children().eq(1);
    let wind = weather.children().eq(2);
    let humidity = weather.children().eq(3);
    let uvIndex = weather.children().eq(4);
    
    weather.addClass("card bg-light mb-3");

    title.text(`${city} ${today.format("MM/DD/YYYY")}`);
    conditions.attr("src",`https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
    temp.text(`Temp: ${data.current.temp}°C`);
    wind.text(`Wind: ${Math.round((data.current.wind_speed * 3.6))} kph`);
    humidity.text(`Humidty: ${data.current.humidity}%`);
    uvIndex.text(`UV Index: ${data.current.uvi}`);

    let uv = data.current.uvi;
    if(uv < 4) {
        uvIndex.css("background-color", "green");
    }else if(uv < 7) {
        uvIndex.css("background-color", "yellow");
    }else {
        uvIndex.css("background-color", "red");
    }
    
}

// 5 day forecast
function displayForecast(data) {
    forecastTitle.css("visibility", "visible");
    for(let i = 0; i < 5; i++) {
        let date = forecast.children().eq(i).children().eq(0);
        let conditions = forecast.children().eq(i).children("img");
        let temp = forecast.children().eq(i).children().eq(2);
        let wind = forecast.children().eq(i).children().eq(3);
        let humidity = forecast.children().eq(i).children().eq(4);

        forecast.children().eq(i).addClass("card text-white bg-dark mb-3 mx-1")

        let index = i + 1;
        date.text(today.add((i + 1), "d").format("MM/DD/YYYY"));
        conditions.attr("src",`https://openweathermap.org/img/w/${data.daily[index].weather[0].icon}.png`);
        temp.text(`Temp: ${data.daily[index].temp.day}°C`);
        wind.text(`Wind: ${Math.round(data.daily[index].wind_speed * 3.6)} kph`);
        humidity.text(`Humidity: ${data.daily[index].humidity}%`);
    }
}

// Saves cities to localstorage
function saveCity(city) {
    if(localStorage.getItem("cityArr") !== null) {
        cityArr = JSON.parse(localStorage.getItem("cityArr"));
    }
    while(cityArr.length > 9) {
        cityArr.pop();
    }
    for(let i = 0; i < cityArr.length; i++) {
        if(city === cityArr[i]) {
            return
        }
    }
    cityArr.reverse();
    cityArr.push(city);
    cityArr.reverse();
    
    localStorage.setItem("cityArr", JSON.stringify(cityArr));
    updatePrev();
}

// Adds buttons until it reaches the max and then replaces the oldest search
function updatePrev() {
    if(cityArr.length < 10) {
        let prev = $("<button>");
        prev.text(`${cityArr[0]}`);
        prev.attr("class", "col-8 my-1 btn btn-dark");
        searchHistory.append(prev);
    } else {
        for(let i = 0; i < 10; i++) {
            searchHistory.children().eq(i).text(cityArr[i]);
        }
    }    
}

init();