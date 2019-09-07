//Желаемый порог
var BORDER=115;

function main() {
	   
//Узнаём фактические затраты за текущий день
var cost = AdWordsApp.currentAccount().getStatsFor("TODAY").getCost();
Logger.log('cost = '+cost)

//Условие
if (cost >= BORDER) {
 
//Настройка оповещения на желаемую почту
//  MailApp.sendEmail("pan.4sf@gmail.com",
  //             	"Arc services co — Перерасход за день",
    //           	"Зайди в аккаунт! За сегодня уже потрачено "+cost+" вместо 115$.");  
Logger.log('Email sended');

var campaigns = AdWordsApp.campaigns().get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(!campaign.isPaused()){
      campaign.pause();
          Logger.log(campaign.getName()+' stoped')
    }
  }
  
var shopCampaigns = AdWordsApp.shoppingCampaigns().get();
  while(shopCampaigns.hasNext()) {
    var shopCampaign = shopCampaigns.next();
    if(!shopCampaign.isPaused()){
      shopCampaign.pause();
          Logger.log(shopCampaign.getName()+' stoped')
    }
  }
  
}
  
  if (cost == 0) {
  
  /*
  var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Item Number Ads"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
  */
var shopCampaigns = AdWordsApp.shoppingCampaigns().withCondition('CampaignName = "Shopping Campaign"').get();
  while(shopCampaigns.hasNext()) {
    var shopCampaign = shopCampaigns.next();
    if(shopCampaign.isPaused()){
      shopCampaign.enable();
          Logger.log(shopCampaign.getName()+' play')
    }
  }
    
      var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Repair"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
    /*
      var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Copier Store"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
  */
      var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Remarketing"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
    /*
      var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Dynamic Remarketing"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
    
    
          var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Display Campaign Audiences"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
    
    
      var campaigns = AdWordsApp.campaigns().withCondition('CampaignName = "Bizhub C368"').get();
  while(campaigns.hasNext()) {
    var campaign = campaigns.next();
    if(campaign.isPaused()){
      campaign.enable();
          Logger.log(campaign.getName()+' play')
    }
  }
  
  */
    
    //Настройка оповещения на желаемую почту
  MailApp.sendEmail("pan.4sf@gmail.com",
               	"Arc services co — Кампании включены",
               	"Зайди в аккаунт! За сегодня уже потрачено "+cost+", РК включены.");  
Logger.log('Email sended');
  
  }
  
}