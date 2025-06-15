const cron = require('node-cron');

const userService = require('../services/userService');
const weatherService = require('../services/weatherService');
const notificationService = require('../services/notificationService');

function startWeatherNotifier() {
  cron.schedule('0 8 * * *', async () => {
    try {
      const users = await userService.getUsersWithEnabledNotifications();

      for (let user of users) {
        try {
          const weather = await weatherService.getWeatherByCity(user.city);
          const dailyMinTemp = weather.forecast.forecastday[0].day.mintemp_c;
          const dailyMaxTemp = weather.forecast.forecastday[0].day.maxtemp_c;

          if (dailyMinTemp <= user.minTemp) {
            await notificationService.sentEmail(
              user.email,
              '❄️ Weather Alert: Temperature is too low!',
              `This is a weather alert to inform you that the minimum temperature in your city is expected to drop below your set threshold of ${user.minTemp}°C. Forecasted minimum temperature: ${dailyMinTemp}°C.`
            );
          }

          if (dailyMaxTemp >= user.maxTemp) {
            await notificationService.sentEmail(
              user.email,
              '🔥 Weather Alert: Temperature is too high!',
              `This is a weather alert to inform you that the maximum temperature in your city is expected to rise above your set threshold of ${user.maxTemp}°C. Forecasted maximum temperature: ${dailyMaxTemp}°C.`
            );
          }
        }
        catch (userError) {
          console.error(`Failed to process user ${user.email}:`, userError);
        }
      }
    }
    catch (error) {
      console.error('Weather notifier failed:', error);
    }
  });
}

module.exports = startWeatherNotifier;
