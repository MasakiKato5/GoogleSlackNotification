"Google-Calendar handler"

function fetchEventFromAddress(cal_id, start_time, stop_time) {
  "Import event data from google calendar"
  var cal = CalendarApp.getCalendarById(cal_id);
  if(!cal) return;

  logger.inf("fetch start: " + cal_id)
  logger.dbg("from " + start_time + " - " + new Date())

  var events = cal.getEvents(start_time, stop_time);
  if(!events) return;

  logger.inf("successfully fetch " + events.length + " events");
  showEvents(events)
  return events;
}

function getOnemonthbefore() {
  var date = new Date();
  var today = Utilities.formatDate(date, 'JST', 'yyyy/MM/dd');
  
  //現在の「月」を取得
  var month = date.getMonth()+1; //※getMonthの返り値が0～11(1月～12月)なので、+1してる
  
  //Dateオブジェクトに1ヶ月前の月を設定したいので、「月」に-2をセットする
  date.setMonth(month-2);
  return date;
}

function getToday(){
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getTomorrow(){
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var tomorrow = new Date(+today + 24*60*60*1000)
  return tomorrow
}

function showEvents(events){
  for(var i = 0; i < events.length; i++){
    logger.tra(events[i].getTitle())
  }
}

function getEventFromId(event_id, start_time, stop_time){
  logger.dbg("search-target: event id = " + event_id)
  
  for(index in target_and_notification_dst){
    var bind = target_and_notification_dst[index]
    var events = fetchEventFromAddress(bind.eventid, start_time, stop_time)
    logger.tra("fetch events from " + bind.eventid);
    if(!events) continue;
    
    for(var i = 0; i < events.length; i++){
      logger.dbg("search-target: event id = " + events[i].getId())
      if(events[i].getId() == event_id){
        logger.inf("event is found: " + events[i].getTitle())
        return events[i];
      }
    }
  }
  logger.add_summary("target id is not found")
}

function getCalFromEvent(event, start_time, stop_time){
  logger.dbg("search-target: " + event.getTitle())
  
  for(index in target_and_notification_dst){
    var bind = target_and_notification_dst[index]
    var events = fetchEventFromAddress(bind.eventid, start_time, stop_time)
    logger.tra("fetch events from " + bind.eventid);
    if(!events) continue;
    
    for(var i = 0; i < events.length; i++){
      logger.dbg("search-target: event id = " + events[i].getId())
      if(events[i].getId() == event.getId()){
        logger.inf("event is found: " + events[i].getTitle())
        return bind;
      }
    }
  }
  logger.add_summary("target id is not found")
}


function entry(){
  exec_and_notify(function(){
    var events = fetchEventFromAddress(cal_events, start_time, stop_time)
    event_id = events[0].getId()

//    var event_from_id = getEventFromId(event_id)    
//    postEventToSlack(url_slack_hooks_notify, "", event_from_id)    
    
    var reminder = new Reminder(events[0].getId())
    reminder.remind()

  }, true)  
}

