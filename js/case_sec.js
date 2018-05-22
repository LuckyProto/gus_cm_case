

var qs = location.search.length > 0 ? location.search.substring(1) : '',
    emr_main_id = qs.split('=')[1],
    emr_main_id = 198,
    casesData = '',
    qcloadUrl = 'http://testimg-1253887111.file.myqcloud.com/';
window.localStorage.setItem('emr_main_id', emr_main_id);
window.onunload = function(){
    localStorage.clear();
};
function toImgcheck($dom){
    var itemId = $dom.attr('itemId');
    var value = $dom.attr('value').split(',');
    var url = '';
    var param = [];
    for(var i = 0; i < value.length; i++){
        param[i] = 'param' + i + '=' + value[i] + '&';
        url += param[i];
    }
    url = url.substring(0, url.length - 1);
    window.open('checkImg.html?' + url);
    // window.open('checkImg.html?');
}

$.ajax({
     type: "POST",
     url: "http://172.16.2.131:8089/guservice/getEmrValue",
     contentType : "application/x-www-form-urlencoded",
     dataType: 'json',
     data: {
         id: emr_main_id
     },
     success: function(data){
         casesData = data.data.items;
         //数据
         var beforeCase    = casesData[0].childNodes,
             nowCase       = casesData[1].childNodes,
             physicaSign   = casesData[2].childNodes,
             laboratory    = casesData[3].childNodes,
             assistCheck   = casesData[4].childNodes;
         //lev1标题
         var case_lev1 = [];
         casesData.forEach(function (value, index, array) {
             case_lev1.push(value.itemName);
         })

         create_$dom(case_lev1, $("#case_lev1"), 'li');
         $(window).ready(function(){
             $("#case_lev1 li").eq(0).css({'background': '#5CC9F5', 'color':'#fff'});
         });
        //lev1点击事件
         $("#case_lev1").delegate('li', 'click', function () {
             var idx = $("#case_lev1>li").index($(this));
             $(this).css({'background': '#5CC9F5', 'color':'#fff'}).siblings().css({'background': '#fff', 'color':'#888'})
             $("#wrap_lev2>div").eq(idx).css({'display':'block'}).siblings().css({'display': 'none'});
         })
        //是否选中标志
         var tag = false;
        //既往史lev2
         var lev2_beforeCaseTitleUl = [];
         beforeCase.forEach(function (value, index, array) {
             lev2_beforeCaseTitleUl.push(value.itemName);
         })
         create_$dom(lev2_beforeCaseTitleUl, $("#beforeCaseTitleUl"), 'li')

         //既往史lev3
         var beforecaseLis = $("#beforeCaseTitleUl li");
         var $beforeCase = $("#beforeCase");
         beforeCase.forEach(function(value2, index2, array2){
             createCase(value2, index2, array2, beforecaseLis, $beforeCase);
         })

         //病症lev2
         var lev2_nowCaseTitleUl = [];
         nowCase.forEach(function (value, index, array) {
             lev2_nowCaseTitleUl.push(value.itemName);
         })
         create_$dom(lev2_nowCaseTitleUl, $("#nowCaseTitleUl"), 'li')

         //病症lev3
         var nowCaseLis = $("#nowCaseTitleUl li");
         var $nowCase = $("#nowCase");
         nowCase.forEach(function(value2, index2, array2){
             createCase (value2, index2, array2, nowCaseLis, $nowCase)
         })

         //体征lev2
         var lev2_physicaSignTitleUl = [];
         physicaSign.forEach(function (value, index, array) {
             lev2_physicaSignTitleUl.push(value.itemName);
         })
         create_$dom(lev2_physicaSignTitleUl, $("#physicaSignTitleUl"), 'li')

         //lev3
         var physicaSignLis = $("#physicaSignTitleUl li");
         var $physicaSign = $("#physicaSign");
         physicaSign.forEach(function(value2, index2, array2){
             createCase (value2, index2, array2, physicaSignLis, $physicaSign)
         })

         //化验lev2
         var lev2_laboratoryCaseTitleUl = [];
         laboratory.forEach(function (value, index, array) {
             lev2_laboratoryCaseTitleUl.push(value.itemName);
         })
         create_$dom(lev2_laboratoryCaseTitleUl, $("#laboratoryTitleUl"), 'li')

         //lev3
         var laboratoryLis = $("#laboratoryTitleUl li");
         var $laboratory = $("#laboratory");
         laboratory.forEach(function(value2, index2, array2){
             createCase (value2, index2, array2, laboratoryLis, $laboratory)
         })

        //辅助检查lev2
         var lev2_assistCheckTitleUl = [];
         assistCheck.forEach(function (value, index, array) {
             lev2_assistCheckTitleUl.push(value.itemName);
         })
         create_$dom(lev2_assistCheckTitleUl, $("#assistCheckTitleUl"), 'li')

         //lev3
         var assistCheckLis = $("#assistCheckTitleUl li");
         var $assistCheck = $("#assistCheck");
         assistCheck.forEach(function(value2, index2, array2){
             createCase (value2, index2, array2, assistCheckLis, $assistCheck)
         })

         //上传图片对话框
         var caseImag = [];
         $('.btn_imgUpload').click(function(){
             window.itemId_btn_imgUpload = $(this).attr('itemid');
         })




         function createCase (value2, index2, array2, xxlis, $xx) {
             switch (true){
                 case value2.childNodes.length > 0:
                     var $ul = $("<ul>");
                     value2.childNodes.forEach(function (value3, index3, array3) {
                         switch (true){
                             case value3.childNodes.length != 0:
                                 break;
                             case value3.options.length != 0:
                                 if(value3.itemTypeId == 4){
                                     var $li3 = $("<li>");
                                     new createTitle($li3, value3);
                                     new inputCheckboxForm($li3, value3);
                                     $li3.appendTo($ul);
                                 }else if(value3.itemTypeId == 9){
                                     var $li3 = $("<li>");
                                     new createTitle($li3, value3);
                                     new inputCheckboxForm($li3, value3);
                                     $li3.appendTo($ul);
                                 }else if(value3.itemTypeId == 7 || value3.itemTypeId == 3){
                                     var $li3 = $("<li>");

                                     var $span = $("<span>").text(value3.itemName);
                                     $span.prependTo($li3);

                                     $li3.appendTo($ul);

                                     var $form = $("<form>");

                                     value3.options.forEach(function (value4, index4, array3) {
                                         var $label = $("<label>").text(value4.optionName);
                                         var $inputRadio = $("<input type='radio' name=value3.itemId>").attr({optionid: value4.optionId, itemid: value3.itemId});
                                         if($inputRadio.attr("optionid") == value3.itemValue){
                                             $inputRadio.attr({'checked': 'checked'});
                                         }
                                         $inputRadio.prependTo($label);

                                         $label.appendTo($form);
                                     })
                                     $form.appendTo($li3)
                                 }
                                 break;
                             case value3.options.length == 0 && value3.childNodes.length == 0:
                                 switch (true){
                                     case value3.itemTypeId == 2:
                                         var $li3 = $("<li>");
                                         new createTitle($li3, value3);
                                         new TextareaForm($li3, value3)
                                         $li3.appendTo($ul);
                                         break;
                                     case value3.itemTypeId == 6:
                                         var $li3 = $("<li>");

                                         var $label = $("<label>").text(value3.itemName);
                                         $label.appendTo($li3);
                                         var $inputRadio = $("<input type='radio'>").val(value3.itemName);
                                         $inputRadio.prependTo($label);

                                         $li3.appendTo($ul);

                                         var displayStartValue = value3.displayStartValue ? value3.displayStartValue : 0;
                                         var $inputText = $("<input>").attr({itemid: value3.itemId, parentid: value3.parentId, displayStartValue:displayStartValue});
                                         if(value3.itemValue){
                                             $inputText.val(value3.itemValue);
                                             $inputRadio.attr('checked', 'checked')
                                             tag = true;
                                         }
                                         $inputText.appendTo($li3);
                                         var $span = $("<span>").text(value3.itemUnit);
                                         $span.appendTo($li3);

                                         break;
                                     case value3.itemTypeId == 8:
                                         var $li3 = $("<li>");

                                         var $p = $("<p>");
                                         var $span = $("<span>").text(value3.itemName).attr({itemid: value3.itemId});
                                         $span.appendTo($p);
                                         $p.appendTo($li3);

                                         var $input = $("<input type='text'>").val(value3.itemValue).attr({itemid: value3.itemId});
                                         $input.appendTo($li3);
                                         var $span = $("<span>").text(value3.itemUnit ? value3.itemUnit : "未知");
                                         $span.appendTo($li3);

                                         $li3.appendTo($ul);
                                         break;
                                     case value3.itemTypeId == 10:
                                         try{
                                             if(value3.itemValue != null){
                                                 window.sessionStorage.setItem(value3.itemId,  value3.itemValue.join(','));
                                             }
                                         }catch(error){
                                             console.log("图片地址不是一个数组")
                                         }

                                         var $li3 = $("<li>");

                                         if(value3.itemValue){
                                             var $btn_checkImg = $('<a href="javascript:void(0)" onclick="toImgcheck($(this))">').text('查看大图').attr({'itemid': value3.itemId, 'value': value3.itemValue}).css({'margin-left': '30%', 'margin-right': '4%'});
                                             var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value3.itemId});
                                             $li3.append($btn_checkImg)
                                             $li3.append($btn)


                                             var $imgWarp = $('<div>');
                                             var $ul_imgWrap = $('<ul>').css({'position': 'relative', 'height': '175px'});

                                             if(value3.itemValue.length >= 1 && value3.itemValue != "") {
                                                 for (var j = 0; j < value3.itemValue.length; j++) {
                                                     $li = $('<li>').css({
                                                         'position': 'absolute',
                                                         'left': '0',
                                                         'top': '0'
                                                     });
                                                     if(value3.itemValue[0][j] != null){
                                                         var $img = $("<img class='img_right'>").attr('src', qcloadUrl + value3.itemValue[j]).css({
                                                             'height': '150px',
                                                             'width': '100%',
                                                             'margin-bottom': '10px'
                                                         });
                                                     }
                                                     $li.append($img);
                                                     $ul_imgWrap.append($li)
                                                 }
                                             }
                                             $ul_imgWrap.appendTo($imgWarp);
                                             $imgWarp.appendTo($li3);

                                             var idx_rightImg = 0;
                                             timer_rightImg = setInterval(function () {

                                                 if(idx_rightImg >= $('.img_right').length){
                                                     idx_rightImg = 0;
                                                 }
                                                 $('.img_right').eq(idx_rightImg).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
                                                 idx_rightImg++;
                                             }, 2000)

                                         }else{
                                             var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value3.itemId});
                                             $btn.appendTo($li3);
                                         }

                                         $li3.appendTo($ul);

                                         break;
                                     case value3.itemTypeId == 11:
                                         var $li3 = $("<li>");

                                         var $p = $("<p>");
                                         var $span = $("<span>").text('检查时间');
                                         $span.appendTo($p);
                                         $p.appendTo($li3);

                                         var $input = $("<input type='text' class='datepicker' />").val(value3.itemtime).attr({itemid: value3.itemId});
                                         $input.appendTo($li3);
                                         $li3.appendTo($ul);
                                         break;
                                     default:
                                         break;
                                 }
                                 break;
                             default:
                                 break;
                         }
                     })
                     $ul.appendTo($xx);
                     break;
                 case value2.options.length > 0:
                     new inputRadiosForm(xxlis[index2], value2)
                     break;
                 default:
                     switch (true){
                         case value2.itemTypeId == 2:
                             var $ul = $("<ul>");
                             $ul.appendTo($xx);
                             var $p = $("<p>");
                             var $textarea = $("<textarea type='textarea'>").val(value2.itemValue == "" ? "" : value2.itemValue).attr({itemid: value2.itemId});
                             $textarea.appendTo($p);
                             $p.appendTo(xxlis[index2]);
                             break;
                         case value2.itemTypeId == 8:
                             new TextForm(xxlis[index2], value2);
                             break;
                         case value2.itemTypeId == 10:
                             if(value2.itemValue != null){
                                 window.sessionStorage.setItem(value2.itemId,  value2.itemValue.join(','));
                             }
                             if(value2.itemValue){

                                 var $ul = $("<ul>");
                                 $ul.appendTo($xx);

                                 var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                                 var $btn_checkImg = $('<a href="javascript:void(0)" onclick="toImgcheck($(this))">').text('查看大图').attr({'itemid': value2.itemId, 'value': value2.itemValue}).css({'margin-left': '30%', 'margin-right': '4%'});
                                 $btn_checkImg.appendTo(xxlis[index2]);
                                 $btn.appendTo(xxlis[index2]);

                                 var $imgWarp = $('<div>');

                                 var $ul = $('<ul>').css({'position': 'relative', 'height': '175px'});
                                 for(var k = 0; k < value2.itemValue.length; k++){
                                     $li = $('<li>').css({'position': 'absolute', 'left': '0', 'top': '0'});
                                     if(value2.itemValue[k] != null){
                                         var $img = $("<img class='img_left'>").attr('src', qcloadUrl + value2.itemValue[k]).css({
                                             'height': '150px',
                                             'width': '100%',
                                             'margin-bottom': '10px'
                                         });
                                     }
                                     // if(value2.itemValue[k] != null){
                                     //     var $img = $("<img class='img_left'>").attr({'src': qcloadUrl + value2.itemValue[k]}).css({'height': '150px','width': '100%',  'margin-bottom': '10px'});
                                     // }
                                     $li.append($img);
                                     $ul.append($li)
                                 }

                                 $imgWarp.append($ul)
                                 $imgWarp.appendTo(xxlis[index2]);
                                 var idx_img = 0;
                                 var timer_img = '';

                                 $imgWrap_ul = (function(){
                                     var ul = '';
                                     $('.img_left').each(function(){
                                         ul = $(this).parent().parent();
                                     })
                                     return ul;
                                 })()

                                 timer_img = setInterval(function () {

                                     if(idx_img >= $('.img_left').length){
                                         idx_img = 0;
                                     }
                                     $('.img_left').eq(idx_img).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
                                     idx_img++;
                                 }, 2000)

                                 // $imgWrap_ul.delegate('li', 'mouseover', function(){
                                 //     $(this).css({'cursor': 'pointer'});
                                 // })

                             }else{
                                 var $ul = $("<ul>");
                                 $ul.appendTo($xx);
                                 var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                                 $btn.appendTo(xxlis[index2]);
                             }
                             break;
                         default:
                             break;
                     }
                     break;
             }
         }


        //显示上传图片模态框
         $('.btn_imgUpload').click(function(){
             $("#modal").modal('show');
         })
         $('#modal').on('show.bs.modal', function (e) {
             var $img_choose = $("<div id='demo' class='demo'></div>");
             $("#modal-body").append($img_choose).css({'height': 'auto'});
             $("#demo").zyUpload({
                 width: "auto",                 // 宽度
                 height: "400px",                 // 宽度
                 itemWidth: "100px",                 // 文件项的宽度
                 itemHeight: "80px",                 // 文件项的高度
                 url: "fileUploadAction!execute",  // 上传文件的路径
                 multiple: true,                    // 是否可以多个文件上传
                 dragDrop: true,                    // 是否可以拖动上传文件
                 del: true,                    // 是否可以删除文件
                 finishDel: false			  // 是否在上传文件完成后删除预览
             });
         })

         $('#modal').on('hidden.bs.modal', function (e) {
             $("#modal-body").find($('#demo')).remove();
         })


         //日历初始化
         $('.datepicker').datepicker({language: 'zh-CN'});

         /*lev2点击显示lev3*/
         $("#beforeCaseTitleUl").delegate('li', 'click', function () {
             var idx = $('#beforeCaseTitleUl>li').index($(this));
             $(this).css({'background': '#61CAF3'}).siblings().css({'background': '#fff'});
             $('#beforeCase>ul').eq(idx).css('display', 'block').siblings("ul").css('display', 'none')
         })
         $("#nowCaseTitleUl").delegate('li', 'click', function () {
             var idx = $('#nowCaseTitleUl>li').index($(this));
             $(this).css({'background': '#61CAF3'}).siblings().css({'background': '#fff'});
             $('#nowCase>ul').eq(idx).css('display', 'block').siblings("ul").css('display', 'none')
         })
         $("#laboratoryTitleUl").delegate('li', 'click', function () {
             var idx = $('#laboratoryTitleUl>li').index($(this));
             $(this).css({'background': '#61CAF3'}).siblings().css({'background': '#fff'});
             $('#laboratory>ul').eq(idx).css({'display': 'block'}).siblings("ul").css('display', 'none')
         })
         $("#assistCheckTitleUl").delegate('li', 'click', function () {
             var idx = $('#assistCheckTitleUl>li').index($(this));
             $(this).css({'background': '#61CAF3'}).siblings().css({'background': '#fff'});
             $('#assistCheck>ul').eq(idx).css({'display': 'block'}).siblings("ul").css('display', 'none')
         })

         /*lev3点击选中与不选中*/
         $("#beforeCase>ul>li").delegate('input', 'click', function () {
             var inputTextValue = $(this).parent().next('input').attr('displayStartValue');
             tag = !tag;
             if(!tag){
                 $(this).prop('checked', tag).attr('checked', tag);
                 $(this).parent().next('input').val(" ");
             }else{
                 $(this).prop('checked', tag).attr('checked', tag);
                 $(this).parent().next('input').val(inputTextValue);
             }
         })

         /*lev2左侧单选按钮组点击选中与不选中*/
         $("#beforeCaseTitleUl>li, #nowCase>ul>li, #physicaSignTitleUl>li, #assistCheck>ul>li").delegate('input', 'click', function () {
             if(!$(this).attr('checked')){
                 $(this).attr('checked', true).parent().siblings().children('input').attr('checked', false);
             }else{
                 return;
             }
         })


         $('#beforeCaseBtn, #nowCaseBtn, #physicaSignBtn, #laboratoryBtn, #assistCheckBtn').click(function () {
             if(confirm('是否确认修改?')){
                 var caseObj = {};
                 var cases = [];
                 //获取本地存储中的数据
                 var storage = window.sessionStorage;
                 for(var i = storage.length - 1; i>=0; i--){
                     var imgObj = {};
                     var key = storage.key(i),
                         valueStr = storage.getItem(key);
                     if(valueStr != ""){
                         imgObj.itemId = key;
                         imgObj.itemValue = valueStr.split(',');
                     }
                     cases.push(imgObj);
                 }

                 $('*').each(function () {
                     var caseItem = {};
                     if($(this).attr('type') == 'radio'){
                         if($(this).attr('checked') == 'checked'){
                             if($(this).attr('itemid')){
                                 caseItem.itemId   = $(this).attr('itemid');
                             }else{
                                 caseItem.itemId   = $(this).parent().next().attr('itemid');
                             }
                             if($(this).attr('optionid')){
                                 caseItem.itemValue   = $(this).attr('optionid');
                             }else{
                                 caseItem.itemValue = $(this).parent().next().val();
                             }

                             cases.push(caseItem)
                         }
                     }else if($(this).attr('type') == 'checkbox'){
                         if($(this).attr('checked') == 'checked'){
                             caseItem.itemId = $(this).attr('itemid');
                             caseItem.itemValue = [];
                             caseItem.itemValue.push($(this).attr('optionId'))
                             cases.push(caseItem)
                         }
                     }else if($(this).attr('type') == 'text'){
                         if($(this).val()){
                             caseItem.itemId   = $(this).attr('itemid');
                             caseItem.itemValue = $(this).val();
                             cases.push(caseItem)
                         }
                     }else if($(this).attr('type') == 'textarea'){
                         if($(this).val()){
                             caseItem.itemId   = $(this).attr('itemid');
                             caseItem.itemValue = $(this).val();
                             cases.push(caseItem)
                         }
                     }else if($(this).attr('type') == 'file'){
                         if($(this).val()){
                             caseItem.itemId   = $(this).attr('itemid');
                             caseItem.itemValue = $(this).attr('value');
                             cases.push(caseItem)
                         }
                     }
                 })
                 // if(caseImg){
                 //     cases = cases.concat(caseImg)
                 // }

                 //过滤重复的item
                 var re = unique(cases);
                 caseObj.emr_main_id = emr_main_id;
                 caseObj.items = re;
                 console.log(caseObj)
                 $.ajax({
                     type: "POST",
                     url: "http://172.16.2.131:8089/guservice/comm",
                     contentType : "application/json;charset=UTF-8",
                     dataType: 'json',
                     data: JSON.stringify({
                         methodName: "sp_cm_emr_value_update",
                         param: JSON.stringify(caseObj)
                     }),
                     success: function(data){
                         if(data.code == 0){
                             alert('修改成功')
                             localStorage.clear();
                         }
                     }
                 })
             }
         })
     }
})






