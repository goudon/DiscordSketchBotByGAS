const VIDEO_SHEET = "VideoUrls";
const IMAGE_SHEET = "ImageUrls";


class Properties {
  private sheetID: string;
  private webHookUrl: string;
  constructor() {
    this.sheetID = "";
    this.webHookUrl =
      "";
  }
  getSheetID(): string {
    return this.sheetID;
  }
  getWebHookUrl(): string {
    return this.webHookUrl;
  }
}

class SpreadSheet {
  private sheetID: string;
  constructor(sheetID: string) {
    this.sheetID = sheetID;
  }
  getRandomUrl(targetSheetName: string): string {
    var spreadSheet = SpreadsheetApp.openById(this.sheetID);
    var sheet = spreadSheet.getSheetByName(targetSheetName);
    var sheetRowsCount = sheet.getLastRow();
    var maxRowNum = sheet.getRange(1, 1, sheetRowsCount).getLastRow() + 1;
    var targetString = "";
    var errorCount = 0;
    while (targetString === "" && errorCount < 10) {
      var randomRowNumber = Math.floor(
        Math.random() * Math.floor(maxRowNum) + 1
      );
      targetString = sheet.getRange(randomRowNumber, 1).getValue();
      errorCount++;
    }
    return targetString;
  }
}

class Discord {
  private message: Object;
  private webHookUrl: string;
  constructor(webHookUrl: string, url: string) {
    this.webHookUrl = webHookUrl;
    var content = {
      content: "今日のクロッキー： " + url,
    };
    this.message = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(content),
    };
  }
  sendMessage() {
    UrlFetchApp.fetch(this.webHookUrl, this.message);
  }
}

function main() {
  var propaties = new Properties();
  var sheetId = propaties.getSheetID();
  var webHookUrl = propaties.getWebHookUrl();
  var spreadSheet = new SpreadSheet(sheetId);
  var urlString = spreadSheet.getRandomUrl(VIDEO_SHEET);
  if (urlString !== "") {
    var discord = new Discord(webHookUrl, urlString);
  }
  discord.sendMessage();
}
