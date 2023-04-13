/**
 * CRITERIA
 */

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
var cityDetail = document.querySelector('#cityDetail');
var enterCity = document.querySelector('#enterCity');
var apiKey = "4c8f1b657ab5e2cea46887cf879a3d5e";
var today = moment().format('L');
var searchHistoryList = [];
var cityhtml = document.querySelector('#currentCity');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var fiveDay = document.querySelector('#fiveDay')
var uvIndex = document.querySelector('#uvIndex')

// function for current condition
function currentCondition(city) {

    // var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`, {
        method: "GET"
    }).then(function(data) {
        return data.json();
    })
        .then(function(data) {

        
        var mainIconURL = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.main}" />`;
        var currentCity = `
            <h2 id="currentCity">
                ${data.name} ${today} ${mainIconURL} 
            </h2>
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Humidity: ${data.main.humidity}\%</p>
            <p>Wind Speed: ${data.wind.speed} MPH</p>
        `;

        var currentCityHTML = document.createElement('p');
        currentCityHTML.innerHTML = currentCity;
        cityDetail.append(currentCityHTML)



        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`, {
            method: "GET"
        }).then(function(data) {
            return data.json();
        })
            .then(function(data) {
            

            var uv = data.value;
            var uv = `
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uv}</span>
            `;
            var uvIndexHTML = document.createElement('p');
            uvIndexHTML.innerHTML = uv;
          
            
            uvIndex.append(uvIndexHTML)

            futureCondition(lat, lon);
            cityList()
        });
    });
}

function futureCondition(lat, lon) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`, {
        method: "GET"
    }).then(function(futureData) {
        return futureData.json();
    })
        .then(function(futureData) {
            console.log(futureData)
        for (let i = 1; i < 40;) {
            if(i>30){
                i+=6
            }else{
            i+= 8
            } 
            var cityInfo = {
                date: futureData.list[i].dt,
                icon: futureData.list[i].weather[0].icon,
                temp: futureData.list[i].main.temp_max,
                wind: futureData.list[i].wind.speed,
                humidity: futureData.list[i].main.humidity
            };
            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureData.list[i].main}" />`;
            var fiveDayHTML =`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>Temp: ${cityInfo.temp}°F ${iconURL}</p>
                            <p>Wind: ${cityInfo.wind} MPH</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `;
            var fiveDayP = document.createElement('p');
            fiveDayP.innerHTML = fiveDayHTML;
          
            
            fiveDay.append(fiveDayP)
            // $("#fiveDay").append(futureCard);
        }
    }); 
}

// add on click event listener 
searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(!cityDetail.lastElementChild == null){
        removeOldInfo()
        cityDetail.lastElementChild.remove()
        uvIndex.lastElementChild.remove()
        }
    var city = enterCity.value.trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = `
            <button class="list-group-item" id="btnEventCheck" onclick="return cityList()">${city}</button>
            `;

            var searchedCityHTML = document.createElement('p');
            searchedCityHTML.innerHTML = searchedCity;
          
            
            searchHistory.append(searchedCityHTML)

    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
});

function cityList(event) {
    // event.preventDefault();
    if(!cityDetail.lastElementChild == null){
    removeOldInfo()
    cityDetail.lastElementChild.remove()
    uvIndex.lastElementChild.remove()
    }
    var city = enterCity.value.trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = `
            <button class="list-group-item" id="btnEventCheck" onclick="return cityList2()">${city}</button>
            `;

            var searchedCityHTML = document.createElement('p');
            searchedCityHTML.innerHTML = searchedCity;
          
            
            searchHistory.append(searchedCityHTML)

        // $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));

}


$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        for (let i = 0; i < searchHistoryArr.length;i++) {
        console.log(`Last searched city: ${lastSearchedCity}`);
        var lastSearchedIndex = i;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        // currentCondition(lastSearchedCity);
        if (!searchHistoryList.includes(lastSearchedCity)) {
            searchHistoryList.push(lastSearchedCity);
            var searchedCity = `
                <button class="list-group-item" id="btnEventCheck" onclick="return cityList()">${lastSearchedCity}</button>
                `;
    
                var searchedCityHTML = document.createElement('p');
                searchedCityHTML.innerHTML = searchedCity;
              
                
                searchHistory.append(searchedCityHTML)
        }
    }}
});

function removeOldInfo () {
    for (let i = 0; i < 5; i++) {
        fiveDay.lastElementChild.remove()
}}
