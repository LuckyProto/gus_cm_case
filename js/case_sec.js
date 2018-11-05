window.onload = function () {
    // var json = require('stringify');

    function jsonStringify(param) {
        var result = JSON.stringify(param, null, 4);
        return result;
    }
    /*
    * pro使用if分支，dev使用else分支
    * */
    if(true){
        var qs = location.search.length > 0 ? location.search.substring(1) : '';
        window.emr_main_id = qs.split('&')[0].split('=')[1];
        window.typeId = qs.split('&')[1].split('=')[1];
    }else{
        window.emr_main_id = 582;
        window.typeId = 1;
    }

$.ajax({
    type: "POST",
    url: ajaxUrl + "getEmrValue",
    contentType : "application/x-www-form-urlencoded",
    dataType: 'json',
    data: {
        id: emr_main_id
    },
    success: function(data){
    var items       = data.data.items,
        emrInfo     = data.data.emrInfo,
        treatment   = data.data.treatment,
        other       = data.data.other,
        event       = data.data.event,
        submit_reason = data.data.submit_reason,
        emrBasicInfo = data.data.emrBasicInfo;
    //基本信息
    $('#avatar').attr('src', "http://testimg-1253887111.file.myqcloud.com/" + emrBasicInfo.avatar);
    $('#record_num').val(emrBasicInfo.record_num);
    $('#patient_name').val(emrBasicInfo.patient_name);
    $('#sex').val(emrBasicInfo.sex);
    $('#age').val(emrBasicInfo.age);
    $('#mobile').val(emrBasicInfo.mobile);
    $('#cli_date').val(emrBasicInfo.cli_date);
    $('#cli_add').val(emrBasicInfo.cli_add);
    $('#hospital_name').val(emrBasicInfo.hospital_name);
    $('#doctor_name').val(emrBasicInfo.doctor_name);
    $('#main_doctor_name').val(emrBasicInfo.main_doctor_name);
    //创建病例
    if(items){
        items.forEach(function (value, index, array) {
            new LevelOne($("#app"), value);
        })
    }

    //主诉疾病
    if(emrInfo){
        emrInfo.forEach(function (value, index, array) {
            new EmrInfo($("#main_disease"), value);
        })
    }

    //建议诊疗方案
    if(treatment){
        treatment.itemId = 1999999991;
        treatment.item_type_id = 3;
        new Treatment("#treatment", treatment);
        new Treatment_ImgUpload("#treatment", treatment);
    }else{
        treatment = {
            "emr_main_id": emr_main_id,
            "treat_content": "未填写",
            "img_url": "http://testimg-1253887111.file.myqcloud.com/",
            "img_url_list": [

            ]
        }
        treatment.itemId = 1999999991;
        treatment.item_type_id = 3;
        new Treatment("#treatment", treatment);
        new Treatment_ImgUpload("#treatment", treatment);
    }

    //其它
    var otherCount = 1999999992;
    if(other){
        other.itemId = otherCount;
        other.item_type_id = 2;
        new Other_textarea("#other", other);
        new Other_ImgUpload("#other", other);
    }else{
        other = {
            "emr_main_id": emr_main_id,
            "item_type_id":  2,
            "emr_img_id": '0',
            "other_content": "",
            "img_url": "http://testimg-1253887111.file.myqcloud.com/",
            "img_url_list": [

            ]
        }
        other.itemId = otherCount;
        new Other_textarea("#other", other);
        new Other_ImgUpload("#other", other);
    }

    //重大事件
    if(event){
        event.forEach(function (value, index, array) {
            // event[index].itemId = 1999999993 + index;
            event[index].item_type_id = 4;
            new EventInputTimeForm("#majorEvent", event[index]);  //时间
            new EventSelectForm("#majorEvent", event[index]);
            new eventRemark("#majorEvent", event[index])          //事件说明
            new Event_ImgUpload("#majorEvent", event[index]);     //图片
        })
    }else{
        event = [];
    }

    var newEventCount = 0;
    $('#newEventBtn').click(function () {
        var eventParam = {
            "item_type_id"  : 5,
            "emr_main_id"   : emr_main_id
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_img_value_update",
                param: JSON.stringify(eventParam, 4)
            }),
            success: function (data) {
                if (data.code == 1) {
                    var newEventObj = {};
                    event.push(newEventObj);
                    newEventObj.itemId = newEventCount;
                    newEventObj.img_url = "http://testimg-1253887111.file.myqcloud.com/";
                    newEventObj.item_type_id = 4;
                    newEventObj.emr_main_id = emr_main_id;
                    newEventObj.emr_main_event_id = data.data.emr_main_event_id;
                    newEventObj.event_date = '';
                    newEventObj.event_remark = '';
                    newEventObj.emr_img_id = 0;
                    newEventObj.img_url = "http://testimg-1253887111.file.myqcloud.com/";
                    newEventObj.img_url_list = [];
                    newEventObj.level_1_selected_id = "0";
                    newEventObj.level_1_option_list = [
                        {
                            "option_id": 10,
                            "option_name": "生育"
                        },
                        {
                            "option_id": 13,
                            "option_name": "其他"
                        },
                        {
                            "option_id": 214,
                            "option_name": "产后大出血"
                        },
                        {
                            "option_id": 215,
                            "option_name": "头部手术"
                        },
                        {
                            "option_id": 216,
                            "option_name": "头部外伤"
                        },
                        {
                            "option_id": 217,
                            "option_name": "头部放疗"
                        }
                    ];
                    newEventObj.level_2_option_list = [];
                    newEventObj.level_2_selected_id = "0";
                    newEventCount++;
                    new EventInputTimeForm("#majorEvent", newEventObj);  //时间
                    new EventSelectForm("#majorEvent", newEventObj);
                    new eventRemark("#majorEvent", newEventObj)          //事件说明
                    new Event_ImgUpload("#majorEvent", newEventObj);     //图片
                }
            }
        })

    })
    //状态按钮
    switch (true) {
        case typeId == 0:
            var $submitBtn = $('<button>').text("提交");
            // var $modifyBtn = $('<button id="confirmModifyBtn">').text("确认修改");
            $submitBtn.appendTo($("#statusBtn"));
            // $modifyBtn.appendTo($("#statusBtn"));
            $submitBtn.click(function () {
                $.ajax({
                    type: "POST",
                    url: ajaxUrl + "comm",
                    contentType: "application/json;charset=UTF-8",
                    dataType: 'json',
                    data: JSON.stringify({
                        methodName: "sp_cm_emr_submit",
                        param: JSON.stringify({"emr_main_id": emr_main_id})
                    }),
                    success: function (data) {
                        if (data.code == 0) {
                            alert('此病例成功标记为提交');
                        }
                    }
                })
            })
            break;
        case typeId == 1:
        case typeId == 3:
            var $passBtn = $('<button>').text("通过");
            var $modifyBtn = $('<button id="confirmModifyBtn">').text("确认修改");
            var $resion = $('<textarea placeholder="请输入未通过理由" id="resion">').val(submit_reason);
            var $tel = $('<input type="text" placeholder="请输入手机号" id="tel">').val(data.data.mobile);
            var $notPassBtn = $('<button class="notPassBtn">').text("未通过");
            $passBtn.appendTo($("#statusBtn"));
            $modifyBtn.appendTo($("#statusBtn"));
            $notPassBtn.appendTo($("#statusBtn"));
            $tel.appendTo($("#statusBtn"));
            $resion.appendTo($("#statusBtn"));

            //通过
            $passBtn.click(function () {
                if(confirm('确认通过审核吗')){
                    $.ajax({
                        type: "POST",
                        url: ajaxUrl + "comm",
                        contentType: "application/json;charset=UTF-8",
                        dataType: 'json',
                        data: JSON.stringify({
                            methodName: "sp_cm_emr_pass",
                            param: JSON.stringify({"emr_main_id": emr_main_id})
                        }),
                        success: function (data) {
                            if (data.code == 0) {
                                alert('此病例成功标记为通过');
                            }
                        }
                    })
                }
            })

            //未通过
            $notPassBtn.click(function () {
                var mobile = $("#tel").val(),
                    beforeStr = "尊敬的用户，您提交的健康档案因",
                    afterStr = "审核未通过，请更改后重新提交。",
                    originalReason = $("#resion").val(),
                    content = beforeStr + $("#resion").val() + afterStr;
                if(confirm("是否告知患者病例未通过")){
                    $.ajax({
                        type: "POST",
                        // url: "https://gppro.gusmedsci.cn/guservice/sendMobileMess",
                        url: ajaxUrl + "sendMobileMess",
                        // url: "http://pro.gusskids.cn/guservice/sendMobileMess",
                        contentType: "application/json;charset=UTF-8",
                        dataType: 'json',
                        data: JSON.stringify({
                            mobile: mobile,
                            content: content
                        }),
                        success: function (data) {
                            if (data.code == 0) {
                                alert('发送成功');
                                //JSON序列化
                                var unpassParam = jsonStringify({'emr_main_id': emr_main_id, 'originalReason': originalReason});
                                $.ajax({
                                    type: "POST",
                                    url: ajaxUrl + "comm",
                                    contentType: "application/json;charset=UTF-8",
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        methodName: "sp_cm_emr_unpass",
                                        param: unpassParam
                                    }),
                                    success: function (data) {
                                        if (data.code == 0) {
                                            alert('此病例成功标记为未通过');
                                            window.location.reload()
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
            break;
        case typeId == 2:
            var $modifyBtn = $('<button id="confirmModifyBtn">').text("确认修改");
            $modifyBtn.appendTo($("#statusBtn"));
            break;
        case typeId == 4:
            break;
        case typeId == 5:
            break;
    }

    // var $uploadBtn = $('#uploadBtn');
    // $uploadBtn.click(function (e) {
    //     var cos = new COS({
    //         SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
    //         SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
    //     })
    //     var fileInput = document.getElementById('fileInput'),
    //         files = fileInput.files,
    //         filesLen = files.length;
    //     var imgArr = [];
    //     if(files){
    //         for(var i = 0; i < filesLen; i++ ) {
    //             cos.putObject({
    //                 Bucket: 'testimg-1253887111',
    //                 Region: 'ap-beijing-1',
    //                 Key: files[i].name,
    //                 StorageClass: 'STANDARD',
    //                 Body: files[i], // 上传文件对象
    //             }, function(err, data) {
    //                 imgArr.push(data.Location.substring(56));
    //             });
    //         }
    //
    //         setTimeout(function () {
    //             var imgStr = imgArr.join();
    //             var filesObj = {
    //                 "emr_main_id": emr_main_id,
    //                 "items" : [
    //                     {
    //                         itemId: window.itemId_btn_imgUpload,
    //                         itemValue: imgStr
    //                     }
    //                 ]
    //             }
    //
    //             $.ajax({
    //                 type: "POST",
    //                 url: ajaxUrl + "comm",
    //                 contentType: "application/json;charset=UTF-8",
    //                 dataType: 'json',
    //                 data: JSON.stringify({
    //                     methodName: "sp_cm_emr_value_update",
    //                     param: JSON.stringify(filesObj)
    //                 }),
    //                 success: function (data) {
    //                     if (data.code == 0) {
    //                         alert('修改成功');
    //                         fileInput.value = null;
    //                         console.log(fileInput.files)
    //                     }
    //                 }
    //             })
    //         }, 5000)
    //     }
    // })


    $('#confirmModifyBtn').click(function () {
        if (confirm('是否确认修改?')) {
            var forms = document.forms,
                formsLen = forms.length,
                cases = [];
            for (var k = 0; k < formsLen; k++) {
                items_form = serialize(forms[k])
                if (items_form.length) {
                    cases = cases.concat(items_form)
                }
            }
            var caseObj = {};

            //过滤重复的item
            var re = unique(cases);
            caseObj.emr_main_id = emr_main_id;
            caseObj.items = re;

            caseObj.other = {};
            caseObj.treatment = {};
            caseObj.event = [];

            //主诉疾病
            if(emrInfo){
                caseObj.emrInfo = emrInfo;
            }

            //其它
            if(other){
                caseObj.other.emr_main_id = other.emr_main_id;
                // caseObj.other.img_url = other.img_url;
                // caseObj.other.emr_img_id = other.emr_img_id;
                caseObj.other.other_content = $("#other_textarea").val();
                // caseObj.other.img_url_list = storage.getItem(other.itemId);
            }

            //建议诊疗方案
            if(treatment){
                caseObj.treatment.emr_main_id = treatment.emr_main_id;
                // caseObj.treatment.img_url = treatment.img_url;
                var treatment_content = [];
                $(".treatment_textarea").each(function (index) {
                    treatment_content.push($(this).val())
                })
                caseObj.treatment.treatment_content = treatment_content;
                // caseObj.treatment.img_url_list = storage.getItem(treatment.itemId);
            }
            //重大事件
            if(event){
                event.forEach(function (value, index, array) {
                    caseObj.event[index] = {};
                    caseObj.event[index].emr_main_id = event[index].emr_main_id;
                    // caseObj.event[index].img_url = event[index].img_url;
                    // caseObj.event[index].emr_img_id = event[index].emr_img_id;
                    caseObj.event[index].emr_main_event_id = event[index].emr_main_event_id;
                    caseObj.event[index].event_date = $('#' + event[index].itemId).val();
                    caseObj.event[index].event_remark = $('.event_textarea').eq(index).val();
                    caseObj.event[index].level_1_selected_id = $('.levelOne_select').eq(index).val();
                    caseObj.event[index].level_2_selected_id = $('.levelTwo_select').eq(index).val();
                    // caseObj.event[index].img_url_list = storage.getItem(event[index].itemId) ? storage.getItem(event[index].itemId) : null;
                })
            }

            caseObj.resion = $('#resion').val();
            $.ajax({
                type: "POST",
                url: ajaxUrl + "comm",
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify({
                    methodName: "sp_cm_emr_value_update",
                    param: JSON.stringify(caseObj)
                }),
                success: function (data) {
                    if (data.code == 0) {
                        alert('修改成功');
                    }
                }
            })
        }
    })
    }
})
}

//绑定beforeunload事件
// window.onbeforeunload = function(event) {
//     return confirm("确定退出吗");
// }

window.onunload = function(){
    localStorage.clear();
    sessionStorage.clear();
};




