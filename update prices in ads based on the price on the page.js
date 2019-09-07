function main() {
  
  function priceUrl(url) {

  var response = UrlFetchApp.fetch(url);
  
  var c = response.getContentText();
  var text = c;
  var reg = 'Price: (.*) For Use In:';
  var res = text.match(reg);
  //Logger.log(res[1]);

  return res[1];
}
  
//Logger.log(priceUrl('https://www.arcservicesco.com/6539/konica-minolta-du-105-drum-unit-for-bizhub-c1060-c1070-c1070p-i-A5WH0Y0'));
  
  
  var adsIterator = AdWordsApp.ads()
      .withCondition('CampaignName = "Item Number Ads"')
      .withCondition("Type = 'EXPANDED_TEXT_AD'")
      .withCondition("Status = ENABLED")
      .withCondition("AdGroupStatus = ENABLED")
      .get();
  while (adsIterator.hasNext()) {
       
    var ad = adsIterator.next();
    //Logger.log(ad);
    var headline3 = ad.getHeadlinePart3();
    Logger.log(headline3);
    var adurl = ad.urls().getFinalUrl();
    var origPrice = priceUrl(adurl);
    Logger.log(adurl);
    Logger.log(origPrice);
    Logger.log('-------------');
    if (headline3 != origPrice) {
     var groupID = ad.getAdGroup().getId();
       var adID = ad.getId();
      
      var adGroupIterator = AdWordsApp.adGroups()
      .withIds([groupID])
      .get(); 
  while (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    var newAd = adGroup.newAd().expandedTextAdBuilder()
        .withHeadlinePart1(ad.getHeadlinePart1())
        .withHeadlinePart2(ad.getHeadlinePart2())
        .withHeadlinePart3(origPrice)
        .withDescription1(ad.getDescription1())
        .withDescription2(ad.getDescription2())
        .withPath1(ad.getPath1())
        .withPath2(ad.getPath1())
        .withFinalUrl(ad.urls().getFinalUrl())
        .build().getResult();
    
    Logger.log('В группе '+groupID+' было объявление '+adID);
        Logger.log(ad.getHeadlinePart1()+"| "+ad.getHeadlinePart2()+"| "+ad.getHeadlinePart3()+"| "+ad.getDescription1()+"| "+ad.getDescription2()+"| "+ad.urls().getFinalUrl()+"| "+ad.getPath1()+"| "+ad.getPath2());
        ad.remove();
        Logger.log('Теперь в этой группе новое объявление');
        Logger.log(newAd.getHeadlinePart1()+"| "+newAd.getHeadlinePart2()+"| "+newAd.getHeadlinePart3()+"| "+newAd.getDescription1()+"| "+newAd.getDescription2()+"| "+newAd.urls().getFinalUrl()+"| "+newAd.getPath1()+"| "+newAd.getPath2());
        Logger.log('-------------');

    }

  
  
  }
  
  
  }
  
  
  
  
  
  
}