"Slack API handler"


function postSlack(url, message) {
  var payload  = { 
    'text'      : message,
  };
  var options = {
    'method'      : 'post'                 ,
    'contentType' : 'application/json'     ,
    'payload'     : JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

function postEventToSlack(slack_url, event) {
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
  UrlFetchApp.fetch(slack_url, options);
}

//////////////////////////////////////////////////////////////////////////////

function test_notify(){
  logger.inf("START")
  //var events = fetchEventFromAddress()
  //postEventToSlack(url_api_de_asobu, "", events[0])
  postSlack(url_slack_hooks_notify, "test")
  logger.inf("END")
}
