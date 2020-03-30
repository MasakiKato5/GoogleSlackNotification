"Logging and log-level"


var LogLevel = {
  "TRA": 0,
  "DBG": 1,
  "INF": 3,
  "WRN": 4,
  "ERR": 5,
};

var ConsoleLogger = function(){
  this.summary = ''
  this.history = ''

  this.tra = function(msg) {
    this.log(LogLevel["TRA"], msg)
  };

  this.dbg = function(msg) {
    this.log(LogLevel["DBG"], msg)
  };

  this.inf = function(msg) {
    this.log(LogLevel["INF"], msg)
  };

  this.wrn = function(msg) {
    this.log(LogLevel["WRN"], msg)
  };

  this.err = function(msg) {
    this.log(LogLevel["ERR"], msg)
  };

  this.log = function(level, msg) {
    if(level < log_level)
      return
    Logger.log(msg)
    now = new Date();
    now_str = Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm:ss')
    this.summary += now_str + ' : ' + msg + newline
    this.history += now_str + ' : ' + msg + newline
  };

  this.add_summary = function(msg) {
    logger.inf("[summary]" + msg)
    now = new Date();
    now_str = Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm:ss')
    this.summary += now_str + ' : ' + msg + newline
    this.history += now_str + ' : ' + msg + newline
  };

  this.add_history = function(msg) {
    Logger.log(msg)
    now = new Date();
    now_str = Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm:ss')
    this.history += now_str + ' : ' + msg + newline
  };
}

var logger = new ConsoleLogger()

function test(){
  Logger.log("start")

  Logger.log(LogLevel["INF"])
  Logger.log("end")
  logger.log(2, "logger")
  logger.add_summary("summary")
  logger.add_history("history")

  Logger.log("end")
}


