function main() {
  
  var kw1 = AdWordsApp.keywords()
	.withCondition('CampaignName = "Bizhub C368"')
	.withCondition("Status = ENABLED")
	.get();

while(kw1.hasNext()){

var kw2 = kw1.next();

var kw3 = kw2.getTopOfPageCpc();

if (kw3<=0){

kw3=2.7;}
  
if (kw3>=2.7){

kw3=2.7;}

kw2.setMaxCpc(kw3*1.05);
  
}}