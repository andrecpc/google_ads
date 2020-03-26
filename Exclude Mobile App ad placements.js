/*
My extended version of the script of this author
  ||  
  \/
*/

/****************************
* Exclude Mobile App ad placements that perform poorly
* Version 1.0 (Aug 08, 2018)
* 
* Created By: Optmyzr
* A supported version of this script is available at www.optmyzr.com
****************************/


function main() {

  // User Inputs
  var LAST_N_DAYS = 30,
      MAX_CPA = 25,
      MAX_COST_NO_CONVERSIONS = 50,
      EMAIL = 'example@example.com, example2@example.com'; //Comma separated list of emails
  

// ---------------------------------------------------- //
   // Script Code Begins Here. Do not edit below this line //
  // ---------------------------------------------------- //
  
  var DATE_RANGE = getAdWordsFormattedDate(LAST_N_DAYS, 'yyyyMMdd') + ',' +getAdWordsFormattedDate(0, 'yyyyMMdd');
  
  var toExclude = {}, alreadyManagedOrExcluded = {};
  var query = [
    'SELECT CampaignName, AdGroupName, AdGroupId, Id, Criteria, Impressions, Clicks, Conversions, Cost',
    'FROM PLACEMENT_PERFORMANCE_REPORT',
    'WHERE IsNegative IN [TRUE, FALSE] and Criteria CONTAINS_IGNORE_CASE "mobileapp"',
    'DURING ' + DATE_RANGE
  ].join(' ');
  
  var rows = AdWordsApp.report(query, { 'includeZeroImpressions': true }).rows();
  while(rows.hasNext()) {
    var row = rows.next();
    
    // Skip If the placement is managed or already excluded
    if((row.IsNegative == 'false' && row.Id != '--') || row.IsNegative == 'true') {
      if(!alreadyManagedOrExcluded[row.AdGroupId]) {
        alreadyManagedOrExcluded[row.AdGroupId] = {};
      }
      
      alreadyManagedOrExcluded[row.AdGroupId][row.Criteria] = 1;
      continue;
    }
    
    row.Cost = parseFloat(row.Cost.toString().replace(/,/g, ''));
    row.Conversions = parseFloat(row.Conversions.toString().replace(/,/g, ''));
    row.Cpa = row.Conversions == 0 ? row.Cost : row.Cost / row.Conversions;
    Logger.log(row.Criteria);
    // iTunes apps
    if(row.Criteria.indexOf("mobileapp::1-") != -1) {
    	row.Url = row.Criteria.replace('mobileapp::1-', 'adsenseformobileapps.com/1-');
    } 
    // Android apps
    else if(row.Criteria.indexOf("mobileapp::2-") != -1) {
    	row.Url = row.Criteria.replace('mobileapp::2-', 'adsenseformobileapps.com/');
    } else {
      row.Url= row.Criteria;
    }
      
    
    //Logger.log(row.Criteria + ': ' + row.Cpa);
    if((row.Conversions == 0 && row.Cost >= MAX_COST_NO_CONVERSIONS) || row.Cpa >= MAX_CPA) {
      if(!toExclude[row.AdGroupId]) {
        toExclude[row.AdGroupId] = {};
      }
      
      toExclude[row.AdGroupId][row.Criteria] = row;
    }
  }
  
  // Delete any exclusions which are already excluded or managed
  for(var id in toExclude) {
    if(!alreadyManagedOrExcluded[id]) { continue; }
    
    for(var criteria in toExclude[id]) {
      if(alreadyManagedOrExcluded[id][criteria]) {
        delete toExclude[id][criteria];
      }
    }
    
	if(!Object.keys(toExclude[id]).length) {
	  delete toExclude[id];
	}
  }
  
  var ids = Object.keys(toExclude);
  if(!ids.length) { 
    log('No Automatic Mobile Placements found matching the criteria');
    return; 
  }
  
  var out = [['Campaign', 'AdGroup', 'Matched Placement Url', 'Negative Placement Added', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'CPA']];
  var iter = AdWordsApp.adGroups().withIds(ids).get()
  while(iter.hasNext()) {
    var ag = iter.next();
    var id = ag.getId();
    for(var criteria in toExclude[id]) {
      var row = toExclude[id][criteria];
      ag.display().newPlacementBuilder().withUrl(row.Url).exclude();
      out.push([row.CampaignName, row.AdGroupName, row.Criteria, row.Url, row.Impressions, row.Clicks, row.Cost, row.Conversions, row.Cpa]);
    }
  }
  /*
  var ss = SpreadsheetApp.create(AdWordsApp.currentAccount().getName() + ' - Automatic Mobile Placements Exclusions');
  log('Report Url: ' + ss.getUrl());  
  
  var tab = ss.getSheets()[0];
  tab.setFrozenRows(1);
  
  tab.getRange(1,1,out.length, out[0].length).setValues(out).setFontFamily('Calibri').setVerticalAlignment('middle');
  tab.getRange(1,1,1, out[0].length).setBackground('#efefef').setFontWeight('bold').setHorizontalAlignment('center');
  
  tab.getRange(1,4,out.length,5).setHorizontalAlignment('center');
  
  log('Sending Email');
  var SUB = AdWordsApp.currentAccount().getName() + ' - Automatic Mobile Placements Exclusions'
  var MSG = 'Hi\n\nPlease find below the report of Automatic Mobile Placements which were excluded from the AdGroups:\n'+ss.getUrl()+'\n\nThanks';
  MailApp.sendEmail(EMAIL, SUB, MSG);
  
  ss.addEditors(EMAIL.split(','));
  */
}


function getAdWordsFormattedDate(d, format){
  var date = new Date();
  date.setDate(date.getDate() - d);
  return Utilities.formatDate(date,AdWordsApp.currentAccount().getTimeZone(),format);
}

function log(msg) {
  Logger.log(AdWordsApp.currentAccount().getName() + ' - ' + msg);
}
