_.mixin({templateFromUrl: function (url, selector) {
  var templateHtml = "";
  selector = selector || null;
  $.ajax({
      url: url,
      method: "GET",
      async: false,
      success: function(data) {
          if(selector){
            templateHtml =  _.unescape($(data).filter(selector).html());
          }else{
            templateHtml =  _.unescape(data);
          }


      }
  });

  return _.template(templateHtml);
}});

function nextNQuarters(N){
  var cur_qtr = moment().quarter();
  var cur_yr = moment().year()
  var result = [];
  while(N > 0){
    if(cur_qtr == 4){
      cur_yr++;
      cur_qtr = 1;
      result.push('Q'+cur_qtr+'-'+cur_yr)
    }else{
      cur_qtr++;
      result.push('Q'+cur_qtr+'-'+cur_yr)
    }
    N--;
  }
  return result
}

function previousNQuarters(N){
  var cur_qtr = moment().quarter();
  var cur_yr = moment().year()
  var result = [];
  while(N > 0){
    if(cur_qtr == 1){
      cur_yr--;
      cur_qtr = 4;
      result.push('Q'+cur_qtr+'-'+cur_yr)
    }else{
      cur_qtr--;
      result.push('Q'+cur_qtr+'-'+cur_yr)
    }
    N--;
  }
  return _.reverse(result)
}

function quarterString(ts){
  var fmt_date = moment(ts);
  var current = moment([moment().year(),moment().month()]);
  if(fmt_date > current.add(2,'Q')){
    return 'beyond';
  }else if(fmt_date < current.subtract(3,'Q')){
    return 'before';
  }else{
    return 'Q' + fmt_date.quarter() + '-' + fmt_date.year();
  }
}

function nextNFiscalQuarters(N){
  var cur_qtr = moment();
  var result = [];
  while(N > 0){
    var tmpObj = moment().add(N,'Q').fquarter();
    result.push(getStringFromQuarter(tmpObj))
    N--;
  }
  return _.reverse(result)
}

function previousNFiscalQuarters(N){
  var cur_qtr = moment();
  var result = [];
  while(N > 0){
    var tmpObj = moment().subtract(N,'Q').fquarter();
    result.push(getStringFromQuarter(tmpObj))
    N--;
  }
  return result
}

function fiscalQuarterString(ts) {
  var fmt_date = moment.unix(ts);
  var tmpObj = fmt_date.fquarter();

  var beyond_odd = nextNFiscalQuarters(20).slice(3);
  var beyond_even = nextNFiscalQuarters(20).slice(2);

  var before_odd = previousNFiscalQuarters(20).slice(1,18);
  var before_even = previousNFiscalQuarters(20).slice(1,17);

  var comparision_string = getStringFromQuarter(tmpObj);

  if(moment().fquarter().quarter % 2 == 0){

    if(_.includes(beyond_even,comparision_string)){
      return 'beyond';
    }else if(_.includes(before_even,comparision_string)){
      return 'before';
    }else{
      return comparision_string;
    }

  }else{

    if(_.includes(beyond_odd,comparision_string)){
      return 'beyond';
    }else if(_.includes(before_odd,comparision_string)){
      return 'before';
    }else{
      return comparision_string;
    }

  }
}

function getStringFromQuarter(tmpObj){
  return 'Q' + tmpObj.quarter + '-' + tmpObj.year + '-' + tmpObj.nextYear.toString().slice(2);
}

function getStringFromQuarterAlternate(tmpObj){
  return 'Q' + tmpObj.quarter + ' ' + tmpObj.year + '-' + tmpObj.nextYear.toString().slice(2);
}
