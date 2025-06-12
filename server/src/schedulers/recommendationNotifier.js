const cron = require('node-cron');

const userService = require('../services/userService');
const weatherService = require('../services/weatherService');
const notificationService = require('../services/notificationService');

function startRecommendationsNotifier() {
    cron.schedule('0 8 * * 6', async () => {
        try {
            const users = await userService.getUsersWithEnabledRecommendations();

            for (let user of users) {
                try {
                    const weather = await weatherService.getWeatherByCity(user.city, 2);

                    const weatherAtSaturday = {
                        'avgTemp': weather.forecast.forecastday[0].day.avgtemp_c,
                        'maxWind': weather.forecast.forecastday[0].maxwind_kph,
                        'willItRain': weather.forecast.forecastday[0].daily_will_it_rain,
                        'willItSnow': weather.forecast.forecastday[0].daily_will_it_snow,
                    };

                    const weatherAtSunday = {
                        'avgTemp': weather.forecast.forecastday[1].day.avgtemp_c,
                        'maxWind': weather.forecast.forecastday[1].maxwind_kph,
                        'willItRain': weather.forecast.forecastday[1].daily_will_it_rain,
                        'willItSnow': weather.forecast.forecastday[1].daily_will_it_snow,
                    };

                    const saturdaySuggestions = getActivitySuggestions(weatherAtSaturday);
                    const sundaySuggestions = getActivitySuggestions(weatherAtSunday);

                    await notificationService.sentEmail(
                        user.email,
                        '📅 Уикенд предложения',
                        `Събота:\n${saturdaySuggestions.title}\n- ${saturdaySuggestions.ideas.join('\n- ')}\n\nНеделя:\n${sundaySuggestions.title}\n- ${sundaySuggestions.ideas.join('\n- ')}`
                    );
                }
                catch (userError) {
                    console.error(`Failed to process user ${user.email}:`, userError);
                }
            }
        }
        catch (error) {
            console.error('Recommendation notifier failed:', error);
        }
    });
}

function getActivitySuggestions(weather) {
    const { avgTemp, maxWind, willItRain, willItSnow } = weather;

    const result = {
        title: '',
        ideas: []
    };

    if (willItRain || willItSnow || maxWind > 35) {
        result.title = 'Лошо време – предпочети дейности на закрито.';
        result.ideas = [
            'Посети кино или музей',
            'Пробвай нова рецепта у дома',
            'Чети или гледай филм на спокойствие'
        ];
    }
    else if (avgTemp >= 18 && maxWind <= 20) {
        result.title = 'Чудесно време за активности навън.';
        result.ideas = [
            'Отиди на пикник или в парка',
            'Посети природна забележителност',
            'Разходи се в планината или край морето'
        ];
    }
    else if (avgTemp >= 10 && maxWind <= 25) {
        result.title = 'Умерено време – подходящо за разходки.';
        result.ideas = [
            'Разходи се в центъра',
            'Посети уличен пазар',
            'Пий кафе навън с приятел'
        ];
    }
    else {
        result.title = 'Хладно и спокойно – остани на топло.';
        result.ideas = [
            'Направи си ден за себе си у дома',
            'Отиди в спа или минерален басейн',
            'Събери се с приятели у дома'
        ];
    }

    return result;
}

module.exports = startRecommendationsNotifier;