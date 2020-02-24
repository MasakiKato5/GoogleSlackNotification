"Slack API handler"

function entry(){}


function send_report_to_slack(graph) {}

function send_summary(url, channel) {
  //var debug_channel = '@UAECL4WNS';//@Masaki Kato
  var debug_channel = 'test_slackbot';
  postSlack(url, debug_channel, summary);
}

function postSlack(url, channel, message, _icon) {
  icon = _icon || ":date:";
  
  var payload  = { 
    'username'  : "reminder",
    'text'      : message,
    'icon_emoji': icon,
    "attachments" : [
      {
        "color": "#FFD700",
        "title": "ナンタラカンタラ",
        "fields": [
          {
            "title":"attachment01",
            "value":"This is attachment",
          }
        ]
      }
    ]
    //'icon_emoji': ":satellite_antenna:"
  };
  var options = {
    'method'      : 'post'                 ,
    'contentType' : 'application/json'     ,
    'payload'     : JSON.stringify(payload),
  };
  
  // Webhook URL
  var url = url_api_de_asobu
  UrlFetchApp.fetch(url, options);
}

function postEventToSlack(url, channel, event) {
  var format = function(date){ return Utilities.formatDate(date, 'Asia/Tokyo', 'M/dd H:mm') }

  var event_detail = 
      "from " + format(event.getStartTime())
      + " to " + format(event.getEndTime())
  
  var payload  = { 
    'text'      : "Event starting in 30 minutes:",
    "attachments" : [
      {
        "color": "good",
        "title": hyperlink(event.getTitle(), "https://calendar.google.com/calendar/r/week/"), 
        "fields": [
          {
            "title": event_detail,
            "value": event.getLocation()
          }
        ]
      }
    ]
  };
  var options = {
    'method'      : 'post'                 ,
    'contentType' : 'application/json'     ,
    'payload'     : JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

function test(){
  Logger.log("START")
  var events = fetchEventFromAddress()
  postEventToSlack(url_api_de_asobu, "", events[0])
  Logger.log("END")
}
