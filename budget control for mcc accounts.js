function main() {
    
  function todayData() {
  var now = new Date();
  var year = String(now.getFullYear());
    var month = String(now.getMonth()+1);
      //Logger.log(month);
      if (month.length == 1) {month='0'+month;}
      //Logger.log(month);
      var day = String(now.getDate()+1);
      //Logger.log(day);
      if (day.length == 1) {day='0'+day;}
      //Logger.log(day);
    var date = year+month+day;
      //Logger.log(date);
      return date
}
  //            |
  //            |
  //           \/
  // функция получения бюджета
  function getBudget() {
  var budget = AdWordsApp.budgetOrders().get().next().getSpendingLimit();
    //Logger.log(budget);
    while (budget<100000) {budget = AdWordsApp.budgetOrders().get().next().getSpendingLimit();}
    return budget;
}
  
  function getCost() {
    //указываем дату старта бюджета в startBudget
   var startBudget = '20160811';
  var currentAccount = AdWordsApp.currentAccount();
  //Logger.log(currentAccount.getName());
  var stats = currentAccount.getStatsFor(startBudget, todayData());
  //Logger.log(stats.getCost());
    return stats.getCost()
}
//Вывод остатка без учета возврата за недействительные клики
  function ostatok() {

  var ostatok = getBudget() - getCost();
  //Logger.log(ostatok);
    return ostatok
}
  //Вывод имени аккаунта
    function name() {

  var currentAccount = AdWordsApp.currentAccount();
  //Logger.log(currentAccount.getName());
      return currentAccount.getName()
    }
  //Вывод расхода за последние 7 дней
    function getCost7Days() {

  var currentAccount = AdWordsApp.currentAccount();
  var stats = currentAccount.getStatsFor('LAST_7_DAYS');
  //Logger.log(stats.getCost());
    return stats.getCost()
}
  
  function clientInfo() {
var cost = getCost();
var budg = getBudget();
  Logger.log('Стоимость '+cost);
   Logger.log('Бюджет '+budg);
    // добавляем корректировку по расходу
  var clientInfo = [name(), ((Math.abs(cost-budg))), getCost7Days()];
  Logger.log('-----------');
  Logger.log(clientInfo);
  Logger.log('-----------');
    return clientInfo
  }
  //clientInfo();
  ////////////////////////////Далее работаем с таблицей
  
  
  
function openSpreadsheet() {
  var client = clientInfo();
  // The code below opens a spreadsheet using its URL and logs the name for it.
  // Note that the spreadsheet is NOT physically opened on the client side.
  // It is opened on the server only (for modification by the script).
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1eEfw85SDiK8Co0ZV1g6vyXVU2hF73hJ3H4x4Ynd0uWk/edit#gid=0';

  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = ss.getSheetByName('List1');
  var lastRow = sheet.getLastRow();
  if (lastRow==0) {lastRow=1;}
  
  var j = 1;
  
  while (j <= lastRow) {
    //Logger.log(sheet.getRange("A"+j).getValue());
    if (sheet.getRange("A"+j).getValue()==client[0]) {
    sheet.getRange("A"+j).setValue(client[0]); 
     sheet.getRange("B"+j).setValue(client[1]); 
      sheet.getRange("C"+j).setValue(client[2]); 
      
      j=lastRow+1;
    }
    else {
    j++;
      if (j>lastRow) {
      
      sheet.getRange("A"+j).setValue(client[0]); 
     sheet.getRange("B"+j).setValue(client[1]); 
      sheet.getRange("C"+j).setValue(client[2]);
      }
    }
}
  

}
openSpreadsheet();
}