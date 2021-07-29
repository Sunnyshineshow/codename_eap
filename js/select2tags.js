var main_url_get_tags = '/api-web/v1/tag/search';
var main_url_new_tags = '/api-web/v1/tag/add';
var _temp_obj_for_advtags = {};
var _temp_obj_for_newtage = {};
var _temp_obj_for_tagname = {};

$.fn.adv_tags = function(defualt_data, tagname, allownewtag = false) { // defualt_data Must Be Array
  // Create Tage
  var postdata = {
    tagname: tagname
  };
//  console.log("POSTJSON");
  $.postJSON(main_url_get_tags, postdata, (tag_suggestion) => {
    _temp_obj_for_advtags[this.selector] = tag_suggestion;
    _temp_obj_for_newtage[this.selector] = allownewtag;
    _temp_obj_for_tagname[this.selector] = tagname;
    if (!Array.isArray(defualt_data)) {
      if (typeof(defualt_data) == 'string') {
        if(defualt_data=="alltags"){    // Select ALL tag_suggestion
          defualt_data= tag_suggestion
        }else{
          defualt_data = [defualt_data];
        }

      } else {
        defualt_data = [];
      }

    }
    //console.log("DEFAULT "+tagname,defualt_data)
    var seldata = '';
    if (this.attr('multiple') !== 'multiple') {
      seldata += '<option value="">--select--</option>';
    }
    for (var x = 0; x < tag_suggestion.length; x++) {
      if (defualt_data.length > 0) {
        if (defualt_data.indexOf(tag_suggestion[x]) !== -1) { // Found
          seldata += '<option value="' + tag_suggestion[x] + '" selected >' + tag_suggestion[x] + '</option>';
        } else {
          seldata += '<option value="' + tag_suggestion[x] + '" >' + tag_suggestion[x] + '</option>';
        }
      } else {
        seldata += '<option value="' + tag_suggestion[x] + '" >' + tag_suggestion[x] + '</option>';
      }

    }
    this.html(seldata);

    this.select2({
      tags: true,
      tokenSeparators: [',', ' '],
      allowClear: true,
      createTag: function(params) {
        if (params.term === '') {
          return null;
        }
        if (allownewtag) {
          return {
            id: params.term,
            text: params.term
          };
        }
        return null;

      }
    });


  });
}



$.fn.adv_gettags = function(objdata, tagname, allowaction) {
  var tag_suggestion
  var tag_autocreated
  var adv_tags_name
  if (objdata) {
    tag_suggestion = objdata
  } else {
    tag_suggestion = _temp_obj_for_advtags[this.selector];
  }
  if (allowaction) {
    tag_autocreated = allowaction
  } else {
    tag_autocreated = _temp_obj_for_newtage[this.selector];
  }
  if (tagname) {
    if(tagname == "kiosk"){
      adv_tags_name=""
    }else{
      adv_tags_name = tagname
    }
  } else {
    adv_tags_name = _temp_obj_for_tagname[this.selector]
  }



  var newtag = [];
  var returnobj = this.val();
  // console.log("GET VALUE FROM ", adv_tags_name, tag_autocreated);
  // console.log('data returnobj :', returnobj);
  // console.log('tag_suggestion', tag_suggestion)
  if (Array.isArray(returnobj) && returnobj.length > 0) {
    for (var x = 0; x < returnobj.length; x++) {
      if (tag_suggestion.indexOf(returnobj[x]) == -1) { // Not in Suggestion then
        newtag.push(returnobj[x]);
        tag_suggestion.push(returnobj[x]);
        //   this.append('<option value="' + returnobj[x] + '" >' + returnobj[x] + '</option>');
      }
    }
  } else if (typeof(returnobj) == 'string') {
    newtag = [returnobj];
  }
  // console.log('adv_tags_name', tag_suggestion)
  if (newtag.length > 0) {

    if (tag_autocreated) {
      var postdata = {
        tags: newtag,
        tagname: adv_tags_name
      }
      // console.log("postdata :", postdata)
      $.postJSON(main_url_new_tags, postdata, function(data) {
        // console.log("new tag write", data);
        return returnobj;
      });
    }
  }
  return returnobj;

}




