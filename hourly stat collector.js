function main() {
  
  // get sheet
  var ss = SpreadsheetApp.openById('1W6yNxz6S4GBubSqqomN7jdRa-CqKkSTuYxZh5TwMLwU');
  var sheet = ss.getSheetByName('Copy of keyword');
  var lastRow = sheet.getLastRow();
  Logger.log(lastRow);
  
  // get data
  var range = sheet.getRange("A2:G"+lastRow).getValues();
  //Logger.log(range);
  var range2 = sheet.getRange("H2:J"+lastRow).getValues();
  //Logger.log(range2);
  
  
  Logger.log('keyword_id	click_to_good_call_ratio	ctr	avg_position	modifer	max	min');
  Logger.log(range);
  Logger.log(range.length);
  
  
  var sheet2 = ss.getSheetByName('History');
  var lastRow2 = sheet2.getLastRow();
  Logger.log(lastRow2);
  
  
  var forHist = [];
  
  
  
  

  // this function search roas value by groupID
  function finder(arr,val){
    for (var i=0;i<arr.length;i++) 
    {
    var elem = arr[i];
      if (parseInt(elem[0])==parseInt(val)) {
      return [i,elem[4],elem[5],elem[6]];}
   //else {return undefined}
    }
  }
  //Logger.log(finder(range,360670924443));
  
  
    function whatTrigger(mod){
    
    
   var list = sheet.getRange("E2").getFormula().slice(5,-1).replace(' ','').split(',');
      for (var i=0;i<list.length;i++) 
    {list[i] = list[i].replace('B2','X');}
      
      for (var i=0;i<list.length;i++) 
    {if (parseFloat(list[i]) == mod)  {var mod2 = String(parseInt(-1*(1-mod)*100))+'%';  if (i>1) { if (list[i-2].indexOf("AND")!==-1) { var trig = list[i-2]+','+list[i-1];} else {var trig = list[i-1];} }   else {var trig = list[i-1];}
                                       
                                       return [trig.replace('AND','').replace(' ',''),mod2]}}
      
    
    }

  //Logger.log(whatTrigger(1.65));
  

  var keywords = AdsApp.keywords()
  //.withCondition("CampaignName = 'Item Number Ads'")
  //.withCondition("AdGroupName = 'IU711M'")
      .withCondition("CampaignStatus = ENABLED")
  	  .withCondition("AdGroupStatus = ENABLED")
  	  .withCondition("Status != REMOVED") 
      .get();
  while (keywords.hasNext()) {
    var keyword = keywords.next();
    var id = keyword.getId();
    var find = finder(range,id);
    
    if (find!=undefined){
      
      var now = new Date();
      var date = String(now.getFullYear())+'-'+String(now.getMonth()+1)+'-'+String(now.getDate());
      var time = String(now.getHours())+':'+String(now.getMinutes());
      
    var num = find[0];
    var modifer = find[1];
    var trigMod = whatTrigger(modifer);
    if (trigMod != undefined) {var mod2 = trigMod[1];var trig = trigMod[0];} else {var mod2 = '-';var trig = '-';}
    var max = find[2];
    var min = find[3];
    var bid = keyword.bidding().getCpc();
      
    var grName = keyword.getAdGroup().getName();  
    var cName = keyword.getCampaign().getName();
      
    //stat
    var clicks = keyword.getStatsFor('TODAY').getClicks();
    var imp = keyword.getStatsFor('TODAY').getImpressions();
    var cost = keyword.getStatsFor('TODAY').getCost();
    var ctr = keyword.getStatsFor('TODAY').getCtr();
      
    var grcl = keyword.getAdGroup().getStatsFor('TODAY').getClicks();
    var grcost = keyword.getAdGroup().getStatsFor('TODAY').getCost();
      
      Logger.log('id='+id+', '+'num='+num+', '+'modifer='+modifer+', '+'max='+max+', '+'min='+min+', '+'bid='+bid+', '+'keyword='+keyword.getText());
      Logger.log('mod2='+mod2+', '+'trig='+trig);
    if (modifer!=undefined) {
    if (modifer!=1.0) {
    
      var newBid = bid*modifer; if (newBid>max) {newBid=max;} if (newBid<min) {newBid=min;}
      Logger.log('newBid='+newBid);
      keyword.bidding().setCpc(newBid);
      range2[num][0]='successfull';
      range2[num][1]=date;
      range2[num][2]=time;
    }
    if (modifer==1.0) {
      Logger.log('Leave old bid');
      
      range2[num][0]='not done';
      range2[num][1]=date;
      range2[num][2]=time;
    }
    }

      forHist.push([date,time,id,grName,cName,trig,mod2,clicks,imp,cost,ctr,grcl,grcost]);
      
      
    }
  }
  Logger.log(range2);
    sheet.getRange("H2:J"+lastRow).setValues(range2);
  
  Logger.log(forHist);
  //Logger.log("A"+(lastRow2+1)+":G"+(lastRow2+forHist.length));
  sheet2.getRange("A"+(lastRow2+1)+":M"+(lastRow2+forHist.length)).setValues(forHist);

}