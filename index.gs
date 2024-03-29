function getMessageHistory() {
  let STARTDATE = Date.parse("2023-10-01 00:00:00") / 1000
  let ENDDATE = Date.parse("2023-10-20 23:59:59") / 1000
  let channelId = PropertiesService.getScriptProperties().getProperty('CHANNEL');
  let baseUrl = 'https://slack.com/api/conversations.history'
  let url = baseUrl + "?channel=" + channelId + "&oldest=" + STARTDATE + "&latest=" + ENDDATE;

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
    // Reacjiで通知してきたものだけ検索する
    if (dataMessages[i].subtype === "bot_message" && dataMessages[i].username === "Reacji Channeler") {
      // attachmentsはSlackメッセージを装飾するもの。ここではBotが投稿した内容が格納されいている
      if (dataMessages[i].hasOwnProperty("attachments")) {
        let attachment = dataMessages[i].attachments[0]
        if (attachment.hasOwnProperty("files")) {
          // filesが複数あればその分取得したかったが、それがスプシにあっても使いづらいので画像が複数あることだけわかるようにする
          resultData.push(getOrgFiles(attachment))
          if (attachment.hasOwnProperty("text")) {
              text = getOrgText(attachment)
              resultData.push(removeLF(text))
          } else {
            resultData.push('')
          }
        } else {
          resultData.push('')
          text = getOrgText(attachment)
          resultData.push(removeLF(text))
        }

        resultData.push(getOrgChannelName(attachment))
        resultData.push(getOrgLink(attachment))
        resultData.push(dateParse(dataMessages[i]))
      }

      // resultData [string]
      // ["image","text","channel","url","date"]
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
function dateParse(data) {
  let date = new Date(data.ts * 1000);
  return date.toLocaleDateString("ja-JP")
}
// 改行が入っている内容はスペースに置き換える
function removeLF(text) {
  parseText = text.replace(/\r?\n/g, ' ')
  return parseText
}

function writeToSheet(data) {
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  const SHEET_NAME = PropertiesService.getScriptProperties().getProperty('SHEET_NAME')
  var spreadSheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadSheet.getSheetByName(SHEET_NAME);

  try {
    sheet.appendRow(data)
  } catch(e) {
    Logger.log("シート名が正しいか確認してください " + e)
    Logger.log("シートIDが正しいか確認してください " + e)
  }
}
