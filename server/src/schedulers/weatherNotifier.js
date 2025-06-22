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
              '❄️ Внимание: Много ниска температура!',
              `Това е предупреждение за времето, което ви информира, че минималната температура във вашия град - ${user.city} се очаква да падне под зададения от вас праг от ${user.minTemp}°C. Прогнозирана минимална температура: ${dailyMinTemp}°C.`
            );
          }

          if (dailyMaxTemp >= user.maxTemp) {
            await notificationService.sentEmail(
              user.email,
              '🔥 Внимание: Много висока температура!',
              `Това е предупреждение за времето, което ви информира, че максималната температура във вашия град - ${user.city} се очаква да надвиши зададения от вас праг от ${user.maxTemp}°C. Прогнозирана максимална температура: ${dailyMaxTemp}°C.`
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
