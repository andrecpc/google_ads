function main(){

function changeBidsMore3Convs(){
var kw1 = AdWordsApp.keywords().withCondition("Status = ENABLED").withCondition("Status != REMOVED").forDateRange('LAST_30_DAYS').withCondition('Conversions > 3').withCondition("Text DOES_NOT_CONTAIN 'свад'").withCondition("Text DOES_NOT_CONTAIN 'карав'").get();
while(kw1.hasNext()){
var kw2 = kw1.next();
var convs = kw2.getStatsFor('LAST_30_DAYS').getConversions();
var bid = kw2.getTopOfPageCpc();
if (bid<=0){bid=100;} 
if (bid>=150){bid=150;}
kw2.setMaxCpc(bid*1.95);
}
}
  
function changeBidsMore0Convs(){
var kw1 = AdWordsApp.keywords().withCondition("Status = ENABLED").withCondition("Status != REMOVED").forDateRange('LAST_30_DAYS').withCondition('Conversions > 0').withCondition('Conversions < 4').withCondition("Text DOES_NOT_CONTAIN 'свад'").withCondition("Text DOES_NOT_CONTAIN 'карав'").get();
while(kw1.hasNext()){
var kw2 = kw1.next();
var convs = kw2.getStatsFor('LAST_30_DAYS').getConversions();
var bid = kw2.getTopOfPageCpc();
if (bid<=0){bid=100;} 
if (bid>=150){bid=150;}
kw2.setMaxCpc(bid*1.55);
}
}
  
function changeBids0Convs(){
var kw1 = AdWordsApp.keywords().withCondition("Status = ENABLED").withCondition("Status != REMOVED").forDateRange('LAST_30_DAYS').withCondition('Conversions = 0').withCondition("Text DOES_NOT_CONTAIN 'свад'").withCondition("Text DOES_NOT_CONTAIN 'карав'").get();
while(kw1.hasNext()){
var kw2 = kw1.next();
var convs = kw2.getStatsFor('LAST_30_DAYS').getConversions();
var clicks = kw2.getStatsFor('LAST_14_DAYS').getClicks();
var bid = kw2.getTopOfPageCpc();
if (bid<=0){bid=100;} 
if (bid>=100){bid=100;}
if (clicks>=30){bid=bid/5;}
kw2.setMaxCpc(bid*1.25);
}
}

changeBids0Convs()
changeBidsMore0Convs()
changeBidsMore3Convs()

}
