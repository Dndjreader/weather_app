const API_KEY = '4018b877ee834ba29ab200154233101';
const locationInput = document.getElementById("location-input");
const submitBtn = document.getElementById("submit")
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const searchValue = 14;

// Get HTML elements for search list
const searchList = document.getElementById("search-list")

// Get HTML for time container
const timeHeading = document.getElementById("time-heading")
const timeTemp = document.getElementById("time-temp")
const timeCondition = document.getElementById("time-condition")
const timeChanceRain = document.getElementById("time-chance-rain")
const timeWindSpeed = document.getElementById("time-wind-speed")
const timeWindDirection = document.getElementById("time-wind-direction")
const timeContainer = document.getElementById("time-container")

// Get HTML elements for day container
const dayHeading = document.getElementById("day-heading")
const dayTemp = document.getElementById("day-temp")
const dayCondition = document.getElementById("day-condition")
const dayChanceRain = document.getElementById("day-chance-rain")
const daySunrise = document.getElementById("day-sunrise")
const daySunset = document.getElementById("day-sunset")
const dayContainer = document.getElementById("day-container")

// Get HTML Elements for main output
const locationOutput = document.getElementById("location");
const tempOutput = document.getElementById("temperature");
const conditionOutput = document.getElementById("condition");
const imageOutput = document.getElementById("image");
const dateOutput = document.getElementById("date")

// Gets the current time as an Integer
function getCurrentTime() {
    const date = new Date();
    let time = date.getHours();
    return time;
}

// Converts Int to string based on 12h clock
function convertTime(int) {
    let currentTime = ""
    if (int > 23) {
        return
    } else if (int === 12) {
        currentTime = "12pm";
    } else if (int > 12) {
        currentTime = int - 12
        currentTime = currentTime.toString() + "pm"
    } else if (int === 0) {
        currentTime = "12am"
    } else {
        currentTime = int.toString() + "am"
    }
    return currentTime
}

// Gets todays date and amends to shorthand
function currentDate() {
    const fullDate = new Date();
    
    // Get full name of current day
    const day = fullDate.getDay();
    const todayDay = days[day]

    // Get date of current day
    const date = fullDate.getDate();
    let todayDate = ""
    if (date === 1 || date === 21 || date === 31) {
        todayDate = date.toString() + "st"
    } else if (date === 2 || date === 22) {
        todayDate = date.toString() + "nd"
    } else if (date === 3 || date === 23) {
        todayDate = date.toString() + "rd"
    } else {
        todayDate = date.toString() + "th"
    }

    //Get current month
    const month = fullDate.getMonth();
    const currentMonth = months[month]

    //Add all into string to create full date
    const currentDate = `${todayDay} ${todayDate} ${currentMonth}`

    return currentDate
}

// Using the Date gets the day name from array
function getDayName(int) {
    const fullDate = new Date(int)
    const day = fullDate.getDay()

    // Get full name of current day
    const shortDay = shortDays[day]
    return shortDay
}
    
// Function to retrieve data for main output
function getCurrentData(result) {

    // Get location from input
    // const locationValue = document.getElementById("location-input").value;

    // URL to access Weather API
    const URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${result}`;
    
    // Get information using API
    axios.post(URL).then(response => {
        data = response.data
        const date = currentDate()

        dayContainer.classList.remove("opacity")
        timeContainer.classList.remove("opacity")

        // Output updated values using data from API
        locationOutput.innerText = `${data.location.name}, ${data.location.country}`;
        tempOutput.innerText = `${data.current.temp_c}°C`;
        conditionOutput.innerText = data.current.condition.text;
        imageOutput.innerHTML = `
            <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
        `;
        dateOutput.innerText = date;  
        locationInput.value = "";      
    })

    // Shows Error if bad request
    .catch(error => {
        console.error('On get weather error')

        dayContainer.classList.add("opacity")
        timeContainer.classList.add("opacity")

        // Output updated values as error
        tempOutput.innerText = "";
        conditionOutput.innerText = "";
        imageOutput.innerHTML = "";
        dateOutput.innerText = ""; 

        //  Reset all HTML
        timeHeading.innerHTML = ""
        timeTemp.innerHTML = ""
        timeCondition.innerHTML = ""
        timeChanceRain.innerHTML = ""
        timeWindSpeed.innerHTML = ""
        timeWindDirection.innerHTML =""
        dayHeading.innerHTML = ""
        dayTemp.innerHTML = ""
        dayCondition.innerHTML = ""
        dayChanceRain.innerHTML = ""
        daySunrise.innerHTML = ""
        daySunset.innerHTML = ""
    })
};

// Function to retrieve data for time-container
function getTimeData(result) {

    // Get location from input
    // const locationValue = document.getElementById("location-input").value;
    const FORECAST = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${result}&days=${searchValue}`;

    axios.post(FORECAST).then(response => {
        data = response.data.forecast.forecastday

        // Use function to get current time
        const timeInt = getCurrentTime()

        // get data for today and tomorrow for each hour
        const todayHourly = data[0].hour
        const tomorrowHourly = data[1].hour

        // Adds first row of HTML for time table
        timeHeading.innerHTML = `<th></th>`
        timeTemp.innerHTML = `<td class="left bold">Temp</td>`
        timeCondition.innerHTML = `<td class="left bold">Condition</td>`
        timeChanceRain.innerHTML = `<td class="left bold">% Rain</td>`
        timeWindSpeed.innerHTML = `<td class="left bold">Wind Speed</td>`
        timeWindDirection.innerHTML = `<td class="left bold">Direction</td>`

        // Creates variables to amend and input for table based on time
        let time = 0
        let temp = 0
        let condition = ""
        let conditionImg = ""
        let chanceOfRain = 0
        let windSpeed = 0
        let windDirection = ""

        // Loop to go through next 7 hours and create HTML table columns based on values
        for (let i = 0, j = 0; i < data.length; i++) {
            if (timeInt + i <= 23) {
                time = timeInt + i
                temp = todayHourly[timeInt + i].temp_c
                condition = todayHourly[timeInt + i].condition.text
                conditionImg = todayHourly[timeInt + i].condition.icon
                chanceOfRain = todayHourly[timeInt + i].chance_of_rain
                windSpeed = todayHourly[timeInt + i].wind_mph
                windDirection = todayHourly[timeInt + i].wind_dir
                j++
            } else {
                time = 0 + (i - j)
                temp = tomorrowHourly[0 + (i - j)].temp_c
                condition = tomorrowHourly[0 + (i - j)].condition.text
                conditionImg = tomorrowHourly[0 + (i - j)].condition.icon
                chanceOfRain = tomorrowHourly[0 + (i - j)].chance_of_rain
                windSpeed = tomorrowHourly[0 + (i - j)].wind_mph
                windDirection = tomorrowHourly[0 + (i - j)].wind_dir
            }
            
            timeHeading.innerHTML += `<th class="center">${convertTime(time)}</th>`
            timeTemp.innerHTML += `<td class="center">${temp}°C</td>`
            timeCondition.innerHTML += `<td class="center"><img src="${conditionImg}" alt="${condition}"><p class="condition-text">${condition}</p></td>`
            timeChanceRain.innerHTML += `<td class="center">${chanceOfRain}%</td>`
            timeWindSpeed.innerHTML += `<td class="center">${windSpeed}mph</td>`
            timeWindDirection.innerHTML += `<td class="center">${windDirection}</td>`
            
            
        }
    });
}

