// 根据关键字自动匹配医生姓名
function cm_autocomplete(url, sourceName, sourceId) {
    $("#"+sourceName).autocomplete({
        minLength: 0,
        source: function (request, response) {
            var param = {};
            param.source_name = $("#"+sourceName).val();
            $.ajax({
                type: "post",
                url: "http://dev.gusskids.cn/guservice/comm",
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                //todo
                data: JSON.stringify({
                    methodName: url,
                    param: JSON.stringify(param)
                }),
                success: function (obj) {
                    response(obj.data);
                }
            });
        },
        focus: function (event, ui) {
            $("#"+sourceName).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $("#"+sourceName).val(ui.item.label);
            $("#"+sourceId).val(ui.item.value);
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            // .append( "<div>" + item.label + "</div>" )
            .append( "<div>" + item.label + "</div>" )
            .appendTo(ul);
    };
}

// 多选项自动填充（jquery－ui实现）
function cm_autocomplete_multiple_jqueryui(url, sourceName, sourceId) {
    $( function() {
        function split( val ) {
            return val.split( /,\s*/ );
        }
        function extractLast( term ) {
            return split( term ).pop();
        }

        var ids = [];

        $( "#"+sourceName )
        // don't navigate away from the field on tab when selecting an item
            .on( "keydown", function( event ) {
                if ( event.keyCode === $.ui.keyCode.TAB &&
                    $( this ).autocomplete( "instance" ).menu.active ) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                source: function( request, response ) {
                    var param = {};
                    param.category_name = extractLast($("#"+sourceName).val());
                    $.ajax({
                        type: "post",
                        url: "http://dev.gusskids.cn/guservice/comm",
                        contentType: 'application/json;charset=UTF-8',
                        dataType: 'json',
                        //todo
                        data: JSON.stringify({
                            methodName: url
                            ,param: JSON.stringify(param)
                        }),
                        success: function (obj) {
                            console.log(obj);
                            response(obj.data);
                        }
                    });
                },
                search: function() {
                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function( event, ui ) {
                    var terms = split( this.value );
                    console.log(terms);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push( ui.item.label );
                    // add placeholder to get the comma-and-space at the end
                    terms.push( "" );
                    this.value = terms.join( ", " );

                    ids.push(ui.item.value);
                    console.log(ids);
//                        document.getElementById("birds_id").value = ids;
                    $("#"+sourceId).val(ids);
//                        alert($("#birds_id").val());
                    return false;
                }
            })
            // .autocomplete("instance")._renderItem = function (ul, item) {
            // return $("<li>")
            //     .append( "<div>" + item.category_name + "</div>" )
            //     .appendTo(ul);
        // };


    } );
}

//创建jQueryDOM节点
function create_$dom(dataArr, $parDom, domStr) {
    var len = dataArr.length;
    for(var i = 0; i <len; i++){
        // $childDom = $('<' + domStr + '>' + dataArr[i].name + '</'+ domStr + '>');
        $childDom = $('<' + domStr + '>' + dataArr[i] + '</'+ domStr + '>');
        $parDom.append($childDom);
    }
}

//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
function checkRate(tip, nubmer) {
    var re = /^[0-9]+.?[0-9]*/;
    if (!re.test(nubmer)) {
        alert("请在" + tip + "输入数字")
    }
}

//获取url参数
function getQueryStringArgs() {
    //取得查询字符串并去掉开头的问号
    var qs = location.search.length > 0 ? location.search.substring(1) : '',
        //保存数据的对象
        args = {},
        //取得每一项
        items = qs.length > 0 ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,

        //在for中使用
        i = 0,
        len = items.length;

    //逐个将每一项添加到args中
    for(i = 0; i < len; i++){
        item = items[i].split('=');
        name = item[0];
        value = item[1];
        if(name.length){
            args[name] = value;
        }
    }
    return args;
}


//病例审核数组去重,适合上传图片和checkbox
function unique(array){
    array.sort(compare);
    var re = [array[0]],
        len = array.length;
    for(var i = 1; i < len; i++){
        if(re[re.length-1].itemId !== array[i].itemId){
            re.push(array[i]);
        }else if(re[re.length-1].parentId == array[i].parentId && re[re.length-1].itemId == array[i].itemId){
            // console.log(re[re.length-1], array[i])
            var checkVal = [];
            checkVal.push(re[re.length-1].itemValue);
            checkVal.push(array[i].itemValue);
            re[re.length-1].itemValue = checkVal.join(',');
        }
    }
    return re;
}
//病例审核数组升序排序
function compare(value1, value2) {
    if(value1.itemId < value2.itemId){
        return -1;
    }else if(value1.itemId > value2.itemId){
        return 1;
    }else{
        return 0;
    }
}

