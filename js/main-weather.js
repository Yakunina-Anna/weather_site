const apiKey = '65d2437913b4ca9e4074527c1243bf34';
const infoGeolocation = document.querySelector('#infoGeo')
const weatherBlock = document.getElementById('weather')

function getWeatherByCoords(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(`${response.status}: ${errorData.message || 'Неизвестная ошибка'}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!data?.name) {
        throw new Error('Получены некорректные данные от сервера.');
      }
      updateWeather(data);
    })
    .catch((error) => {
      displayInformation(`Произошла ошибка: ${error.message}`);
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
  infoGeolocation.classList.add('none');
  weatherBlock.classList.remove('none');

  const input = document.querySelector('input');
  if(!input.value) {
    displayInformation('Пожалуйста, введите название города.');
    return;
  }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input.value}&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(`${response.status}: ${errorData.message || 'Неизвестная ошибка'}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!data?.length ) {
        throw new Error('Город не найден. Пожалуйста, проверьте правильность названия.');
      }
      getWeatherByCoords(data[0].lat, data[0].lon);
    })
    .catch((error) => {
      if (error.message.includes('401')) {
        displayInformation('Ошибка авторизации. Проверьте ваш API-ключ.');
      } else if (error.message.includes('404')) {
        displayInformation('Город не найден. Пожалуйста, проверьте правильность названия.');
      } else if (error.message.includes('500')) {
        displayInformation('Произошла ошибка на сервере. Попробуйте позже.');
      } else {
        displayInformation(`Произошла ошибка: ${error.message}`);
      }

      console.error(error);
    });
}


function displayInformation(text) {
  infoGeolocation.classList.remove('none')
  weatherBlock.classList.add('none')
  infoGeolocation.innerHTML = text?.length ? text : 'Геолокация не поддерживается вашим браузером.'
}

document.querySelector('input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getWeatherByCity();
  }
});