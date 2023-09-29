var SERVICE_URL = PropertiesService.getScriptProperties().getProperty('SERVICE_URL');
var CALENDAR_ID = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');

//TODO Replace with property
var DUTY_MONTHS = [2, 5, 8, 11];

var ICONS = {
  'Restabfallbehaelter': '🚮 Restmüll',
  'Wertstofftonne': '♻ Wertstofftonne',
  'Bioabfallbehaelter': '🍂 Biomüll',
  'Papierbehaelter': '📰 Altpapier'
};

var DAYS_OF_WEEK = ['Sonntag',
                    'Montag',
                   'Dienstag',
                   'Mittwoch',
                   'Donnerstag',
                   'Freitag',
                   'Samstag']

function getTitle(event) {
  return event.getTitle().trim();
}

function replaceWithIconText(string) {
  return ICONS[string];
}

function toDateString(date) {
  return DAYS_OF_WEEK[date.getDay()] + ', ' + date.getDate() +  '.' +  (date.getMonth() + 1)
}

function main() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  var month = tomorrow.getMonth();
  if (!DUTY_MONTHS.includes(month)) return;

  var events = CalendarApp.getCalendarById(CALENDAR_ID).getEventsForDay(tomorrow)
  if (events.length < 1) return;
  var titles = events.map(getTitle).map(replaceWithIconText);
  var date = events[0].getStartTime();
  
  if (events.length === 2) {
      var message = 'Morgen (' + toDateString(date) + ') werden ' + titles[0] + ' und ' + titles[1] + ' abgeholt!';
  } else {
     var message = 'Morgen (' + toDateString(date) + ') wird ' +  titles[0] + ' abgeholt!';
  }
  
  var payload = {'value1': message};
  
  var options = {
    'method' : 'post',
    'payload' : payload
  };
  
  UrlFetchApp.fetch(SERVICE_URL, options);
}
