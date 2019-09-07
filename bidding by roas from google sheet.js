function main() {
  
  // get sheet
  var ss = SpreadsheetApp.openById('1W6yNxz6S4GBubSqqomN7jdRa-CqKkSTuYxZh5TwMLwU');
  var sheet = ss.getSheetByName('adgroups_google_roas_week_by_week');
  var lastRow = sheet.getLastRow();
  Logger.log(lastRow);
  
  // get data
  var range = sheet.getRange("A1:C"+lastRow).getValues();
  //Logger.log(range);
  
  
  
  range.sort();
  for (var i = range.length - 1; i > 0; i--) {
    if (range[i][0] == range[i - 1][0]) range.splice( i, 1);
}
  Logger.log('adGroup ID	#Paid job	ROAS from calls');
  Logger.log(range);
  Logger.log(range.length);

  // this function search roas value by groupID
  function finder(arr,val){
    for (var i=0;i<arr.length;i++) 
    {
    var elem = arr[i];
      if (elem[0]==val) {
      return parseFloat(elem[2])}
   else {return undefined}
    }
  }

  //Logger.log(finder(range,67142889546));
  
  
  var groups = AdsApp.adGroups()
      .withCondition("CampaignStatus = ENABLED")
  	  .withCondition("AdGroupStatus = ENABLED")
  .forDateRange("LAST_30_DAYS")
  .withCondition("Clicks >= 4") 
      .get();
  while (groups.hasNext()) {
    var group = groups.next();
    var id = group.getId();
    var roas = finder(range,id);
    Logger.log(group.getName());
    Logger.log(roas);
    if (roas >0) {
    
      var keywords = group.keywords().get();
      
        while (keywords.hasNext()) {
    var keyword = keywords.next();  Logger.log(keyword.getId());
    var bid = keyword.bidding().getCpc();
    keyword.bidding().setCpc(bid*1.05);
        }
    
    }
        else {
    
      var keywords = group.keywords().get();
      
        while (keywords.hasNext()) {
    var keyword = keywords.next();
    var bid = keyword.bidding().getCpc();
    keyword.bidding().setCpc(bid*0.85);
        }
    
    }
    
  } 
 //https://docs.google.com/spreadsheets/d/1W6yNxz6S4GBubSqqomN7jdRa-CqKkSTuYxZh5TwMLwU/edit?ts=5cebf6f0#gid=0
  
 ///////////////////
  // searching missing groups
  ///////////////////////////
  var group_ids_sheet = sheet.getRange("A2:A"+lastRow).getValues();
  var g_ids = [];
  for (elem in group_ids_sheet) {g_ids.push(group_ids_sheet[elem][0]);}
  Logger.log(g_ids);
  var groups = AdsApp.adGroups()
      .withCondition("Status != REMOVED")
      .get();
  
  var group_ids_ads = [];
  
  while (groups.hasNext()) {
    var group = groups.next();
    var id = group.getId();
  group_ids_ads.push(parseInt(id));
  };
  Logger.log(group_ids_ads);
   //Logger.log(group_ids_sheet);
  
  for (elem in g_ids) {

    var index = group_ids_ads.indexOf(g_ids[elem]); //Logger.log(index);
	if (index !== -1) group_ids_ads.splice(index, 1);
  };
  Logger.log(group_ids_ads);
  
  var mis_groups=[];
  for (elem in group_ids_ads) {mis_groups.push([group_ids_ads[elem]])}
  
  var sheet = ss.getSheetByName('Missing groups');
  var lastRow = group_ids_ads.length+1;
  sheet.getRange("A2:A"+lastRow).setValues(mis_groups)

}