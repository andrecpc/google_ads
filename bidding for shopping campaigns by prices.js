function main() {
  
  var ss = SpreadsheetApp.openById('1wowYTToSOkjqV1GELGX3vtHVcPZmhl0aevr1_jtfLJI');
  var sheet = ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  Logger.log(lastRow);
  
  var range = sheet.getRange("A1:C"+lastRow).getValues();
  //Logger.log(range);
  
  range.sort();
  for (var i = range.length - 1; i > 0; i--) {
    if (range[i][0] == range[i - 1][0]) range.splice( i, 1);
}
  
  Logger.log(range);
  Logger.log(range.length);

  /*
  var ids = []
  var prices = []
  
  for (var i = range.length - 1; i > 0; i--) {
    ids.push(range[i][0]);
    prices.push(range[i][2]);
  }
  Logger.log(ids);
  Logger.log(prices);
  */
  
  function finder(arr,val){
    for (var i=0;i<arr.length;i++) 
    {
    var elem = arr[i];
    if (elem[0].toString().toLowerCase()==val.toString().toLowerCase()) {
      return parseFloat(elem[2])}
    //else {return undefined}
    }
  }

  //Logger.log(finder(range,'OtherCase'));
  

  var productGroups = AdsApp.productGroups()
      .withCondition("CampaignName = 'Shopping Campaign'")
  	  .withCondition("AdGroupStatus = ENABLED")
      .get();
  while (productGroups.hasNext()) {
    var productGroup = productGroups.next();
    var children = productGroup.children().get();
      while (children.hasNext()) {
        var child = children.next();
   /*     Logger.log('dimens '+child.getDimension());
        Logger.log('enttype '+child.getEntityType());
        try {
        Logger.log('totnum ent '+child.children().get().totalNumEntities());}
        catch(e) {Logger.log('no ent');}
   */
        Logger.log(child.getStatsFor('LAST_30_DAYS').getImpressions());
        var cid = child.getValue();
        var impr = child.getStatsFor('LAST_30_DAYS').getImpressions();
        Logger.log(cid);
        var price = finder(range,cid);

        if (price != undefined) {
          var bid = price/60; //var bid = price/95;
          if (impr<10) {bid=bid*1.4;}
          if (bid>=5) {bid = 5;}
          Logger.log('price - ' + price);
          
          /*
          if (cid == 'bizhubc458-14k') {bid = 10;}
          Logger.log('bid - ' + bid);
          child.setMaxCpc(bid);
          */
          
          if (cid == 'bizhub c368-new') {bid = 0.2;}
          Logger.log('bid - ' + bid);
          child.setMaxCpc(bid);
          
          if (cid == 'hhfrc1070600k') {bid = 8;}
          Logger.log('bid - ' + bid);
          child.setMaxCpc(bid);
          
          if (cid == 'hhfrc10701200k') {bid = 8;}
          Logger.log('bid - ' + bid);
          child.setMaxCpc(bid);
        
        
        }
        
        Logger.log('---------');  
        price = undefined;
      }
    
  } 
  
}