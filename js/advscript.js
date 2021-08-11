//const CryptoJS = require("crypto-js");
var crypto = {};
crypto.encode = function(msg, key, cb) {
  if (!msg || !key) return false;
  var encrypted = CryptoJS.AES.encrypt(msg, key);
  if (cb) cb(encrypted.toString());
  return encrypted.toString();
};

crypto.decode = function(msg, key, cb) {
  if (!msg || !key) return false;
  var decrypted;
  try {
    decrypted = CryptoJS.AES.decrypt(msg, key);
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    decrypted = false;
  }
  if (cb) cb(decrypted);
  return decrypted;

};

function addCommas(NumberStr) {
  if(NumberStr==0) return 0;
  if (!NumberStr) return '';
  NumberStr += '';
  var NumberData = NumberStr.split('.');
  var Number1 = NumberData[0];

  var Number2 = NumberData.length > 1 ? '.' + NumberData[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(Number1)) {
    Number1 = Number1.replace(rgx, '$1' + ',' + '$2');
  }
  if (Number2.length > 3) Number2 = Number2[0] + Number2[1] + Number2[2];
  return Number1 + Number2;
}
var exceptionfeild = [];

function COPYOBJ(fromobj, toobj) {
  var temp = Object.getOwnPropertyNames(fromobj);

  for (var x = 0; x < temp.length; x++) {
    if (typeof(fromobj[temp[x]]) == 'string' || typeof(fromobj[temp[x]]) == 'number' || typeof(fromobj[temp[x]]) == 'boolean' || Array.isArray(fromobj[temp[x]])) {
      if (exceptionfeild.indexOf(temp[x]) !== -1) continue; // Exception Value feild
      toobj[temp[x]] = fromobj[temp[x]];
    }
  }
}
// To use function
//      <table id='obj2use'><tr class='row_tablecontent' style='display:none'><td class='datasetname_id'> this is id value </td></tr></table>
//
function tablerow(objtable, datasetname, tabledata, template, update) { // Do each row
  if (!datasetname) datasetname = '';

  var TR;
  if (!update) { // New Record
	TR = objtable.find('.row_tablecontent').last();
	objtable.append(template); // Append invisible Template for next record
    TR.attr("data-id", tabledata._id); // assign Data To TR tag   attribute  data-id=1.2.3...
  }else if(update=='new'){
    objtable.prepend(template); // Template for next record
    TR = objtable.find('.row_tablecontent').first();
    TR.attr("data-id", tabledata._id);
  }else {
    var nameofrow = "[data-id=" + tabledata._id + "]";
    TR = objtable.find(nameofrow)
      .first();
  }


  setdatabyclass(TR, datasetname, tabledata);

  //TR.show('slow');
  return TR;
};

function setdatabyclass(objjquery, datasetname, objdata) {
  if (!objdata || objdata == null) return;
  if (!datasetname) datasetname = '';

  if (Number(objdata._id) > 0) objdata.id = Number(objdata._id);
  if (objdata.id > 0) objjquery.attr("data-id", objdata.id);

  var propname = Object.getOwnPropertyNames(objdata);

  for (var x = 0; x < propname.length; x++) {
    var relateobj;
    if (propname[x] == '_id') {

      relateobj = objjquery.find('.' + datasetname + propname[x]);
    } else {
      // GET relate OBject
      relateobj = objjquery.find('.' + datasetname + '_' + propname[x]);

    }
    //console.log("Found "+'.' + datasetname + '_' + propname[x],relateobj)
    for (var y = 0; y < relateobj.length; y++) {
      var jqobj = relateobj[y]; // Change To JQuery OBJECT

      if (jqobj.nodeName == 'SELECT' || jqobj.nodeName == 'BUTTON' || jqobj.nodeName == 'INPUT') { // Select Box
        $(jqobj)
          .val(objdata[propname[x]]);
      } else if (jqobj.nodeName == 'CHECK') { // Checkbox ?? will do it later
        // console.log("FOUND CHECK")

      } else if (jqobj.nodeName == 'IMG') { // IMG SET SRC
        jqobj.src = objdata[propname[x]];

      } else { // Other object
        if (propname[x] == 'lastupdate') {
          $(jqobj)
            .html(moment(objdata[propname[x]], "X")
              .format('D/M H:mm:ss'));
        } else {
          $(jqobj)
            .val(objdata[propname[x]]);
          $(jqobj)
            .html(objdata[propname[x]]);
        }
      }

    }
  }
}
///// URL FUNCTION