var _temp_advsettingurl;
var _stack_callback_url=[];
$.fn.adv_select = function(setting, fnc,fall) {
  //{url,field_id,field_name,value,maxshow}
  var cached_data = [];
  var jquery_obj = this;

  if (!setting || !setting.url) {
    return console.error("Invalid Setting URL ")
  }
  if (!setting.id) {
    setting.id = '_id';
    //return console.error("Invalid Setting field_id or field_name")
  }
  if (!setting.name) {
    setting.name = 'name';
    //return console.error("Invalid Setting field_id or field_name")
  }
  if (!(setting.maxshow) > 0) {
    setting.maxshow = 50;
  }
  if (setting.val && !setting.value) {
    setting.value = setting.val;
  }
  if( _temp_advsettingurl !=setting.url){
      _temp_advsettingurl=setting.url
      $.get(setting.url,finishurl);
  }else{
    // wait callbackfinish
    _stack_callback_url.push((resmsg)=>{
        finishurl(resmsg);
    });
    return;
  }

  function finishurl(msg) {
    var dataobj = prepredata(msg);
    var seldata = jquery_obj.html().trim();
    if (!seldata) {
      if(fall==true){
        seldata = '<option value disabled>Select...</option>';
      }else{
        seldata = '<option value>Select...</option>';
      }
    }
    if (dataobj && dataobj.length > setting.maxshow) { //Transform to Type Ahead
      var newobjdata = change_data_format(dataobj, setting.value);
      jquery_obj.select2({
        data: newobjdata,
        allowClear: true,
        placeholder: "Select...",
        ajax: {
          delay: 300,
          url: setting.url,
          'contentType': 'application/json',
          processResults: function(data) {
            var searchfound = change_data_format(prepredata(data));
            return {
              results: searchfound
            };
          },
          data: function(params) {
            return {
              q: params.term,
              fieldname:setting.fieldname
            };
          }
        }
      });
      if(!setting.value){
        $(jquery_obj).val(null).trigger('change');
      }
    } else {
      // console.log("CHECK SETTING",setting)
      if(fall==true){
        seldata = '<option value disabled>Select...</option>';
      }else{
        seldata = '<option value>Select...</option>';
      }
      for (var x = 0; x < dataobj.length; x++) {
        var obj = dataobj[x];
        if (obj[setting.name] == setting.value || obj[setting.id] == setting.value) {
          seldata += '<option value="' + obj[setting.id] + '" selected >';
          seldata += obj._template || obj[setting.name] + '</option>';

        } else {
          seldata += '<option value="' + obj[setting.id] + '">';
          seldata += obj._template || obj[setting.name] + '</option>';
        }
      }
      jquery_obj.select2()
      jquery_obj.html(seldata);
    }

    if(_stack_callback_url.length > 0 ){
        for(var x=0;x < _stack_callback_url.length; x++){
            var tempfnc = _stack_callback_url[x];
            _stack_callback_url.splice(0,1);
            x--;
            tempfnc(msg);
        }
    }
    _temp_advsettingurl ='';
  }

  function prepredata(msg) {
    var dataobj = get_data_array(msg);
    if (!Array.isArray(dataobj) || dataobj.length == 0) return [];

    if (typeof(fnc) == 'function') {
      for (var x = 0; x < dataobj.length; x++) {
        fnc(dataobj[x]);
      }
    }

    // Check setting.name
    if (setting.template) {
      var reg = /(\{\{\w*\}\})/g;
      for (var x = 0; x < dataobj.length; x++) {
        dataobj[x]._template = setting.template.replace(reg, function(match) {
          var real_data = match.replace(/(\{\{|\}\})/g, '');
          if (dataobj[x][real_data]) {
            return dataobj[x][real_data];
          } else {
            return '';
          }
        });
      }
    }
    return dataobj;
  }

}

function change_data_format(cleandata, default_val) {
  var data = $.map(cleandata, function(obj) {
    // obj.id = obj._id || obj.id; // replace pk with your identifier
    // obj.text = obj._template || obj.name;
    var newobj = {
      id: obj._id || obj.id
    };
    newobj.text = obj._template || obj.name;
    // console.log("create",newobj)
    if (Number(newobj.id) == Number(default_val)) {
      newobj.selected = true;
    }
    return newobj;
  });
  // console.log(data)
  return data;
}

function get_data_array(msg) {
  if (Array.isArray(msg)) {
    return msg;
  } else if (typeof(msg) == 'object') {
    var keys = Object.keys(msg);
    for (var x = 0; x < keys.length; x++) {
      if (Array.isArray(msg[keys[x]])) {
        return msg[keys[x]];
      }
    }
  }
  return false;
}
