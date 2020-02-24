function onEventEdited(e) {
  
}

function onEventTimeNears(e) {
  
}

function setEventTriggersFromCalenders() {
  
}


function setTrigger(triggerKey, funcName){
  deleteTrigger(triggerKey);   // delete previous trigger
  var dt = new Date();
  dt.setMinutes(dt.getMinutes() + 1);  // do after 1 minute
  var triggerId = ScriptApp.newTrigger(funcName).timeBased().at(dt).create().getUniqueId();
  // save trigger id for deleting after using
  PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
}

function deleteTrigger(triggerKey) {
  var triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);
  
  if(!triggerId) return;
  
  ScriptApp.getProjectTriggers().filter(function(trigger){
    return trigger.getUniqueId() == triggerId;
  })
  .forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  PropertiesService.getScriptProperties().deleteProperty(triggerKey);
}


function test_maketrigger(){
  var startTime = new Date();
  
  var properties = PropertiesService.getScriptProperties();  //途中経過保存用
  var startRowKey = "startRow";  //何行目まで処理したかを保存するときに使用するkey
  var triggerKey = "trigger";    //トリガーIDを保存するときに使用するkey
  
  //途中から実行した場合、ここに何行目まで実行したかが入る
  var startRow = parseInt(properties.getProperty(startRowKey));
  if(!startRow){
    //初めて実行する場合はこっち
    startRow = 1;
  }

  var rows = sheet.getDataRange().getValues();
  for(var i = startRow; i < rows.length; i++){
    var diff = parseInt((new Date() - startTime) / (1000 * 60));
    if(diff >= 5){
      //5分経過していたら処理を中断
      properties.setProperty(startRowKey, i);  //何行まで処理したかを保存
      setTrigger(triggerKey, "func");          //トリガーを発行
      return;
    }
    /* ここでメイン処理 */
  }  
  
  //全て実行終えたらトリガーと何行目まで実行したかを削除する
  deleteTrigger(triggerKey);
  properties.deleteProperty(startRowKey);
}