// Function to retrieve data for day container
function getDayData(result) {

    // Get location from input
    // const locationValue = document.getElementById("location-input").value;
    const FORECAST = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${result}&days=${searchValue}`;

    axios.post(FORECAST).then(response => {
        data = response.data.forecast.forecastday

        // Adds first row of HTML for time table
        dayHeading.innerHTML = `<th></th>`
        dayTemp.innerHTML = `<td class="left bold">Temp</td>`
        dayCondition.innerHTML = `<td class="left bold">Condition</td>`
        dayChanceRain.innerHTML = `<td class="left bold">% Rain</td>`
        daySunrise.innerHTML = `<td class="left bold">Sunrise</td>`
        daySunset.innerHTML = `<td class="left bold">Sunset</td>`

        // Loop to go through next hours and create HTML table columns based on values
        for (let i = 0; i < data.length; i++) {
            // get date epoch and get day name on short name
            let dayEpoch = data[i].date

            dayHeading.innerHTML += `<th class="center">${getDayName(dayEpoch)}</th>`
            dayTemp.innerHTML += `<td class="center">${data[i].day.avgtemp_c}°C</td>`
            dayCondition.innerHTML += `<td class="center"><img src="${data[i].day.condition.icon}" alt="${condition}"><p class="condition-text">${data[i].day.condition.text}</p></td>`
            dayChanceRain.innerHTML += `<td class="center">${data[i].day.daily_chance_of_rain}%</td>`
            daySunrise.innerHTML += `<td class="center">${data[i].astro.sunrise}</td>`
            daySunset.innerHTML += `<td class="center">${data[i].astro.sunset}</td>`            
        }
    });
}

// function to process all data required to generate page
function getAllData(result) {
    getCurrentData(result)
    getTimeData(result)
    getDayData(result)
    searchList.innerHTML = ""
    searchList.classList.add("inactive")
    searchList.classList.remove("active")

}

// Function to search API and create list based on results
function search() {

    // Get location from input and retireve data from API
    const locationValue = document.getElementById("location-input").value;
    const searchURL = `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${locationValue}`
    
    // Ensures input meets search length
    if (locationValue.length < 3) {
        searchList.innerHTML = ""
        searchList.classList.add("inactive")
        searchList.classList.remove("active")
    }
    else if (locationValue.length > 2) {
        // Get information using API
        axios.post(searchURL).then(response => {
            data = response.data
            searchList.innerHTML = ""
            searchList.classList.remove("inactive")
            searchList.classList.add("active")
            for (let i = 0; i < data.length; i++) {
                searchList.innerHTML += `
                    <li id="${data[i].region}" class="search-result"><span class="search-left">${data[i].region}</span><span class="search-right">${data[i].country}</span></li>
                `
                
            }
            
            let searchResult = document.querySelectorAll(".search-result");
            searchResult.forEach(result => result.addEventListener("click", amendValue));
        });

    }    
}

function amendValue() {
    let result = this.id
    locationInput.value = result
    getAllData(result)
}


// Event Listener on change of input to retrieve all data and amend page
locationInput.addEventListener("keyup", search);
submitBtn.addEventListener("click", function submitValue(e) {
    e.preventDefault()
    getAllData(locationInput.value)
})