//Firsttime Calll
var url = window.location.href;
var querysplit = url.split('/');
var yearpage = querysplit[3];
var mainview = querysplit[4];
var subview = querysplit[5];
var detailofview = querysplit[6];

var starturl = '/' + mainview;
if (subview) starturl += '/' + subview;
if (detailofview) starturl += '/' + detailofview;

/*
if(detailofview.indexOf('?') !== -1){
    detailofview  = detailofview.split('?');
    detailofview  = detailofview[1];
}
*/
// anyquery ..
function getQueryVal(name, urlsearch) {
  urlsearch = url;
  name = name.replace(/[\[]/, '\\[')
    .replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(urlsearch);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



var allpage_register = [],all_url2load=[];
var stack_onPageshow =[];
function onPageshow(anycondition,url2load, fnc2set,nowaitsocket=false) {

  if(typeof(url2load) == 'function') {
    nowaitsocket = fnc2set || false;
    fnc2set = url2load;
    url2load = false;

  }


  if (anycondition.indexOf('/') !== 0) { // First String is '/'  not found at first position
    anycondition = '/' + anycondition;
  }
  var url = anycondition;
  var querysplit = url.split('/');
  //var subyearpage = querysplit[3];
  var submainview = querysplit[1];
  var subsubview = querysplit[2];
  var detailofview = querysplit[3];


  var registerurl = '/' + submainview;
  if (subsubview) registerurl += '/' + subsubview;
  if (detailofview) {
    if (detailofview.indexOf('?') !== -1) {
      detailofview = detailofview.split('?');
      detailofview = detailofview[1];
    }
    registerurl += '/' + detailofview;
  }

  for (var x = 0; x < allpage_register.length; x++) {
    if (allpage_register[x].condition == registerurl) {
      allpage_register[x].fnc = fnc2set;
      allpage_register[x].url2load = url2load;
      allpage_register[x].nowaitsocket = nowaitsocket;
      return; // found old one.
    }

  }
  //console.log("Register Page " + registerurl);
  // not found then register new
  allpage_register.push({
    condition: registerurl,
    fnc: fnc2set,
    url2load:url2load,
    nowaitsocket : nowaitsocket
  });
    return url2load

}

function triggerPageshow(anycondition) { // Register function
  $('.mainpage')
    .hide(); // Main Class of DIV View 2 Hide
  if (anycondition.indexOf('/') !== 0) { // First String is '/'  not found at first position
    anycondition = '/' + anycondition;
  }

  //console.log('triggerPageshow PAGE: ', anycondition)

  var querysplit = anycondition.split('/');
  var submainview = querysplit[1];
  var subsubview = querysplit[2];
  var detailofview = querysplit[3];
  if (!submainview) return;
  var con2check = '/' + submainview;
  if (subsubview) con2check += '/' + subsubview;
  if (detailofview) con2check += '/' + detailofview;
  if(cntrlIsPressed){
    var urlsearch = window.location.href;
    window.open(urlsearch,'_blank');
    return;
  }
  for (var x = 0; x < allpage_register.length; x++) {
      var testreg = new RegExp(allpage_register[x].condition + '\\w*');
      var match= con2check.match(testreg);
    if(match && match[0] && match[0] == allpage_register[x].condition) { // Found 1 post
      detailofview = anycondition.replace(allpage_register[x].condition,'');
      var pagedata = allpage_register[x];
      var fnc = pagedata.fnc;
      var url2load = pagedata.url2load;

/*      NO SOCKET
      if(pagedata.nowaitsocket == false && !socketalreadyconnect ){
        console.log("Wait for Socket 2 Called PageShow:"+anycondition);
        stack_onPageshow.push({anycondition:anycondition});
        return;
      }
      */
      // Check if have to wait Socket ?


      //
      try {

        //console.log(pagedata);

        if(url2load){   // opage load with URL
          if(pagedata.alreadyload){
            console.log("content alreadyload " + url2load.url);
            $(url2load.obj).html (pagedata.alreadyload );
            if(typeof(fnc) == 'function'){
              //console.log("call function after load");
                fnc(detailofview);
            }
            if(typeof(refreshpage) == 'function'){
              refreshpage(detailofview);

              if(typeof(refresh_config_module) == 'function'){
                refresh_config_module();
              }
            }
          }else{
            console.log("load new content:" + url2load.url);
            //pagedata.alreadyload = true;
    /*        $.ajaxSetup({
              async :false,
            });
*/
              $.get(url2load).done(function(data){
                  pagedata.alreadyload =data;
                //  return;
                //  console.log("Load Complte");
                  $(url2load.obj).html (data);
                  if(typeof(fnc) == 'function'){
                  //  console.log("call function after load");
                      fnc(detailofview);
                  }
                  if(typeof(refreshpage) == 'function'){
                      refreshpage(detailofview);
                      if(typeof(refresh_config_module) == 'function'){
                        refresh_config_module();
                      }
                  }
/*
                  $.ajaxSetup({
                    async :true,
                  });
*/
              }).fail(function(){console.error("Error Loading :"+ url2load.url);});

          }
        }else{
          if(typeof(fnc) == 'function'){
          //  console.log("call function after load");
              fnc(detailofview);
          }
          if(typeof(refreshpage) == 'function'){
              console.error('Refresh function may be bugs..');
              refreshpage(detailofview);
              if(typeof(refresh_config_module) == 'function'){
                refresh_config_module();
              }
          }else{
            console.log('refreshpage is not function' );
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

}
var adv_current_pushstate;
function go2View(anyinternalurl, titlename) {
  if(!anyinternalurl )return;
  console.log("go2View " + anyinternalurl);


  if(typeof(refreshpage) == 'function') refreshpage = undefined;    // Clear Old Page data

  var url = anyinternalurl;
  if (anyinternalurl.indexOf('./') === 0) { // First Start is short
    var detailofview = anyinternalurl.substr(2);
    var subyearpage = yearpage;
    var submainview = mainview;
    var subsubview = subview;
    //  console.log("Short Hand");

  } else if (anyinternalurl.indexOf('/') == 0) { // First String is '/'
    var querysplit = url.split('/');
    //var subyearpage = querysplit[3];
    var submainview = querysplit[1];
    var subsubview = querysplit[2];
    var detailofview = querysplit[3];
  } else {
    var querysplit = url.split('/');
    //var subyearpage = querysplit[3];
    var submainview = querysplit[0];
    var subsubview = querysplit[1];
    var detailofview = querysplit[2];
  }

  var registerurl = '/' + yearpage + '/' + submainview;
  if (subsubview) registerurl += '/' + subsubview;
  if (detailofview) {
    registerurl += '/' + detailofview;
    if (detailofview.indexOf('?') !== -1) {
      detailofview = detailofview.split('?');
      detailofview = detailofview[1];
    }
  }


  if (!titlename) titlename = subview + '/' + detailofview;




  window.history.pushState({
    callpath: anyinternalurl
  }, titlename, registerurl);
  adv_current_pushstat = anyinternalurl;
  // $('#view_timer_manage').show(); // Class or ID of DIV 2 Show;
  //  console.log("TRIGGER " + anyinternalurl);
  triggerPageshow(anyinternalurl);

  return false; // Must Return False everytime prevent page reload
}


/// end URL FUNCTION
/// ####### AJAX LOGIN SYSTEM PART

$(document)
  .ajaxSuccess(function(event, xhr, settings) {
    var temp = xhr.responseText;
    if (temp.length < 100 && temp.indexOf('{"loginfail":') == 0) {

      console.log(temp);
      //if (temp.loginfail) { // force logout
      console.log("FOUND LOGIN FIAL");
      go2View('/cpanel/logout');
      return false;
      //}
    }
    if (xhr.responseText == 'forcelogout') {
      console.log("Session Timeout force .. Logout ..");
    }

  });

/*
var _load = $.fn.load;
$.fn.load = function(url, params, callback) {
    if(typeof url !== "string") {
        return _load.apply(this, arguments);
    }

    // do your ajax stuff here
}
*/
function ajax_settoken(token,activeORG) {
  //return;
  $.ajaxSetup({
    //  dataType: "json",
    headers: {
      'Authorization': 'Bearer ' + token,
    //   contentType:"application/json; charset=utf-8",
    },
//    async :false,
  });
  // setup WS Member here!!
  //connect_wssocket(token,'/webclient');   // When Authentic passed , connect channel /monitor
  console.log("Headers set!");
}

window.onpopstate = function(e) {
  if (e.state && e.state.callpath) {
    //console.log("STATE CHANGE goto view " + e.state.callpath);
    triggerPageshow(e.state.callpath);
  }

};

var mysessionid;
//
var socket, socketalreadyconnect;

function connect_wssocket(uniqueid,path) {

  console.log("Connecting web Socket");
  if (socketalreadyconnect) {
    console.log("socket already connect then reject this request");
    return;
  }
  mainconfig = { // url , password
    reconnection: true,
    path: path || '/webclient',
    reconnectionDelay: 10000,
    autoConnect: true,
    query: 'uniqueid=' + uniqueid + '&classtype=webclient',
    rejectUnauthorized: false, // Self Sign Pass throuth
    transports: ['websocket'],
    password: '123456'
    // secure: true			// FOR SSL

  };
  mainconfig.query += '&encodedid=' + encodeURIComponent(crypto.encode(uniqueid, mainconfig.password));

  //console.log("Socket io Connecting.." + websocket_url_for_connect + mainconfig.query);

  socketalreadyconnect = true;
  for(var x=0; x < stack_onPageshow.length;x++){
    var call_arg = stack_onPageshow[x];
    console.log("late Called:"+call_arg.anycondition);
    //onPageshow(call_arg.anycondition,call_arg.url2load, call_arg.fnc2set);
    triggerPageshow(call_arg.anycondition);

  }
    stack_onPageshow = undefined;
    return; // Disable web Socket
    socket = io(websocket_url_for_connect, mainconfig);


  socket.on('error', function(err) {
    console.log("connect err", err);
  });
  socket.on("refresh", function(msg) {
    window.location.replace('/2019/cpanel/order_list');
  });
  socket.on("console", function(msg,cb){
  	if(cb && typeof(cb) == 'function'){
  		cb({msg:'I got your msg'});
  	}
  	console.log('socket console msg: ',msg);
  });
  socket.on('connect', function() {
    console.log("connected");
  });
  socket.on('event', console.log);
  socket.on('disconnect', (err) => {
    console.log("Error disconnect:", err);
    /*
        if (whenOffline) {
          whenOffline();
        }
        */
  });

}

function getParameterByName(name,urlsearch) {
    if(!urlsearch)    urlsearch = window.location.href;
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(urlsearch);

    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
function paramsToObject(entries) {
  const result = {}
  for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}
function ADV_search(setting,notsearchatfirst){
   var setval = {
       url:setting.posturl,
       eventname:setting.eventname,
       fnc_result:setting.showfunction,
       paging:setting.paginationDIV,
       pagesize:setting.pagesize,
       pagelimit:setting.limit,
       currentsearch:{
         page:setting.page || 1,
         limit:setting.limit,
       }
   }
   if(setting.search){
     setval.currentsearch.search = setting.search;
   }
   setval.firsttimecall = true;
   var preventsearchatfirst=false;

 var search_function = function (query,firsttime){
      var disablehistory = firsttime;
      if(window.location.search && setval.firsttimecall){
        const urlParams = new URLSearchParams(window.location.search);
        const entries = urlParams.entries(); //returns an iterator of decoded [key,value] tuples
        const params = paramsToObject(entries); //{abc:"foo",def:"[asf]",xyz:"5"}
      //  if(params.page >1) query.page = params.page;
        delete params.page ;
      //  if(params.limit >1) query.limit = params.limit;
        delete params.limit;
        var key_param = Object.getOwnPropertyNames(params);
        if(key_param.length > 0){   // Still have search string
          query.search = params
        }

      }
      if(setval.firsttimecall ){
        setval.firsttimecall = false;
      }
       if(setval.currentsearch != query){
         //console.log("NEW SEARCH....");
         // outside query..

         firsttime =true;
         preventsearchatfirst =true;
         if(!query.limit){
           query.limit = setval.pagelimit;
         }
         setval.currentsearch = query;
       }else{

       }

       // set URL to showsql
          var showurl = '?'
          if(Number(query.page) >1){
              showurl+='page=' + query.page + '&';
          }
             // test Empty isArray
          var keys = Object.getOwnPropertyNames(query);
          for (var x=0; x < keys.length;x++){
            var testing = query[keys[x]];
            if(Array.isArray(testing) && testing.length == 0){
                delete query[keys[x]];
            }
          }
          if(typeof(query.search) =='object'){
              var keys = Object.getOwnPropertyNames(query.search);
              for (var x=0; x < keys.length;x++){
                if(keys[x] != '_id'){
                  showurl += keys[x] + '=' + encodeURIComponent(query.search[keys[x]]) + '&';
                }else{
                  showurl += 'id=' + Number(query.search[keys[x]]) + '&';
                }
              }
          }

          var pagename = window.location.pathname.split('/')[URL_PAGE_POSITION];
          adv_current_pushstat = adv_current_pushstat.replace(window.location.search,'');
          if(adv_current_pushstat && adv_current_pushstat.indexOf('/') !==0) {
              adv_current_pushstat='/' + adv_current_pushstat
          }
          //console.log("showurl",showurl)
          showurl = showurl.substr(0,showurl.length-1);
          if(showurl=='?') showurl='';
          if(!disablehistory){
            window.history.pushState({
              callpath: adv_current_pushstat ,
            }, undefined, '/'+pagename+ adv_current_pushstat + showurl);
          }
          /*
          var pos = currenturl.indexOf('?')

          */
       //
      if(setval.url){
       if(query.search){
         if(!query.search._id && query.search.id) query.search._id = query.search.id;
         if(!query.search.id && query.search._id) query.search.id = query.search._id;
       }

       console.log("Search at POST:"+setval.url,query);
         $.postJSON(setval.url,query,function (msg) {
          console.log('Search response:',msg)
            if(msg.errortext){
              return alert(msg.errortext)
            }
             if(!msg.obj){
                if(msg.result||msg.report||msg.field2show){
                  if(!msg.field2show){
                    msg.field2show = []
                  }
                  if(!msg.report){
                    msg.report = []
                  }
                  msg.obj = {
                    result :msg.result,
                    report:msg.report,
                    field2show:msg.field2show
                  }

                }else{
                  return alert("ERROR ! Not Data pattern return ,No msg.payload.obj");
                }
             }

             var record_per_page = query.limit;
             var totalrecord =   msg.totalrecord;
             var totalpage = Math.ceil(totalrecord/record_per_page);
             var page = [];
             for(var x=1;x <= totalpage; x++) page.push(x);
             // Show data
             console.log("search result",msg.obj);
             setval.fnc_result(msg.obj,totalrecord,msg.field2show);
             if(firsttime){
               if(!totalrecord){
                 totalrecord =0
               }
                if(!setval.paging || setval.paging.length == 0) return ;
                 setval.paging.pagination({
                   dataSource: {data:page},
                   locator:'data',
                   pageSize: 1,
                   pageNumber:setval.currentsearch.page,
                   pageRange:10,showNavigator:true,
                   formatNavigator:' Total '+ addCommas(totalrecord) + ' records ',
                   className: 'paginationjs-theme-blue',
                   callback : search_page_change
               });
             }
             if(typeof(refresh_config_module) == 'function') refresh_config_module();
       })
    }else if(setval.eventname){
       query._callback='required';
       console.log("Emitting  ..." +setval.eventname+":",query);
       socket.emit(setval.eventname, query, function (msg) {
           if(!msg.payload || !msg.payload.obj) {
           	if(msg.payload && msg.payload.detail){
           		return alert(msg.payload.detail);
           	}
           	return alert("ERROR ! Not Data pattern return");
           }
           var record_per_page = query.limit;
           var totalrecord =   msg.payload.totalrecord;
           var totalpage = Math.ceil(totalrecord/record_per_page);
           var page = [];
           for(var x=1;x <= totalpage; x++) page.push(x);
           // Show data
           console.log('msg.payload.obj')
           setval.fnc_result(msg.payload.obj,totalrecord);
           if(firsttime){
              if(!setval.paging || setval.paging.length == 0) return ;
               setval.paging.pagination({
                 dataSource: {data:page},
                 locator:'data',
                 pageSize: 1,
                 pageNumber:setval.currentsearch.page,
                 pageRange:10,showNavigator:true,
                 formatNavigator:' Total '+ addCommas(totalrecord) + ' records ',
                 className: 'paginationjs-theme-blue',
                 callback : search_page_change
             });
           }
           if(typeof(refresh_config_module) == 'function') refresh_config_module();
     })
   }else{
     console.error(" SEARCH FUNCTION Require  setting.eventname or setting.posturl ");
   }
   } ;
   function search_page_change(data,pagination){

     if(setval.currentsearch.page != pagination.pageNumber){
       setval.currentsearch.page = pagination.pageNumber;
       if(!preventsearchatfirst) search_function(setval.currentsearch);
       preventsearchatfirst = false;
     }
   }
   if(!notsearchatfirst){
     search_function(setval.currentsearch,true);  // First Search when Load Page
   }
   return search_function;
 }
var _internal_cached_url={};
$.fn.find_id =  function(url){
    var temp = this.parents('.row_tablecontent').attr('data-id');
    if(Number(temp) > 0){
      return temp;
    }
    else return false;
}
$.fn.loadcached =  function(url,cb){
	if(_internal_cached_url[url]) {
    $(this).html(_internal_cached_url[url]);
   		if(cb)cb();


	}else{
		var main_obj =this;
		$.get(url,function(msg){
		//	console.log("From New Load",msg)
			_internal_cached_url[url]=msg;
			$(main_obj).html(_internal_cached_url[url]);
			if(cb) cb();
		});
	}
}
function getobjbyid(obj,id,removeit){
  if(!Array.isArray(obj)) return false;
  if(Number(id) > 0){
    for(var x=0;x < obj.length;x++){
      if(obj[x]._id == id) {
        var ans =obj[x];
        if(removeit){
          obj.splice(x,1);
          return obj
        }else{
          return ans;
        }
      }
    }
  }
}

function getindexbyid(obj, id, removeit) {
  if (!Array.isArray(obj)) return false;
  if (Number(id) > 0) {
    for (var x = 0; x < obj.length; x++) {
      if (obj[x]._id == id) {
        return x;
      }
    }
  }
}
function group(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function getdatetimestamp(date) {
  if (date) {
    datetime = new Date(date)
  } else {
    datetime = new Date()
  }
  var currentDate = datetime.getDate();
  var currentMonth = datetime.getMonth();
  var currentYear = datetime.getFullYear();

  var timestampStart = Math.floor(new Date(currentYear, currentMonth, currentDate) / 1000)
  if (timestampStart) {
    return timestampStart
  }

}

function timestamp2date(timestamp, type) {
  if (!type || type !== "ms") {
    timestamp = timestamp * 1000
  }
  if (timestamp) {
    var date = new Date(timestamp)
    var datadate = {}
    if (date) {
      datadate.original = date
      datadate.dateinput = moment(timestamp / 1000, "X").format('YYYY-MM-DD')
      datadate.datetimelocalinput = moment(timestamp / 1000, "X").format('YYYY-MM-DD' + 'T' + 'HH:mm:ss')
    }

    return datadate
  }
}

function unwindobj(data, fieldname, deleteoldfield) {
  if (Array.isArray(data) && data.length > 0) {
    data.map((item) => {
      if (item[fieldname]) {
        var keyobj = Object.keys(item[fieldname])
        if (Array.isArray(keyobj) && keyobj.length > 0) {
          keyobj.map((item2) => {
            item[item2] = item[fieldname][item2]
          })
          if (deleteoldfield && deleteoldfield == true) {
            delete item[fieldname]
          }
        }
      }
    })

  }
  return data
  // console.log('data2',data)
}

function html2excel(obj,html,fnc){
  // console.log('obj',obj)
  var newobjhash = {}
  var arrayfilter = []
  if(mytoken){
    // console.log('mytoken',mytoken)
    newobjhash.orgname = mytoken.orgname
    newobjhash.staffname = mytoken.name
  }
  if(obj){
    if(obj.name){
      newobjhash.name = obj.name
    }
    if(obj.filename){
      newobjhash.filename = obj.filename
    }
    var dateformat = ''
    moment.locale('th')
    if(obj.dfrom){
      dateformat +=  moment(obj.dfrom, "X").add(543, 'years').format('DD/MM/YYYY H:mm:ss')+' - '
    }
    if(obj.dto){
      dateformat += moment(obj.dto, "X").add(543, 'years').format('DD/MM/YYYY H:mm:ss')
    }
    if(obj.dtype){
      newobjhash.dtype =  obj.dtype
    }else{
      newobjhash.dtype = '-'
    }
    // console.log('filter',obj.filter)
    if(obj.filter&&obj.filter.length>0){
      arrayfilter = obj.filter
      // var keyf = Object.keys(obj.filter)
      // for(var x= 0;x<keyf.length;x++){
      //   var cdad = {}
      //   if(obj.filter[keyf[x]]){
      //     cdad.textfilter =keyf[x]
      //     cdad.datafilter =obj.filter[keyf[x]]
      //   }
      //   arrayfilter.push(cdad)
      // }
    }
    if(dateformat==''){
      newobjhash.date = '-'
    }else{
      newobjhash.date = dateformat
    }

  }else{
    newobjhash.name = 'report'
    newobjhash.filename = 'report'
  }
  var nowdate = moment(Math.floor(new Date()/1000), "X").format('YYYY-MM-DD H:mm:ss')
  // var day_ex = nowdate.getDate()
  // var month_ex = nowdate.getMonth() + 1
  // var year_ex = nowdate.getFullYear();
  if(nowdate){
    newobjhash.exportdate =nowdate
  }
  // console.log("nowdate : " + nowdate)
  //load alldata
  // $.postJSON('/api/report/report_customer/report_customer_excel', newobj, function(blob) {
  var headerexcel = `
  <table>
    <thead>
      <tr>
        <th style="text-align:left;font-size:20px;font-weight:700" colspan="5">##excel-orgname##</th>
      </tr>
      <tr>
        <th style="text-align:left;font-size:18px;font-weight:700" colspan="5">##excel-name##</th>
      </tr>
      <tr>
        <th style="text-align:left" colspan="1">Date</th>
        <th style="text-align:left" colspan="3">##excel-date##</th>

      </tr>
      <tr>
        <th style="text-align:left" colspan="1">Date Type</th>
        <th style="text-align:left" colspan="3">##excel-dtype##</th>
      </tr>
      ##excel-filter##
    </thead>
  </table>`
var filter =`<tr>
        <th style="text-align:left" colspan="1">##filter-textfilter##</th>
        <th style="text-align:left" colspan="3">##filter-datafilter##</th>
      </tr>`
var exported = `<table>
<tr>
  <th style="text-align:left" colspan="5">Exported by : ##excel-staffname## , Date : ##excel-exportdate##</th>
</tr></table>
`


  var hashfilter = hash_replace(filter,'filter',arrayfilter)
  // console.log('hashfilter',hashfilter)
  newobjhash.filter = hashfilter
  var hashexcel = hash_replace(headerexcel,'excel',newobjhash)
  var footerexcel = hash_replace(exported,'excel',newobjhash)
  var a = document.createElement('a');
  a.href = 'data:application/octet-stream;charset=UTF-8,' + encodeURIComponent(`<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head>
  <body>${hashexcel}<br>${html}<br>${footerexcel}</body></html>`);
  a.download = newobjhash.filename+'.xls';
  document.body.append(a);
  a.click();
  a.remove();
  fnc()
}

function getobjbyfieldname(obj,value,fieldname,removeit){
  if(!Array.isArray(obj)) return false;
  if(Number(value) > 0){
    if(fieldname){
      for(var x=0;x < obj.length;x++){
        if(obj[x][fieldname] == value) {
          var ans =obj[x];
          if(removeit){
            obj.splice(x,1);
          }
          return ans;
        }
      }
    }else{
      return "fielname is undefined"
    }

  }
}
$.postJSON = function(url, data, callback) {
   var postdata;
    try{
      postdata = JSON.stringify(data);
    }catch(e){
      alert("Invalid Data");
      return false;
    }
    if(!callback){
      return jQuery.ajax({
          'type': 'POST',
          'url': url,
          'contentType': 'application/json',
          'data': postdata,
          'dataType': 'json'
      });
    }
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': postdata,
        'dataType': 'json',
        complete:function(obj){
          if(obj.status == 402){  // Require Log-out , token expired
            console.log("Token Expired")
            window.localStorage.clear();
            window.location = '/';
            return;
          }
          if(obj.responseJSON){
            var newtoken = obj.getResponseHeader('advnewtoken');
          //  console.log("Newtoken ?",newtoken)
            if(newtoken ){ // Renew TOKEN
              ajax_settoken(newtoken);
              if(obj.responseJSON.newtoken && obj.responseJSON.renew){
                //  $.postJSON (url, data, callback) ;
                //  return;
              }


            }
            callback(obj.responseJSON)
          }else  if(obj.responseText){
            callback(obj.responseText)
          }else{
            callback(obj);
          }
        }

    });
};
$.post =$.postJSON ;
$(document).keydown(function(event){
      if(event.which=="17")
          cntrlIsPressed = true;
  });

  $(document).keyup(function(){
      cntrlIsPressed = false;
  });
;
  var cntrlIsPressed = false;
