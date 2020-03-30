"Main API"

function exec_and_notify(func, skip_notify){
  "Entry Point of All method"
  var skip_notify = skip_notify || false; // debug is dalse if not defined
  error = 0  

  // add header
  var today = new Date();
  var header = 'GoogleSlackNotification : '
                     + version_info
                     + Utilities.formatDate(today, 'Asia/Tokyo', ' (YYYY/MM/dd HH:mm:ss)')
                     + '\n\n';
  // main method
  try{
    error = func()
  }catch(exception){
    error = 1;
    logger.add_summary('Exception: ' + exception);
  }

  // TODO: this needs refectoring
  // show summary
  var summary = header + '```\n' + logger.summary + '```'

  // notification
  if(error){
    postSlack(url_slack_hooks_err, summary);
  }
  if(skip_notify) return;

  postSlack(url_slack_hooks_log, summary)
}

function setEventReminder(event, func_name) {
  var now = new Date();
  var start_time = event.getStartTime()
  var remind_time = new Date(+start_time - (30 * 60 * 1000));
  
  if(start_time < now){
    logger.wrn("event " + event.getTitle()+ " has been started, skipped.")
    return;
  }

  var trigger_id = ScriptApp.newTrigger(func_name).timeBased().at(remind_time).create().getUniqueId();
  // save trigger id for deleting after using
  PropertiesService.getScriptProperties().setProperty(trigger_id, event.getId());
  logger.inf("set new trigger: "
             + event.getTitle()
             + ", triggerid = "
             + trigger_id
             + ", eventid = "
             + event.getId()
             + " at "
             + remind_time);
}

function deleteTrigger(trigger_id) {
  if(!trigger_id) return;
  
  ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getUniqueId() == trigger_id;
  })
  .forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
}

function test_maketrigger(){
  var startTime = new Date();
  var events = fetchEventFromAddress(mail_address)
  setEventReminder(events[0], "onlyNotifyTrigger");
}

//////////////////////////////////////////////////////////////////////////////

function onlyNotifyTrigger(e){ 
  "wake up and do nothing (for testing) "
  // delete trigger and key
  var trigger_id = event_param.triggerUid 
  var event_id = PropertiesService.getScriptProperties().getProperty(trigger_id);
  deleteTrigger(trigger_id)
  PropertiesService.getScriptProperties().deleteProperty(trigger_id);

  // notify
  postSlack(url_slack_hooks_notify, "trigger on [id = " + e.triggerUid + "]")
}

function remindEvent(event_param) {
  "Trigger: Remind event"
  postSlack(url_slack_hooks_log, "trigger on [id = " + event_param.triggerUid + "]")
  
  exec_and_notify(function(){
    var trigger_id = event_param.triggerUid 
    var event_id = PropertiesService.getScriptProperties().getProperty(trigger_id);
    deleteTrigger(trigger_id)
    PropertiesService.getScriptProperties().deleteProperty(trigger_id);
    
    if(!event_id){
      logger.err("Event ID is not found, abort")
      return;
    }
    var reminder = new Reminder(event_id)
    logger.inf("eventid = " + event_id)
    reminder.remind()
  })
}

function onEventEdited(event_param) {
  "Event executed when an event is edited"
  // get event
  // ToDo

  // notify if event starts after now
  // ToDo

}

function setEventTriggersFromCalenders() {
  "Main method: read calendar and set reminder"
  exec_and_notify(function(){
    // fetch events starting today
    var all_events = []
    for(i in target_and_notification_dst){
      var cal_id = target_and_notification_dst[i].eventid
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var tomorrow = new Date(+today + 24*60*60*1000)
      
      logger.tra("fetch events from " + cal_id);
      var events = fetchEventFromAddress(cal_id, today, tomorrow)

      if(!events) continue;
      logger.dbg("get " + events.length + " events")
      all_events = all_events.concat(events)
    }
    showEvents(all_events)
    
    // set triggers
    logger.inf("remind " + all_events.length + " events")
    for(var i in all_events) {
      var event = all_events[i];
      setEventReminder(event, "remindEvent")
    }
  })
}

//////////////////////////////////////////////////////////////////////////////////
// Entry Point

function test_main(){
  "test of reminder"
  exec_and_notify(function(){
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var tomorrow = new Date(+today + 24*60*60*1000)
    logger.inf("today: " + today)
    logger.inf("tomorrow:" + tomorrow)
    //    var events = fetchEventFromAddress(cal_events)
//    event_id = events[0].getId()
//
//    setEventReminder(events[0], "remindEvent")
  })
}