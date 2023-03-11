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
  console.log(data.messages[2]);
}
