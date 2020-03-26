  var CPLtarget = 2300;
  var CRprog = 0.021;
  var minL = 0.02;
  var maxL = 80;

function main() {
  
  function pool(k1,k2,k3,g1,g2,g3,c1,c2,c3) {
  
    var bid = 0;
    
    if ((c3>0 && c1<50) || c3==0) {bid = CPLtarget*(k2+1)/(k1+1/CRprog);}
    
    if (( c3  > 0 && g1 >= 50 && g3 == 0 ) || ( g1 < 50 && c1 >= 50 && c3 > 0 )) {bid = CPLtarget*(k2+1)/(k1+1/c3);}
    
    if (g1 >= 50 && g3 > 0) {bid = CPLtarget*(k2+1)/(k1+1/g3);}
    
    if (bid > maxL) {bid = maxL;}
    if (bid == 0) {bid = maxL*0.9;}
    if (bid < minL) {bid = minL;}
  
  return bid;
  }
  
 var keywordSelector = AdsApp.keywords()
     .withCondition("Status = ENABLED")
     .withCondition("AdGroupStatus = ENABLED")
     .withCondition("CampaignStatus = ENABLED")
     .forDateRange("LAST_30_DAYS");

 var keywordIterator = keywordSelector.get();
  
 while (keywordIterator.hasNext()) {
   
   var keyword = keywordIterator.next();
   var text = keyword.getText();
   var camp = keyword.getCampaign().getName();
   
   var keyClicks = keyword.getStatsFor('LAST_30_DAYS').getClicks();
   var keyConversions = keyword.getStatsFor('LAST_30_DAYS').getConversions();
   var keyConversionRate = keyword.getStatsFor('LAST_30_DAYS').getConversionRate();
   
   var grClicks = keyword.getAdGroup().getStatsFor('LAST_30_DAYS').getClicks();
   var grConversions = keyword.getAdGroup().getStatsFor('LAST_30_DAYS').getConversions();
   var grConversionRate = keyword.getAdGroup().getStatsFor('LAST_30_DAYS').getConversionRate();
   
   var camClicks = keyword.getCampaign().getStatsFor('LAST_30_DAYS').getClicks();
   var camConversions = keyword.getCampaign().getStatsFor('LAST_30_DAYS').getConversions();
   var camConversionRate = keyword.getCampaign().getStatsFor('LAST_30_DAYS').getConversionRate();
   
   var curBid = keyword.bidding().getCpc();
   var newBid = pool(keyClicks,keyConversions,keyConversionRate,grClicks,grConversions,grConversionRate,camClicks,camConversions,camConversionRate);
   if (newBid>keyword.getTopOfPageCpc()&&keyword.getTopOfPageCpc()!=0) {newBid=keyword.getTopOfPageCpc()*1.05;}
   if (newBid == 0) {newBid = maxL*0.9;}
   
   Logger.log(keyClicks+' - '+keyConversions+' - '+keyConversionRate+' <keywordLevel< '+grClicks+' - '+grConversions+' - '+grConversionRate+' <groupLevel< '+camClicks+' - '+camConversions+' - '+camConversionRate+' <campaignLevel< '+ camp +': '+ text +': '+ curBid +' -> '+ newBid);
   keyword.bidding().setCpc(newBid);
 }
  
}
