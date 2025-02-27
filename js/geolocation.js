function getUserLocation() {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const { longitude, latitude } = position.coords;
    const apiKey = '56b30cb255.3443075'; // Замените на ваш API-ключ от Gismeteo
    // const url = `https://api.gismeteo.net/v2/weather/current/?latitude=${latitude}&longitude=${longitude}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=65d2437913b4ca9e4074527c1243bf34`;

    fetch(url, {
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при запросе к API');
        }
        return response.json(); // Парсим JSON-ответ
      })
      .then((data) => {
        console.log('Данные от API:', data);
        // Здесь можно обработать данные и отобразить их на странице
        updateWeather(data); // Вызываем функцию для обновления погоды
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  }

  function error() {
    console.log('Не получается определить вашу геолокацию :(');
  }
}