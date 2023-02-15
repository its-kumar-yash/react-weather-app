function BackgroundImage(data) {
    let id = 0;
    if (!Array.isArray(data) && data.list[0].weather[0].id) {
      id = data.list[0].weather[0].id;
    }
    function getImageUrl(weatherId) {
      // id classification https://openweathermap.org/weather-conditions
      if (weatherId >= 200 && weatherId < 300) {
        return 'https://cdn-icons-png.flaticon.com/512/1779/1779927.png'; // thunderstorm
      } else if (weatherId >= 300 && weatherId < 400) {
        return 'https://cdn-icons-png.flaticon.com/512/2675/2675876.png'; // drizzle
      } else if (weatherId >= 500 && weatherId < 600) {
        return 'https://cdn-icons-png.flaticon.com/512/2469/2469994.png'; // rain
      } else if (weatherId >= 600 && weatherId < 700) {
        return 'https://cdn-icons-png.flaticon.com/512/5825/5825747.png'; // snow
      } else if (weatherId >= 700 && weatherId < 800) {
        return 'https://cdn-icons-png.flaticon.com/512/3026/3026389.png'; // strong wind
      } else if (weatherId === 800) {
        return 'https://cdn-icons-png.flaticon.com/512/2698/2698194.png'; // clear day Image
      } else if(weatherId > 800){
        return 'https://cdn-icons-png.flaticon.com/512/3222/3222801.png'; // cloudy day
      }
    }
  
    return getImageUrl(Number(id));
  }
  
  export default BackgroundImage;