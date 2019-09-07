var GOOGLE_DOC_URL = "https://docs.google.com/spreadsheets/d/1rlC0W0Kx5ME-uvQ1fd28DSrhXGmrqI9eYAHXSa9qZPU/edit?usp=sharing";

function main() {

clicks = runCampaignReport();
modifySpreadSheet(clicks);

}
function runCampaignReport() {

var listOfClicks = [];

var report = AdWordsApp.report(
'SELECT Date, GclId, ClickType, Page, Slot, CriteriaParameters, AdFormat, CriteriaId, AdGroupId, CampaignId ' +
'FROM CLICK_PERFORMANCE_REPORT ' +
'DURING YESTERDAY');

var rows = report.rows();

while (rows.hasNext()) {
var row = rows.next();

var date = row['Date'];
var gclid = row['GclId'];
var clickType = row['ClickType'];
var page = row['Page'];
var slot = row['Slot'];
var criteria = row['CriteriaParameters'];
var adFormat = row['AdFormat'];
var CriteriaId = row['CriteriaId'];
var AdGroupId = row['AdGroupId'];
var CampaignId = row['CampaignId'];

var clickResult = new clickData(date, gclid, clickType, page, slot, criteria, adFormat, CriteriaId, AdGroupId, CampaignId );

listOfClicks.push(clickResult);

} // end of report run

return listOfClicks;

}

function clickData(date, gclid, clickType, page, slot, criteria, adFormat, CriteriaId, AdGroupId, CampaignId) {
this.date = date;
this.gclid = gclid;
this.clickType = clickType;
this.page = page;
this.slot = slot;
this.criteria = criteria;
this.adFormat = adFormat;
this.CriteriaId = CriteriaId;
this.AdGroupId = AdGroupId;
this.CampaignId = CampaignId;

}

function searchString(sheett,date){
  var sheet = sheett
  var search_string = date
  var textFinder = sheet.createTextFinder(search_string)
  var search_row = textFinder.findNext().getRow()
  return search_row
}



function modifySpreadSheet(results) {
  
var gclidResults = results;

var gclidSS = SpreadsheetApp.openByUrl(GOOGLE_DOC_URL);

var sheet = gclidSS.getActiveSheet();
  
//if (results.length>0) {sheet.clear();} 

if (results.length>0) {
var firstDateRow = searchString(sheet,gclidResults[0].date)
Logger.log(firstDateRow);
var lastRow = sheet.getLastRow();
var lastCol = sheet.getLastColumn();
var delRange = sheet.getRange(firstDateRow,1,lastRow,lastCol);
  delRange.clear();
}

var columnNames = ["Date", "Gclid", "Criteria", "ClickType", "Page", "Slot", "AdFormat","CriteriaId", "AdGroupId", "CampaignId" ];

var headersRange = sheet.getRange(1, 1, 1, columnNames.length);

for (i = 0; i < gclidResults.length; i++) {
headersRange.setValues([columnNames]);
var date = gclidResults[i].date;
var gclid = gclidResults[i].gclid;
var criteria = " " + gclidResults[i].criteria;
var clickType = gclidResults[i].clickType;
var page = gclidResults[i].page;
var slot = gclidResults[i].slot;
var adFormat = gclidResults[i].adFormat;
var CriteriaId = gclidResults[i].CriteriaId;
var AdGroupId = gclidResults[i].AdGroupId;
var CampaignId = gclidResults[i].CampaignId;

sheet.appendRow([date, gclid, criteria, clickType, page, slot, adFormat, CriteriaId, AdGroupId, CampaignId]);
}
}