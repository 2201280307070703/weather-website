const cron = require('node-cron');

const userService = require('../services/userService');
const weatherService = require('../services/weatherService');
const notificationService = require('../services/notificationService');

function startWeatherNotifier() {
    cron.schedule('0 * * * *', async () => {
      try {
        const users = await userService.getUsersWithEnabledNotifications();
  
        for (let user of users) {
          try {
            const weather = await weatherService.getWeatherByCity(user.city);
            const temp = weather.current.temp_c;
  
            const minTemp = user.minTemp;
            const maxTemp = user.maxTemp;
  
            if (temp <= minTemp) {
              await notificationService.sentEmail(
                user.email,
                '❄️ Weather Alert: Temperature is too low!',
                `This is a weather alert to inform you that the temperature in your city has dropped below your set threshold. Current temperature: ${temp}°C`
              );
            }
  
            if (temp >= maxTemp) {
              await notificationService.sentEmail(
                user.email,
                '🔥 Weather Alert: Temperature is too high!',
                `This is a weather alert to inform you that the temperature in your city has risen above your set threshold. Current temperature: ${temp}°C`
              );
            }
          } catch (userError) {
            console.error(`Failed to process user ${user.email}:`, userError);
          }
        }
      } catch (error) {
        console.error('Weather notifier failed:', error);
      }
    });
  }
  
module.exports = startWeatherNotifier;
