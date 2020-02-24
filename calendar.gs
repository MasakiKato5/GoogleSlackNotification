"Google-Calendar handler"

function fetchEventFromAddress() {
  "Import event data from google calendar"
  Logger.log('START')
  var cal = CalendarApp.getCalendarById(mail_address);//IDはメールアドレスになります。
  var events = cal.getEventsForDay(new Date());
  var events2 = cal.getEvents(getOnemonthbefore(), new Date());
//  var events2 = cal.getEventsForYear(new Date());
  Logger.log(cal)
  
  Logger.log('\n\nevents1')
  Logger.log(events)
  Logger.log('\n\nevents2')
  Logger.log(events2)
  shoeEvents(events2)
  return events2
}

function getOnemonthbefore() {
 
  var date = new Date(); //現在日時のDateオブジェクトを作る
  var today = Utilities.formatDate(date, 'JST', 'yyyy/MM/dd');
  Logger.log(today); //2019/09/05
  
  //現在の「月」を取得
  var month = date.getMonth()+1; //※getMonthの返り値が0～11(1月～12月)なので、+1してる
  Logger.log(month); //9 
  
  //Dateオブジェクトに1ヶ月前の月を設定したいので、「月」に-2をセットする
  date.setMonth(month-2);
  Logger.log(date); //Mon Aug 05 19:35:34 GMT+09:00 2019
  
  //日付の表示形式を整形する
  var onemonthbefore = Utilities.formatDate(date, 'JST', 'yyyy/MM/dd');
  Logger.log(onemonthbefore); //2019/08/05
  return date
}

function shoeEvents(events){
  for(var i = 0; i < events.length; i++){
    Logger.log(events[i].getTitle())
  }
}

function entry(){
  Logger.log('test')
  fetchEventFromAddress()
}

