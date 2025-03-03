const apiKey = '65d2437913b4ca9e4074527c1243bf34';
const infoGeolocation = document.querySelector('#infoGeo')
const weatherBlock = document.getElementById('weather')

function getWeatherByCoords(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка при запросе к API');
      }
      return response.json();
    })
    .then((data) => {
      updateWeather(data);
    })
    .catch((error) => {
      console.error('Ошибка:', error);
    });
}

function updateWeather(data) {
  let city = document.getElementById('city');
  let temp = document.getElementById('temp');
  let humidity = document.getElementById('humidity');
  let wind = document.getElementById('wind');
  city.innerHTML = 'Погода в: ' + data.name;
  temp.innerHTML = Math.round(data.main.temp) + '°C';
  humidity.innerHTML = 'Влажность: ' + data.main.humidity + '%';
  wind.innerHTML = 'Ветер: ' + data.wind.speed + ' м/с';
  showWeatherIcon(data.weather[0].main, data.weather[0].description);
}

function getUserLocation() {
  displayInformation('Геолокация не поддерживается вашим браузером.')
  if (!navigator.geolocation) {
    console.log('Геолокация не поддерживается вашим браузером.');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    infoGeolocation.classList.add('none')
    weatherBlock.classList.remove('none')
    const { longitude, latitude } = position.coords;
    getWeatherByCoords(latitude, longitude);
  }

  function error() {
    displayInformation('Не получается определить вашу геолокацию :(')
  }
}

function getWeatherByCity() {
  infoGeolocation.classList.add('none')
  weatherBlock.classList.remove('none')
  let input = document.querySelector('input');
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${input.value}&appid=${apiKey}`
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка при запросе к API');
      }
      return response.json();
    })
    .then((data) => {
      getWeatherByCoords(data[0].lat, data[0].lon)

    })
    .catch((error) => {
      displayInformation('Данный город не найден')
    });
}


function displayInformation(text) {
  infoGeolocation.classList.remove('none')
  weatherBlock.classList.add('none')
  infoGeolocation.innerHTML = text?.length ? text : 'Геолокация не поддерживается вашим браузером.'
}