let mainDiv = document.querySelector("main");

document.getElementById("LocationSearchBtn").addEventListener("click", () => {
  let serchLocation = document.getElementById("location").value;
  if (serchLocation != "" || serchLocation != "") {
    GetTheWetherInformation(serchLocation);
  }
});

// The below code will suggest the place name to user they want to search
let suggestionBox = document.getElementsByClassName("suggestions")[0];
let suggestionIndex = -1;

document.getElementById("location").addEventListener("keyup", (event) => {
  let serchLocation = document.getElementById("location").value.toLowerCase();
  suggestionBox.innerHTML = "";
  let suggest = [];
  cities.forEach((element) => {
    let city = element.slice(0, serchLocation.length);
    if (city == serchLocation && city != "") {
      suggest.push(element);
      suggestionBox.style = `display:block`;
    }
  });
  suggest.forEach((element) => {
    document.querySelector(
      ".suggestions"
    ).innerHTML += `<p onclick="putThis('${element}')" value="${element}"><ion-icon name="location-sharp"></ion-icon> ${element}</p>`;
  });

  if (
    (serchLocation =
      document.getElementById("location").value == "" || suggest.length == 0)
  ) {
    suggestionBox.style = `display:none`;
    suggestionIndex = -1;
    suggestionBox.scrollTo(0, 0);
  }

  if (event.keyCode == 40 && suggest.length != 0) {
    let suggestionList = document.querySelectorAll(".suggestions p");
    suggestionList.forEach((element) => {
      element.classList.remove("selected");
    });
    if (suggestionIndex < suggestionList.length) {
      suggestionList[++suggestionIndex].classList.add("selected");
    }
    if (suggestionIndex >= 7) {
      suggestionBox.scrollTo({
        top: 260,
        left: 0,
        behavior: "smooth",
      });
    }
    if (suggestionIndex >= 15) {
      suggestionBox.scrollTo({
        top: 500,
        left: 0,
        behavior: "smooth",
      });
    }
  } else if (event.keyCode == 38 && suggest.length != 0) {
    let suggestionList = document.querySelectorAll(".suggestions p");
    suggestionList.forEach((element) => {
      element.classList.remove("selected");
    });
    if (suggestionIndex > -1) {
      suggestionList[--suggestionIndex].classList.add("selected");
    }
    if (suggestionIndex <= 7) {
      suggestionBox.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
    if (suggestionIndex <= 15) {
      suggestionBox.scrollTo({
        top: 260,
        left: 0,
        behavior: "smooth",
      });
    }
  } else if (event.keyCode == 13 && suggest.length != 0) {
    let suggestionList = document.querySelectorAll(".suggestions p");
    let city = suggestionList[suggestionIndex];
    putThis(city.getAttribute("value"));
  }
});

// this function will fill the search bar with the selected name
function putThis(str) {
  document.getElementById("location").value = str;
  suggestionBox.style = `display:none`;
}

function GetTheWetherInformation(citySearched) {
  const apiKey = "308a072e5f262037ba16d88271c6d127";
  const city = citySearched;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const tempInC = Math.round(data.main.temp - 273.15);
      const leftSide = document.querySelector(".left-side");
      const date = new Date(data.dt * 1000);
      const options = { weekday: "long", day: "numeric", month: "long" };
      const formattedDate = date.toLocaleString("en-US", options);
      const lon = data.coord.lon;
      const lat = data.coord.lat;
      leftSide.innerHTML = `
      <div class="weatherCard">
                    <h4>Now</h4>
                    <div class="temp">
                        <h1>${tempInC}<span><img src="SVGImages/celsius.svg" alt="" id="celcius"></span></h1>
                        <img src="SVGImages/${data.weather[0].icon}.png" alt="">
                    </div>
                    <div class="weaterCondition">
                        <h3>${data.weather[0].main}</h3>
                        <h4>${data.weather[0].description}</h4>
                    </div>
                    <div class="moreDetails">
                        <h4><ion-icon name="calendar-clear"></ion-icon>${formattedDate}</h4>
                        <h4><ion-icon name="location"></ion-icon>${data.name}, ${data.sys.country}</h4>
                    </div>
                </div>
                <div class="coords">
                    <h4>Lon : ${lon}</h4>
                    <h4>Lat : ${lat}</h4>
                </div>`;

      fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((airData) => {
          const rightSide = document.querySelector(".right-side");
          let sunrise = new Date(data.sys.sunrise * 1000);
          let sunset = new Date(data.sys.sunset * 1000);
          const visibility = Math.round(data.visibility / 1000);
          let AirQuality = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
          var backgroundColors = ["Green", "Yellow", "Orange", "Red", "Purple"];
          let sunMin = Number(sunrise.getMinutes());
          let moonMin = Number(sunset.getMinutes());
          if (sunMin < 10) {
            sunMin = "0" + sunMin;
          }
          if (moonMin < 10) {
            moonMin = "0" + moonMin;
          }
          rightSide.innerHTML = `
          <div style="width:100%;height:100%; padding:2rem;">
          <h4>Todays Highlights</h4>
                    <div class="firstRow">
                        <div class="airQIndex">
                            <div class="flex">    
                                <p class="box-label">Air Quality Index</p>
                                <p id="AirQuality" style="background:${
                                  backgroundColors[airData.list[0].main.aqi]
                                };">${AirQuality[airData.list[0].main.aqi]}</p>
                            </div>
                            <div class="percentage">
                                <h3 class="logo"><img src="SVGImages/airIcon.svg" alt=""></h3>
                                <div class="airUnit">
                                    <div>
                                        <p class="gas">PM25</p>
                                        <h3 class="gasPer">${
                                          airData.list[0].components.pm2_5
                                        }</h3>
                                    </div>
                                    <div>
                                        <p class="gas">SO2</p>
                                        <h3 class="gasPer">${
                                          airData.list[0].components.so2
                                        }</h3>
                                    </div>
                                    <div>
                                        <p class="gas">NO2</p>
                                        <h3 class="gasPer">${
                                          airData.list[0].components.no2
                                        }</h3>
                                    </div>
                                    <div>
                                        <p class="gas">O3</p>
                                        <h3 class="gasPer">${
                                          airData.list[0].components.o3
                                        }</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sunMove">
                            <p class="box-label">Sunrise & Sunset</p>
                            <div class="content">
                                <div class="sunrise">
                                    <p>Sunrise</p>
                                    <div>
                                        <h3 class="logo"><img src="SVGImages/sunIcon.svg" alt=""></h3>
                                        <h3 class="unit">${sunrise.getHours()}:${sunMin} AM</h3>
                                    </div>
                                </div>
                                <div class="sunset">
                                    <p>Sunset</p>
                                    <div>
                                        <h3 class="logo"><img src="SVGImages/moonIcon.svg" alt=""></h3>
                                        <h3 class="unit">${sunset.getHours()}:${moonMin} PM</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="secondRow">
                    <div class="humidity">
                        <p class="box-label">Humidity</p>
                        <div class="content">
                            <h3 class="logo"><img src="SVGImages/humidity.svg" alt=""></h3>
                            <h3 class="unit">${
                              data.main.humidity
                            }<span>%</span></h3>
                        </div>
                    </div>
                    <div class="pressure">
                        <p class="box-label">Pressure</p>
                        <div class="content">
                            <h3 class="logo"><img src="SVGImages/pressure.svg" alt=""></h3>
                            <h3 class="unit">${
                              data.main.pressure
                            }<span>hPa</span></h3>
                        </div>
                    </div>
                    <div class="visiblity">
                        <p class="box-label">Visiblity</p>
                        <div class="content">
                            <h3 class="logo"><img src="SVGImages/eyeIcon.svg" alt=""></h3>
                            <h3 class="unit">${visibility}<span>km</span></h3>
                        </div>
                    </div>
                    <div class="feelsLike">
                        <p class="box-label">Feels Like</p>
                        <div class="content">
                            <h3 class="logo"><img src="SVGImages/tempIcon.svg" alt=""></h3>
                            <h3 class="unit">${Math.round(
                              data.main.feels_like - 273.15
                            )}<span>&deg;c</span></h3>
                        </div>
                    </div>
                </div>
                </div>
                `;
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  GetTheWetherInformation('mumbai');
})
