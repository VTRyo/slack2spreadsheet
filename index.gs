function getMessageHistory() {
  let channelId = PropertiesService.getScriptProperties().getProperty('CHANNEL');
  let baseUrl = 'https://slack.com/api/conversations.history'
  let url = baseUrl + "?channel=" + channelId;
  
  let TOKEN = PropertiesService.getScriptProperties().getProperty('TOKEN');
  let options = {
    "method": "GET",
    "headers": {
      "Authorization": "Bearer " + TOKEN
    }
  }
  let res = UrlFetchApp.fetch(url, options)
  let data = JSON.parse(res.getContentText());
  let dataMessages = data.messages

  for (let i = 0; i < dataMessages.length; i++) {
    let resultData = []
    if (dataMessages[i].subtype === "bot_message" && dataMessages[i].username === "Reacji Channeler") {
      // console.log(dataMessages[i])
      if (dataMessages[i].hasOwnProperty("attachments")) {
        // attachmentsから詳細を引っこ抜きたい
        let attachment = dataMessages[i].attachments[0]
        if (attachment.hasOwnProperty("files")) {
          // filesが複数あればその分取得したかったが、それがスプシにあっても使いづらいので画像が複数あることだけわかるようにする
          resultData.push(getOrgFiles(attachment))
          if (attachment.hasOwnProperty("text")) {
              // console.log(getOrgText(attachment))
              resultData.push(getOrgText(attachment))
          } else {
            resultData.push('')
          }         
        } else {
          // console.log(getOrgText(attachment))
          resultData.push('')
          resultData.push(getOrgText(attachment))
        }
        // console.log(getOrgChannelName(attachment))
        // console.log(getOrgLink(attachment))
        // console.log(dataParse(dataMessages[i]))

        resultData.push(getOrgChannelName(attachment))
        resultData.push(getOrgLink(attachment))
        resultData.push(dataParse(dataMessages[i]))
      }
      writeToSheet(resultData)
    }
  }
} 

function getOrgChannelName(attachmentData) {
  return attachmentData.channel_name
}
function getOrgFiles(attachmentData) {
  return attachmentData.files[0].url_private
}
function getOrgText(attachmentData) {
  return attachmentData.text
}
function getOrgLink(attachmentData) {
  return attachmentData.from_url
}
function dataParse(data) {
  let date = new Date(data.ts * 1000);
  return date.toLocaleDateString("ja-JP")
}

function writeToSheet(data) {
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  const SHEET_NAME = "test";
  var spreadSheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadSheet.getSheetByName(SHEET_NAME);

  sheet.appendRow(data)
}
