"Reminder from eventid"

var Reminder = function(event_id){
  this.event_id = event_id;
  
  this.remind = function() {
    // search event
    var event = getEventFromId(this.event_id, getToday(), getTomorrow())
    // search notification url
    var notification_url = getCalFromEvent(event, getToday(), getTomorrow()).url;

    postEventToSlack(notification_url, event)
  };

  this.onEdited = function() {
    return;
  };

}

function test(){
    exec_and_notify(function(){
      var reminder = new Reminder("a")
      reminder.remind()
    }, true);
}