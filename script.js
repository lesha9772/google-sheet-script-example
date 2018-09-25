function calcCOSTS() {
  var date = new Date('2018-09-01');
  var login = '';
  var token = '';


  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();
  var rows = [],  arr = [], data;

  var today = new Date();

  var date2 = new Date(today);
  var date1 = new Date(date);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var dayDifferenceNumber = Math.ceil(timeDiff / (1000 * 3600 * 24));
  var dayDifference = parseInt(dayDifferenceNumber);

  for (i = 0; i < dayDifference; i++) {
    var newdate = addDays(date1, i);
    var dd = newdate.getDate();
    var mm = newdate.getMonth()+1;
    var y = newdate.getFullYear();
    if(dd < 10)dd = '0'+dd;
    if(mm < 10)mm = '0'+mm;

    var someFormattedDate = y + '-' + mm + '-' + dd;
    arr.push({'date': someFormattedDate, 'spent_USD':'',  'curs_RUB':'',   'curs_USD':'',   'curs_UAH':'', 'sum_RUB':'1'});
  }

  for (i = 0; i < arr.length; i++) {
    var url="https://mixadvert.com/advertiser/api/?login=" + login + "&token=" + token +"&action=exchange_rates&date=" + arr[i].date; // Paste your JSON URL here
    var response = UrlFetchApp.fetch(url); // get feed
    var dataAll = JSON.parse(response.getContentText()); //
    arr[i].curs_RUB = dataAll[0].RUB;
    arr[i].curs_UAH = dataAll[0].UAH;
    var url="https://mixadvert.com/advertiser/api/?login=" + login + "&token=" + token + "&action=balance_stat&date=" + arr[i].date; // Paste your JSON URL here
    var response = UrlFetchApp.fetch(url); // get feed
    var dataAll = JSON.parse(response.getContentText()); //
    arr[i].spent_USD = dataAll[0].spent;
    var sum = arr[i].spent_USD * arr[i].curs_RUB;
    arr[i].sum_RUB = sum.toFixed(2);
  }

  arr.unshift({'date': 'ДАТА', 'spent_USD':'ЗАТРАТЫ в USD',  'curs_RUB':'КУРС RUB',   'curs_USD':'',   'curs_UAH':'', 'sum_RUB':'ЗАТРАТЫ В RUB'});
  for (i = 0; i < arr.length; i++) {
    rows.push([arr[i].date, arr[i].spent_USD, arr[i].curs_RUB, arr[i].sum_RUB]); //your JSON entities here
  }
  dataRange = sheet.getRange(1, 1, rows.length, 4); // 3 Denotes total number of entites
  dataRange.setValues(rows);

}

// function to add days to a given date.
function addDays(startDate,numberOfDays)
{
  var returnDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()+numberOfDays,
    startDate.getHours(),
      startDate.getMinutes(),
        startDate.getSeconds());
  return returnDate;
}
