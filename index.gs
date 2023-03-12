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

  let dataArray = []
  let filteredDataArray = []
  for (let i = 0; i < dataMessages.length; i++) {
    if (dataMessages[i].subtype === "bot_message" && dataMessages[i].username === "Reacji Channeler") {
      dataArray.push(dataMessages[i].attachments)
    }
    filteredDataArray = dataArray.filter((element) => {
      return element !== undefined;
    });
  }
  for (let i = 0; i < filteredDataArray.length; i++) {
    if (filteredDataArray[i][0].hasOwnProperty("files")) {
      console.log(filteredDataArray[i][0].files[0].url_private)
    } else {
      console.log(filteredDataArray[i][0].text)
    }
  }
}
