
var qs = location.search.length > 0 ? location.search.substring(1) : '',
    emr_main_id = qs.split('=')[1],
    // emr_main_id = 198,
    casesData = '';
    window.localStorage.setItem('emr_main_id', emr_main_id);
    window.onunload = function(){
    localStorage.clear();
};
// function toImgcheck($dom){
//     var itemId = $dom.attr('itemId');
//     var value = $dom.attr('value').split(',');
//     var url = '';
//     var param = [];
//     for(var i = 0; i < value.length; i++){
//         param[i] = 'param' + i + '=' + value[i] + '&';
//         url += param[i];
//     }
//     url = url.substring(0, url.length - 1);
    // window.open('checkImg.html?' + url);
    // window.open('checkImg.html?');
// }

$.ajax({
     type: "POST",
     url: ajaxUrl + "getEmrValue",
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
             $("#case_lev1 li").eq(0).css({'background': '#5CC9F5'});
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
             $("#modal").modal('show');
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
                                     new SelectForm($li3, value3);
                                     $li3.appendTo($ul);
                                 }else if(value3.itemTypeId == 7){
                                     var $li3 = $("<li>");
                                     new createTitle($li3, value3);
                                     new inputRadiosForm($li3, value3);
                                     $li3.appendTo($ul);
                                 }else if(value3.itemTypeId == 3){
                                     var $li3 = $("<li>");
                                     new itemType_six($li3, value3);
                                     $li3.appendTo($ul);
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
                                         new itemType_six($li3, value3);
                                         $li3.appendTo($ul);
                                         break;
                                     case value3.itemTypeId == 8:
                                         var $li3 = $("<li>");
                                         new createTitle($li3, value3);
                                         new TextForm($li3, value3);
                                         $li3.appendTo($ul);
                                         break;
                                     case value3.itemTypeId == 10:
                                         var $li3 = $("<li>");
                                         if(value3.itemValues && value3.itemValues[0] != null){
                                             window.sessionStorage.setItem(value3.itemId,  value3.itemValues.join(','));
                                             new ImgUpload($li3, value3);
                                         }else{
                                             var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                                             $btn.appendTo($li3);
                                         }
                                         $li3.appendTo($ul);
                                         break;
                                     case value3.itemTypeId == 11:
                                         var $li3 = $("<li>");
                                         new createTitle($li3, value3);
                                         new InputTimeForm($li3, value3);
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
                             new TextareaForm(xxlis[index2], value2)
                             break;
                         case value2.itemTypeId == 8:
                             new TextForm(xxlis[index2], value2);
                             break;
                         case value2.itemTypeId == 10:
                             if(value2.itemValues && value2.itemValues[0] != null){
                                 window.sessionStorage.setItem(value2.itemId,  value2.itemValues.join(','));
                                 new ImgUpload(xxlis[index2], value2);
                             }else{
                                 var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                                 $btn.appendTo(xxlis[index2]);
                             }
                             // if(value2.itemValue){
                             //     //window.sessionStorage.setItem(value2.itemId,  value2.itemValue.join(','));
                             //     var $ul = $("<ul>");
                             //     $ul.appendTo($xx);
                             //
                             //     var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                             //     var $btn_checkImg = $('<a href="javascript:void(0)" onclick="toImgcheck($(this))">').text('查看大图').attr({'itemid': value2.itemId, 'value': value2.itemValue}).css({'margin-left': '30%', 'margin-right': '4%'});
                             //     $btn_checkImg.appendTo(xxlis[index2]);
                             //     $btn.appendTo(xxlis[index2]);
                             //
                             //     var $imgWarp = $('<div>');
                             //
                             //     var $ul = $('<ul>').css({'position': 'relative', 'height': '175px'});
                             //     for(var k = 0; k < value2.itemValue.length; k++){
                             //         $li = $('<li>').css({'position': 'absolute', 'left': '0', 'top': '0'});
                             //         if(value2.itemValue[k] != null){
                             //             var $img = $("<img class='img_left'>").attr('src', qcloadUrl + value2.itemValue[k]).css({
                             //                 'height': '150px',
                             //                 'width': '100%',
                             //                 'margin-bottom': '10px'
                             //             });
                             //         }
                             //         // if(value2.itemValue[k] != null){
                             //         //     var $img = $("<img class='img_left'>").attr({'src': qcloadUrl + value2.itemValue[k]}).css({'height': '150px','width': '100%',  'margin-bottom': '10px'});
                             //         // }
                             //         $li.append($img);
                             //         $ul.append($li)
                             //     }
                             //
                             //     $imgWarp.append($ul)
                             //     $imgWarp.appendTo(xxlis[index2]);
                             //     var idx_img = 0;
                             //     var timer_img = '';
                             //
                             //     $imgWrap_ul = (function(){
                             //         var ul = '';
                             //         $('.img_left').each(function(){
                             //             ul = $(this).parent().parent();
                             //         })
                             //         return ul;
                             //     })()
                             //
                             //     timer_img = setInterval(function () {
                             //
                             //         if(idx_img >= $('.img_left').length){
                             //             idx_img = 0;
                             //         }
                             //         $('.img_left').eq(idx_img).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
                             //         idx_img++;
                             //     }, 2000)
                             // }else{
                             //     var $ul = $("<ul>");
                             //     $ul.appendTo($xx);
                             //     var $btn = $('<button class="btn_imgUpload">').text('点击上传图片').attr({'itemid': value2.itemId});
                             //     $btn.appendTo(xxlis[index2]);
                             // }
                             break;
                         default:
                             break;
                     }
                     break;
             }
         }
         //模态框的事件
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
                 var forms = document.forms,
                     formsLen = forms.length,
                     cases = [];
                 for(var k = 0; k < formsLen; k++){
                     items_form = serialize(forms[k])
                     if(items_form.length){
                         cases = cases.concat(items_form)
                     }
                 }
                 var caseObj = {};
                 //获取本地存储中的数据
                 var storage = window.sessionStorage;
                 for(var i = storage.length - 1; i>=0; i--){
                     var imgObj = {};
                     var key = storage.key(i),
                         valueStr = storage.getItem(key);
                     if(valueStr != ""){
                         imgObj.itemId = key;
                         imgObj.itemValue = valueStr;
                         cases.push(imgObj);
                     }
                 }

                 //过滤重复的item
                 var re = unique(cases);
                 caseObj.emr_main_id = emr_main_id;
                 caseObj.items = re;
                 console.log(caseObj)
                 $.ajax({
                     type: "POST",
                     url: ajaxUrl + "comm",
                     contentType : "application/json;charset=UTF-8",
                     dataType: 'json',
                     data: JSON.stringify({
                         methodName: "sp_cm_emr_value_update",
                         param: JSON.stringify(caseObj)
                     }),
                     success: function(data){
                         if(data.code == 0){
                             alert('修改成功');
                             localStorage.clear();
                         }
                     }
                 })
             }
         })
     }
})






