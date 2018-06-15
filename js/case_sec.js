
var qs = location.search.length > 0 ? location.search.substring(1) : '',
    emr_main_id = qs.split('&')[0].split('=')[1];
    typeId = qs.split('&')[1].split('=')[1];
    // typeId = 1;
window.sessionStorage.setItem('emr_main_id', emr_main_id);
window.onunload = function(){
    localStorage.clear();
    sessionStorage.clear();
};

//模拟后台
// Mock.mock('http://api.com', {
//     "items|5": [{
//         "level":1,
//         'itemId|+1':1,
//         'parentId': 0,
//         'itemName': '@cname',   //中文名称
//         "itemTypeId":1,
//         'itemValue': '',
//         "itemUnit":null,
//         "childNodes|1-10":[
//             {
//                 'itemId|+1':6,
//                 'itemName': '@cname',   //中文名称
//                 "itemTypeId":2,
//                 'parentId': 1
//             }
//         ],
//         'age|1-100': 100,   //100以内随机整数
//         'birthday': '@date("yyyy-MM-dd")',  //日期
//         'city': '@city(true)'   //中国城市
//     }]
// });


$.ajax({
    type: "POST",
    // url: 'http://api.com',
    url: ajaxUrl + "getEmrValue",
    contentType : "application/x-www-form-urlencoded",
    dataType: 'json',
    data: {
        id: emr_main_id
    },
    success: function(data){
        casesData = data.items;
        //创建病例
        casesData.forEach(function (value, index, array) {
            new LevelOne($("#app"), value);
        })
        // 状态按钮
        switch (true){
            case typeId == 0:
                var $submitBtn = $('<button>').text("提交");
                // var $modifyBtn = $('<button id="confirmModifyBtn">').text("确认修改");
                $submitBtn.appendTo($("#statusBtn"));
                // $modifyBtn.appendTo($("#statusBtn"));
                $submitBtn.click(function(){
                    $.ajax({
                        type: "POST",
                        url: ajaxUrl + "comm",
                        contentType : "application/json;charset=UTF-8",
                        dataType: 'json',
                        data: JSON.stringify({
                            methodName: "sp_cm_emr_submit",
                            param: JSON.stringify({"emr_main_id": emr_main_id})
                        }),
                        success: function(data){
                            if(data.code == 0){
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
                var $resion = $('<textarea placeholder="请输入未通过理由" id="resion">');
                var $notPassBtn = $('<button class="notPassBtn">').text("未通过");
                $passBtn.appendTo($("#statusBtn"));
                $modifyBtn.appendTo($("#statusBtn"));
                $notPassBtn.appendTo($("#statusBtn"));
                $resion.appendTo($("#statusBtn"));
                $passBtn.click(function(){
                    $.ajax({
                        type: "POST",
                        url: ajaxUrl + "comm",
                        contentType : "application/json;charset=UTF-8",
                        dataType: 'json',
                        data: JSON.stringify({
                            methodName: "sp_cm_emr_pass",
                            param: JSON.stringify({"emr_main_id": emr_main_id})
                        }),
                        success: function(data){
                            if(data.code == 0){
                                alert('此病例成功标记为通过');
                            }
                        }
                    })
                })
                break;
            case typeId == 2:
                break;
            case typeId == 4:
                break;
            case typeId == 5:
                break;
        }

        //上传图片对话框
        var caseImag = [];
        $('.btn_imgUpload').click(function(){
            window.itemId_btn_imgUpload = $(this).attr('itemid');
            $("#modal").modal('show');
        })
        //模态框
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

        $('#confirmModifyBtn').click(function () {
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
                var storage = window.localStorage;
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
                console.log(cases);
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
                            sessionStorage.clear();
                        }
                    }
                })
            }
        })
    }
})






