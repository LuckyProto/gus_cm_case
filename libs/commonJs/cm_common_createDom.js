//表单序列化函数,返回数组
function serialize(form){
    var item = {},
        items_form = [],
        field = null,
        i,
        len,
        m,
        optLen,
        options,   //option元素的集合
        optValue;
    for(i = 0, len = form.elements.length; i < len; i++){
        item.itemValue = [];
        field = form.elements[i];
        switch (field.type){
            case "select-one":
            case "select-multiple":
                options = field.options;
                for(m = 0; m < options.length; m++){
                    if(options[m].selected){
                        if(options[m].hasAttribute('itemid') && options[m].hasAttribute('value')){
                            itemid = options[m].getAttribute('itemid');
                            parentId = options[m].getAttribute('parentId');
                            value = options[m].value;
                            item.itemId = itemid;
                            item.parentId = parentId;
                            item.itemValue = value;
                            items_form.push(item);
                        }
                    }
                }
                break;
            case undefined:    //字段集
            case 'file':       //文件输入
                // if(field.getAttribute('data-itemValues')) {
                //     items_form.push({'itemId': field.getAttribute('itemid'), 'parentId': field.getAttribute('parentId'), 'itemValue': field.getAttribute('data-itemValues')});
                // }
                // break;
            case 'submit':     //提交按钮
            case 'reset':      //重置按钮
            case 'button':     //自定义按钮
                break;
            case 'radio':
            case 'checkbox':
                if(!field.checked){
                    break;
                }
            case 'textarea':
                if(field.value) {
                    items_form.push({'itemId': field.getAttribute('itemid'), 'parentId': field.getAttribute('parentId'), 'itemValue': field.value});
                }
                break;
            default:
                if(field.value) {
                    items_form.push({'itemId': field.getAttribute('itemid'), 'parentId': field.getAttribute('parentId'), 'itemValue': field.value});
                }
                break;
        }
    }
    return items_form;
}


//一级菜单
function LevelOne(container, dictionary){
    this.dictionary     = dictionary;
    this.container      = container;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
LevelOne.prototype.init = function (container, dictionary) {
    var self = this;
    var domStr = [
        '<li class="levelOne">',
        '	<h3 class="title">'+ dictionary.itemName +'</h3>',
        '	<div class="levelTwo">',
        '		<ul class="levelTwoUl">',
        '		</ul>',
        '	</div>',
        '</li>'
    ].join("");
    this.$dom = $(domStr);
    this.$li = this.$dom.find('li');
    this.$title = this.$dom.find('.title');
    this.$levelTwo = this.$dom.find('.levelTwo');
    this.$ul = this.$dom.find('ul');
    this.$dom.appendTo(container);
    if(Array.isArray(dictionary.childNodes)){
        dictionary.childNodes.forEach(function (value, index, array) {
            createCaseItem(self.$ul, value);
        })
    }
}
LevelOne.prototype.bindEvent = function () {
    var self = this;
    this.$title.click(function () {
        self.$levelTwo.css({'display': 'block'}).parents('.levelOne').siblings().children('.levelTwo').css({'display': 'none'});
        self.$title.css({'background': '#5CC9F5', 'color':'#fff'}).parents('.levelOne').siblings().children('.title').css({'background': '#fff', 'color':'#888'})
    });
}
//itemTypeId == 1, 病例条目标题
function ItemTypeOne(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
    this.bindEvent();
}
ItemTypeOne.prototype.init = function(container, dictionary){
    var self = this;
    var textVal = dictionary.itemName ? dictionary.itemName : '';
    var domStr = [
        '<li class="levelTwoLi">',
        '<p class="levelTwoP">',
        '	<span>'+ textVal +'</span>',
        '</p>',
        '<div class="levelThree">',
        '<ul  class="levelThreeUl">',
        '</ul>',
        '</div>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
    this.$levelThree = this.$dom.find('.levelThree');
    if(Array.isArray(dictionary.childNodes)){
        this.$levelThreeUl = this.$dom.find('.levelThreeUl');
        dictionary.childNodes.forEach(function (value, index, array) {
            createCaseItem(self.$levelThreeUl, value);
        })
    }
}
ItemTypeOne.prototype.bindEvent = function () {
    var self = this;
    this.$dom.delegate('.levelTwoP', 'click', function () {
        self.$levelThree.css({'display': 'block'}).parents('.levelTwoLi').siblings().children('.levelThree').css({"display": 'none'});
    })
}

//itemTypeId==2创建文本框表单
function TextareaForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
TextareaForm.prototype.init = function(container, dictionary){
    var domStr = [
        '<li  class="caseItemLi">',
        '	<p class="caseItemP">',
        '		<span>'+ dictionary.itemName +'</span>',
        '	</p>',
        '   <form  class="caseItemForm">',
        '       <p>',
        // '		    <textarea type="textarea" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">'+ textVal +'</textarea>',
        '	    </p>',
        '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$formP = this.$dom.find('.caseItemForm>p');

    var textareas = '';
    if(dictionary.itemValue instanceof Array){
        dictionary.itemValue.forEach(function (value, index, array) {
            textareas += '<textarea type="textarea" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">'+ value +'</textarea>'
        })
        this.$domTextareas = $(textareas);
        this.$domTextareas.appendTo(this.$formP);
    }else{
        var textVal = dictionary.itemValue ? dictionary.itemValue : '';
        var domTextarea = [
            '<textarea type="textarea" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'" rows="8" cols="30">'+ textVal +'</textarea>'
        ].join("");

        this.$domTextarea = $(domTextarea);
        this.$domTextarea.appendTo(this.$formP);
    }
    this.$dom.appendTo(container);
}


//itemTypeId==4的情况，创建复选框
function inputCheckboxForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary)
}
inputCheckboxForm.prototype.init = function (container, dictionary) {
    var frameStr = [
            '<li class="checkboxLi">',
            '	<p>',
            '		<span>'+ dictionary.itemName +'</span>',
            '	</p>',
            '	<form class="checkboxForm">',
            '		<p class="checkboxP">',
            '				',
            '		</p>',
            '	</form>',
            '</li>'
        ].join(""),
        domStr = '';

    dictionary.options.forEach(function(value, index, array){
        domStr += '<label><input type="checkbox" name='+ dictionary.itemId +' itemId='+ dictionary.itemId +' parentId="'+ dictionary.parentId+'" value='+ value.optionId + ' >'+ value.optionName +'</label>';
    })
    this.$frameStr = $(frameStr);
    this.$checkboxP = this.$frameStr.find('.checkboxP');
    this.$dom = $(domStr);
    $inputs = this.$dom.find('input');
    var self = this;
    if(dictionary.itemValues){
        var itemValues = [];
        if((typeof dictionary.itemValues) == 'string'){
            itemValues.push(dictionary.itemValues);
        }else{
            itemValues = dictionary.itemValues
        }
        itemValues.forEach(function (value, index, array) {
            $inputs.each(function(){
                if($(this).val() == value){
                    $(this).attr({'checked': 'checked'});
                }
            })
        })
    }
    this.$dom.appendTo(this.$checkboxP);
    this.$frameStr.appendTo(container);
}
//itemTypeId=6的情况，适用于按钮被选中，输入框显示默认值，未被选中，不显示值
function itemTypeSix(container, dictionary) {
    this.isChecked = false;
    this.container = container;
    this.dictionary = dictionary;
    this.displayStartValue = this.dictionary.displayStartValue;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
itemTypeSix.prototype.init = function (container, dictionary) {
    var itemValue = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        '<li class="caseItemLi">',
        '   <p class="caseItemP"><label><input type="checkbox">'+ dictionary.itemName+'</label></p>',
        '   <form class="caseItemForm">',
        '	    <p>',
        '           <label>',
        '		        <input type="text" value="'+ itemValue+'" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">',
        '		        <span>'+ dictionary.itemUnit+'</span>',
        '           </label>',
        '	    </p>',
        '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$label = this.$dom.find('label');
    this.$checkbox_input = this.$dom.find('input[type="checkbox"]');
    this.$text_input = this.$dom.find('input[type="text"]');
    if(itemValue){
        this.$checkbox_input.prop({"checked": "checked"});
    }
    this.$dom.appendTo(container);
}
itemTypeSix.prototype.bindEvent = function () {
    var self = this;
    self.$label.click(function () {
        if(self.$checkbox_input.prop("checked")){
            self.$text_input.val(self.displayStartValue);
        }else{
            self.$text_input.val("");
        }
    })
}

//itemTpyeId==7, 单选按钮组表单
function inputRadiosForm(container, dictionary){
    this.container = container;
    this.init(container, dictionary);
}
inputRadiosForm.prototype.init = function(container, dictionary){
    //适合有多个选项的按钮组
    var frameStr = [
            '<li class="radiosLi">',
            '	<p>',
            '		<span>'+ dictionary.itemName +'</span>',
            '	</p>',
            '	<form class="radiosForm">',
            '		<p class="radiosP">',
            '				',
            '		</p>',
            '	</form>',
            '</li>'
        ].join(""),
        domStr = '';
    dictionary.options.forEach(function (value, index4, array3) {
        domStr += '<label><input type="radio" itemId='+ dictionary.itemId +' parentId="'+ dictionary.parentId+'" value='+ value.optionId + ' name='+ dictionary.itemId +'>'+ value.optionName +'</label>';
    })
    this.$frameStr = $(frameStr);
    this.$radiosP = this.$frameStr.find('.radiosP');

    this.$dom = $(domStr);
    this.$inputs = this.$dom.find('input');
    this.$inputs.each(function(){
        if($(this).val() == dictionary.itemValue){
            $(this).attr({'checked': 'checked'});
        }
    })
    this.$dom.appendTo(this.$radiosP);
    this.$frameStr.appendTo(container)
}

//itemTypeId == 8 创建输入框表单
function TextForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
    this.bindEvent();
}
TextForm.prototype.init = function(container, dictionary){
    var textVal = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = '';
     if(dictionary.itemName == "身高"){
         domStr = [
             '<li class="caseItemLi">',
             '	<p class="caseItemP">',
             '		<span>'+ dictionary.itemName +'</span>',
             '	</p>',
             '   <form class="caseItemForm">',
             '       <p>',
             '           <label>',
             '               <input id="height" type="text" value="'+ textVal +'" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">',
             '               <span>'+ dictionary.itemUnit+'</span>',
             '           </label>',
             '       </p>',
             '   </form>',
             '</li>'
         ].join("");
     }else if(dictionary.itemName == "体重"){
         domStr = [
             '<li class="caseItemLi">',
             '	<p class="caseItemP">',
             '		<span>'+ dictionary.itemName +'</span>',
             '	</p>',
             '   <form class="caseItemForm">',
             '       <p>',
             '           <label>',
             '               <input id="weight" type="text" value="'+ textVal +'" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">',
             '               <span>'+ dictionary.itemUnit+'</span>',
             '           </label>',
             '       </p>',
             '   </form>',
             '</li>'
         ].join("");
     }else if(dictionary.itemName == "体重指数"){
         domStr = [
             '<li class="caseItemLi">',
             '	<p class="caseItemP">',
             '		<span>'+ dictionary.itemName +'</span>',
             '	</p>',
             '   <form class="caseItemForm">',
             '       <p>',
             '           <label>',
             '               <input id="bmi" type="text" value="'+ textVal +'" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">',
             '               <span>'+ dictionary.itemUnit+'</span>',
             '           </label>',
             '       </p>',
             '   </form>',
             '</li>'
         ].join("");
     }else{
         domStr = [
             '<li class="caseItemLi">',
             '	<p class="caseItemP">',
             '		<span>'+ dictionary.itemName +'</span>',
             '	</p>',
             '   <form class="caseItemForm">',
             '       <p>',
             '           <label>',
             '               <input type="text" value="'+ textVal +'" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">',
             '               <span>'+ dictionary.itemUnit+'</span>',
             '           </label>',
             '       </p>',
             '   </form>',
             '</li>'
         ].join("");
     }

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}
TextForm.prototype.bindEvent = function () {
    $("#height, #weight").blur(function () {
        var hei = ($('#height').val() * $('#height').val()) / 10000,
            wei = $('#weight').val(),
            bmi = wei / hei;
        if(hei && wei){
            $('#bmi').val(bmi);
        }
    })
}
//itemTypeId==9下拉选择
function SelectForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
SelectForm.prototype.init = function(container, dictionary) {
    var domStr = [
        '<li class="caseItemLi">',
        '   <p class="caseItemP">',
        '		<span>'+ dictionary.itemName +'</span>',
        '   </p>',
        '   <form  class="caseItemForm">',
        '       <label>',
        '	        <select itemid="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'" type="select-one"><option value="请选择">请选择</option></select>',
        '       </label>',
        '   </form>',
        '</li>'
    ].join("");
    this.$dom = $(domStr);
    this.$select = this.$dom.find('select');

    //option选项
    var optionStr = '';
    dictionary.options.forEach(function (value, index, array) {
        optionStr += '<option  itemid="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'" value="'+ value.optionId +'">' + value.optionName + '</option>'
    })
    this.$optionStr = $(optionStr);


    this.$select.append(this.$optionStr);
    this.$select.val(dictionary.itemValue);
    this.$dom.appendTo(container);
}


//itemTypeId == 10, 上传图片类
function ImgUpload(container, dictionary) {
    this.dictionary     = dictionary;
    this.container      = container;
    this.item_type_id   = dictionary.item_type_id;
    this.emr_main_id    = dictionary.emr_main_id;
    this.emr_img_id     = dictionary.emr_img_id;
    this.itemId         = dictionary.itemId;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}

ImgUpload.prototype.init = function (container, dictionary) {
    var domStr = [
        '<li>',
        '   <p>',
        '   <form  class="caseItemForm">',
        // '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">查看大图</a><button class="btn_imgUpload" itemId="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'">添加图片</button>',
        '       <a href="javascript: void(0)" data-emr_main_id="'+ emr_main_id +'" data-item_type_id="1"  itemId="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'" class="show-big-image">查看大图</a><input data-itemValues="'+ dictionary.itemValues +'" type="file" multiple class="input-img-upload" itemId="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'" /><button type="button" class="btn_imgUpload" itemId="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'">上传图片</button>',
        '   </form>',
        '   </p>',
        '   <div>',
        '	    <ul>',
        '	    </ul>',
        '   </div>',
        '</li>'
    ].join("");
    var liStr = '',
        qcloadUrl = 'http://testimg-1253887111.file.myqcloud.com/';
    if(dictionary.itemValues && dictionary.itemValues[0] != null && dictionary.itemValues[0] != ""){
        // window.localStorage.setItem(dictionary.itemId,  dictionary.itemValues.join(','));
        dictionary.itemValues.forEach(function (value, index, array) {
            liStr += '<li><img src="'+ qcloadUrl +''+ value +'"></li>';
        })
    }

    this.$dom = $(domStr);
    this.$dom.addClass("imgUpload");
    this.$a = this.$dom.find('a');
    this.$btn = this.$dom.find('button');
    this.$input = this.$dom.find('input');
    this.$liStr = $(liStr);
    this.itemId = this.$input[0].getAttribute('itemId')
    var idx = 0;
    //图片显示与隐藏
    // setInterval(function () {
    //     if(idx >= $('img').length){
    //         idx = 0;
    //     }
    //     $('img').eq(idx).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
    //     idx++;
    // }, 2000)

    this.$ul_imgWrap = this.$dom.find('ul');
    this.$liStr.appendTo(this.$ul_imgWrap);
    this.$dom.appendTo(container);
}

ImgUpload.prototype.bindEvent = function (container, dictionary) {
    var self = this;
    //跳转页面
    this.$a.click(function () {
        var itemId          = self.$a.attr('itemId');
        var emr_main_id     = self.$a.attr('data-emr_main_id');
        var item_type_id    = self.$a.attr('data-item_type_id');
        window.open('checkImg.html?itemId=' + itemId + '&emr_main_id=' + emr_main_id + '&item_type_id=' + item_type_id);
        // window.sessionStorage.removeItem(itemId);
    })

    //上传图片
    this.$btn.click(function () {
        var imgUrlArr = [],         //存放图片地址的数组
            files = self.$input[0].files,
            len = files.length,     //文件数量
            idx = 0;                //当前上传的文件
        if(len){
            //回调函数将云上地址保存到数据库
            uploadQcload(files, idx, imgUrlArr, updataImgs)
        }else{
            alert('请选择图片')
        }
    })
    // this.$btn.click(function () {
    //     window.itemId_btn_imgUpload = $(this).attr('itemid');
    //     $("#modal").modal('show');
    // })
    //上传到腾讯云,递归调用
    function uploadQcload(files, idx, imgUrlArr, callback) {
        //更改文件名字
        var file = files[idx],
            newFile = new File([file], parseInt(Math.random()*10e16) + '' + Date.parse(new Date()) + file.name),
            len = files.length,       //文件数量
            //对象存储实例
            cos = new COS({
                SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
            });
        cos.putObject({
            Bucket: 'testimg-1253887111',
            Region: 'ap-beijing-1',
            Key: newFile.name,
            StorageClass: 'STANDARD',
            Body: newFile,       // 上传文件对象
        }, function(err, data) {
            imgUrlArr.push(data.Location.substring(56));
            idx++;
            if(idx <= len - 1){
                uploadQcload(files, idx, imgUrlArr, updataImgs)
            }else{
                alert('上传成功')
                callback(imgUrlArr)
            }
        });
    }

    //保存到后台
    function updataImgs(imgUrlArr) {
        self.$input[0].value = null;
        //获取原来的图片地址
        var originalImg = self.$input[0].getAttribute('data-itemValues'),
            itemValues = undefined;
        if(originalImg){
            //如果原来有图片则拼到一起
            itemValues = originalImg.split().concat(imgUrlArr).join();
            // self.$input[0].setAttribute('data-itemValues', (originalImg.split().concat(imgUrlArr)).join())
        }else{
            //原来没有图片
            itemValues = imgUrlArr.join();
            // self.$input[0].setAttribute('data-itemValues', imgUrlArr.join())
        }

        var emr_main_id     = self.$a.attr('data-emr_main_id');
        var selfParam = {
            "emr_main_id"   : emr_main_id,
            "item_type_id"  : 1,
            "itemId"        : self.itemId,
            "itemValues"    : itemValues
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_img_value_update",
                param: JSON.stringify(selfParam)
            }),
            success: function (data) {
                if (data.code == 0) {
                    alert('修改成功');
                    // sessionStorage.clear();
                }
            }
        })

    }
}


//itemTypeId==11,创建时间选择器表单,依赖bootstrap-datepicker库
function InputTimeForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
InputTimeForm.prototype.init = function(container, dictionary) {
    var itemValue = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        '<li class="caseItemLi">',
        '	<p  class="caseItemP">',
        '		<span>'+ dictionary.itemName +'</span>',
        '	</p>',
        '   <form  class="caseItemForm">',
        '	    <p>',
        '           <label>',
        '               <input type="text" value="'+ itemValue +'" itemid='+ dictionary.itemId +' parentId="'+ dictionary.parentId+'">',
        '           </label>',
        '       </p>',
        '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.find('input').addClass('datepicker');
    //日历初始化
    $('.datepicker').datepicker({language: 'zh-CN'});
    this.$dom.appendTo(container);
}


//主诉
function EmrInfo(container, dictionary){
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary)
}
EmrInfo.prototype.init = function (container, dictionary) {
    var domStr = [
        '<tr>',
        '     <td>'+ dictionary.disease_name +'</td>',
        '     <td>'+ dictionary.is_main_disease +'</td>',
        '     <td>'+ dictionary.is_diag +'</td>',
        '</tr>'
    ].join("");
    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}


//其它
function Other_textarea(container, dictionary) {
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary);
}
Other_textarea.prototype.init = function (container, dictionary) {
    var value = '';
    if(dictionary.event_remark){
        value = dictionary.event_remark ? dictionary.event_remark : "";
    }else{
        value = dictionary.other_content ? dictionary.other_content : "";
    }
    var domStr = [
        '<li  class="caseItemLi">',
        '	<p class="caseItemP">',
        '		<span>其它说明</span>',
        '	</p>',
        // '   <form  class="caseItemForm">',
        '       <p>',
        '		    <textarea itemid='+ dictionary.itemId +' id="other_textarea" type="textarea" emr_main_id="'+ dictionary.emr_main_id+'" rows="5" cols="30">'+ value +'</textarea>',
        '	    </p>',
        // '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}
//建议诊疗方案
function Treatment(container, dictionary) {
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary);
}
Treatment.prototype.init = function (container, dictionary) {
    var treat_content = dictionary.treat_content ? dictionary.treat_content : "";
    var domStr = [
        '<li  class="caseItemLi">',
        '	<p class="caseItemP">',
        '		<span>其它说明</span>',
        '	</p>',
        // '   <form  class="caseItemForm">',
        '       <p class="textareaWraper">',
        //'		    <textarea id="treatment_textarea" type="textarea" emr_main_id="'+ dictionary.emr_main_id+'">'+ treat_content +'</textarea>',
        '	    </p>',
        // '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    var textareas = '';
    this.$textareaWraper = this.$dom.find('.textareaWraper');
    if(dictionary.treat_content instanceof Array){
        dictionary.treat_content.forEach(function (value, index, array) {
            textareas += '<textarea class="treatment_textarea" type="textarea" emr_main_id="'+ dictionary.emr_main_id +'" rows="5" cols="30">'+ value +'</textarea>'
        })
        this.$domTextareas = $(textareas);
        this.$domTextareas.appendTo(this.$textareaWraper);
    }else{
        var textVal = dictionary.treat_content ? dictionary.treat_content : '';
        var domTextarea = [
            '<textarea class="treatment_textarea" type="textarea" itemid="'+ dictionary.itemId+'" emr_main_id="'+ dictionary.emr_main_id +'" rows="5" cols="30">'+ textVal +'</textarea>'
        ].join("");

        this.$domTextarea = $(domTextarea);
        this.$domTextarea.appendTo(this.$textareaWraper);
    }
    this.$dom.appendTo(container);
}
$('.title').click(function () {
    $(this).siblings().css({'display': 'block'}).parents('.levelOne').siblings().children('.levelTwo').css({'display': 'none'});
    $(this).css({'background': '#5CC9F5', 'color':'#fff'}).parents('.levelOne').siblings().children('.title').css({'background': '#fff', 'color':'#888'})
});
//建议诊疗方案上传图片类
function Treatment_ImgUpload(container, dictionary) {
    this.container = container;
    this.dictionary = dictionary;
    this.item_type_id   = dictionary.item_type_id;
    this.emr_main_id    = dictionary.emr_main_id;
    this.emr_img_id     = dictionary.emr_img_id;
    this.itemId         = dictionary.itemId;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
Treatment_ImgUpload.prototype.init = function (container, dictionary) {
    var domStr = [
        '<li class="eventLi">',
        '   <p>',
        '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><input data-item_type_id="'+ dictionary.item_type_id +'" data-emr_img_id="'+ dictionary.emr_img_id +'" data-itemValues="'+ dictionary.img_url_list +'" type="file" multiple class="input-img-upload" itemId="'+ dictionary.itemId +'" /><button type="button" class="btn_imgUpload" itemId="'+ dictionary.itemId +'" >上传图片</button>',
        // '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><button class="btn_imgUpload" itemId="'+ dictionary.itemId +'">添加图片</button>',
        '   </p>',
        '   <div>',
        '	    <ul>',
        '	    </ul>',
        '   </div>',
        '</li>'
    ].join("");
    var liStr = '',
        qcloadUrl = 'http://testimg-1253887111.file.myqcloud.com/';
    if(dictionary.img_url_list && dictionary.img_url_list[0] != null && dictionary.img_url_list[0] != ""){
        // window.localStorage.setItem(dictionary.itemId,  dictionary.img_url_list.join(','));
        dictionary.img_url_list.forEach(function (value, index, array) {
            liStr += '<li><img src="'+ qcloadUrl +''+ value +'"></li>';
        })
    }

    this.$dom = $(domStr);
    this.$dom.addClass("imgUpload");
    this.$a = this.$dom.find('a');
    this.$btn = this.$dom.find('button');
    this.$input = this.$dom.find('input');
    this.$liStr = $(liStr);
    this.itemId = this.$input[0].getAttribute('itemId')
    var idx = 0;
    //图片显示与隐藏
    setInterval(function () {
        if(idx >= $('img').length){
            idx = 0;
        }
        $('img').eq(idx).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
        idx++;
    }, 2000)

    this.$ul_imgWrap = this.$dom.find('ul');
    this.$liStr.appendTo(this.$ul_imgWrap);
    this.$dom.appendTo(container);
}

Treatment_ImgUpload.prototype.bindEvent = function (container, dictionary) {
    var self = this;
    //跳转页面
    this.$a.click(function () {
        var itemId = self.$a.attr('itemid');
        window.open('checkImg.html?item_type_id=' + self.item_type_id + '&emr_main_id=' + self.emr_main_id);
        // window.open('checkImg.html?itemId=' + itemId);
        // window.sessionStorage.removeItem(itemId);
    })

    //显示模态框
    this.$btn.click(function () {
        // window.itemId_btn_imgUpload = $(this).attr('itemId');
        // $("#modal").modal('show');
        var imgUrlArr = [],         //存放图片地址的数组
            files = self.$input[0].files,
            len = files.length,     //文件数量
            idx = 0;                //当前上传的文件
        if(len){
            //回调函数将云上地址保存到数据库
            uploadQcload(files, idx, imgUrlArr, updataImgs)
        }else{
            alert('请选择图片')
        }
    })
    function uploadQcload(files, idx, imgUrlArr, callback) {
        //更改文件名字
        var file = files[idx],
            newFile = new File([file], parseInt(Math.random()*10e16) + '' + Date.parse(new Date()) + file.name),
            len = files.length,       //文件数量
            // 对象存储实例
            cos = new COS({
                SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
            });
        cos.putObject({
            Bucket: 'testimg-1253887111',
            Region: 'ap-beijing-1',
            Key: newFile.name,
            StorageClass: 'STANDARD',
            Body: newFile,       // 上传文件对象
        }, function(err, data) {
            imgUrlArr.push(data.Location.substring(56));
            idx++;
            //递归调用
            if(idx <= len - 1){
                uploadQcload(files, idx, imgUrlArr, updataImgs)
            }else{
                alert('上传成功')
                callback(imgUrlArr)
            }
        });
    }

    //保存到后台
    function updataImgs(imgUrlArr) {
        self.$input[0].value = null;
        //获取原来的图片地址
        var originalImg = self.$input[0].getAttribute('data-itemValues'),
            item_type_id  = self.$input[0].getAttribute('data-item_type_id'),
            itemValues = undefined;
        if(originalImg){
            //如果原来有图片则拼到一起
            itemValues = originalImg.split().concat(imgUrlArr).join();
            // self.$input[0].setAttribute('data-itemValues', (originalImg.split().concat(imgUrlArr)).join())
        }else{
            //原来没有图片
            itemValues = imgUrlArr.join();
            // self.$input[0].setAttribute('data-itemValues', imgUrlArr.join())
        }
        var selfParam = {
            "emr_main_id"   : self.emr_main_id,
            "item_type_id"  : item_type_id,
            "itemId"        : self.itemId,
            "itemValues"    : itemValues
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_img_value_update",
                param: JSON.stringify(selfParam)
            }),
            success: function (data) {
                if (data.code == 0) {
                    alert('修改成功');
                    // sessionStorage.clear();
                }
            }
        })

    }
}


//重大事件上传图片类
function Event_ImgUpload(container, dictionary) {
    this.container          = container;
    this.dictionary         = dictionary;
    this.item_type_id       = dictionary.item_type_id;
    this.emr_main_id        = dictionary.emr_main_id;
    this.emr_main_event_id  = dictionary.emr_main_event_id;
    this.emr_img_id         = dictionary.emr_img_id;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
Event_ImgUpload.prototype.init = function (container, dictionary) {
    var domStr = [
        '<li class="eventLi">',
        '   <p>',
        '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><input data-item_type_id="'+ dictionary.item_type_id +'" data-emr_img_id="'+ dictionary.emr_img_id +'" data-emr_main_event_id="'+ dictionary.emr_main_event_id +'" data-itemValues="'+ dictionary.img_url_list +'" type="file" multiple class="input-img-upload" itemId="'+ dictionary.itemId +'" /><button type="button" class="btn_imgUpload" itemId="'+ dictionary.itemId +'" >上传图片</button>',
        // '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><button class="btn_imgUpload" itemId="'+ dictionary.itemId +'">添加图片</button>',
        '   </p>',
        '   <div>',
        '	    <ul>',
        '	    </ul>',
        '   </div>',
        '</li>'
    ].join("");
    var liStr = '',
        qcloadUrl = 'http://testimg-1253887111.file.myqcloud.com/';
    if(dictionary.img_url_list && dictionary.img_url_list[0] != null && dictionary.img_url_list[0] != ""){
        window.localStorage.setItem(dictionary.itemId,  dictionary.img_url_list.join(','));
        dictionary.img_url_list.forEach(function (value, index, array) {
            liStr += '<li><img src="'+ qcloadUrl +''+ value +'"></li>';
        })
    }

    this.$dom = $(domStr);
    this.$dom.addClass("imgUpload");
    this.$a = this.$dom.find('a');
    this.$btn = this.$dom.find('button');
    this.$input = this.$dom.find('input');
    this.$liStr = $(liStr);
    this.itemId = this.$input[0].getAttribute('itemId')
    var idx = 0;
    //图片显示与隐藏
    setInterval(function () {
        if(idx >= $('img').length){
            idx = 0;
        }
        $('img').eq(idx).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
        idx++;
    }, 2000)

    this.$ul_imgWrap = this.$dom.find('ul');
    this.$liStr.appendTo(this.$ul_imgWrap);
    this.$dom.appendTo(container);
}

Event_ImgUpload.prototype.bindEvent = function (container, dictionary) {
    var self = this;
    //跳转页面
    this.$a.click(function () {
        var itemId = self.$a.attr('itemid');
        window.open('checkImg.html?item_type_id=' + self.item_type_id + '&emr_main_id=' + self.emr_main_id + '&emr_main_event_id=' + self.emr_main_event_id + '&emr_img_id=' + self.emr_img_id);
        window.sessionStorage.removeItem(itemId);
    })

    //显示模态框
    this.$btn.click(function () {
        // window.itemId_btn_imgUpload = $(this).attr('itemId');
        // $("#modal").modal('show');
        var imgUrlArr = [],         //存放图片地址的数组
            files = self.$input[0].files,
            len = files.length,     //文件数量
            idx = 0;                //当前上传的文件
        if(len){
            //回调函数将云上地址保存到数据库
            uploadQcload(files, idx, imgUrlArr, updataImgs)
        }else{
            alert('请选择图片')
        }
    })
    function uploadQcload(files, idx, imgUrlArr, callback) {
        //更改文件名字
        var file = files[idx],
            newFile = new File([file], parseInt(Math.random()*10e16) + '' + Date.parse(new Date()) + file.name),
            len = files.length,       //文件数量
            // 对象存储实例
            cos = new COS({
                SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
            });
        cos.putObject({
            Bucket: 'testimg-1253887111',
            Region: 'ap-beijing-1',
            Key: newFile.name,
            StorageClass: 'STANDARD',
            Body: newFile,       // 上传文件对象
        }, function(err, data) {
            imgUrlArr.push(data.Location.substring(56));
            idx++;
            //递归调用
            if(idx <= len - 1){
                uploadQcload(files, idx, imgUrlArr, updataImgs)
            }else{
                alert('上传成功')
                callback(imgUrlArr)
            }
        });
    }

    //保存到后台
    function updataImgs(imgUrlArr) {
        self.$input[0].value = null;
        //获取原来的图片地址
        var originalImg = self.$input[0].getAttribute('data-itemValues'),
            item_type_id  = self.$input[0].getAttribute('data-item_type_id'),
            emr_main_event_id  = self.$input[0].getAttribute('data-emr_main_event_id'),
            emr_img_id  = self.$input[0].getAttribute('data-emr_img_id'),
            itemValues = undefined;
        if(originalImg){
            //如果原来有图片则拼到一起
            itemValues = originalImg.split().concat(imgUrlArr).join();
            // self.$input[0].setAttribute('data-itemValues', (originalImg.split().concat(imgUrlArr)).join())
        }else{
            //原来没有图片
            itemValues = imgUrlArr.join();
            // self.$input[0].setAttribute('data-itemValues', imgUrlArr.join())
        }
        var selfParam = {
            "emr_main_id"   : self.emr_main_id,
            "item_type_id"  : item_type_id,
            "emr_main_event_id": emr_main_event_id,
            "emr_img_id"    : emr_img_id,
            "itemValues"    : itemValues
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_img_value_update",
                param: JSON.stringify(selfParam, 4)
            }),
            success: function (data) {
                if (data.code == 0) {
                    alert('修改成功');
                }
            }
        })

    }
}


//其它上传图片类
function Other_ImgUpload(container, dictionary) {
    this.container      = container;
    this.dictionary     = dictionary;
    this.item_type_id   = dictionary.item_type_id;
    this.emr_main_id    = dictionary.emr_main_id;
    this.emr_img_id     = dictionary.emr_img_id;
    this.itemId         = dictionary.itemId;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}

Other_ImgUpload.prototype.init = function (container, dictionary) {
    var domStr = [
        '<li class="eventLi">',
        '   <p>',
        '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><input data-item_type_id="'+ dictionary.item_type_id +'" data-emr_img_id="'+ dictionary.emr_img_id +'" data-itemValues="'+ dictionary.img_url_list +'" type="file" multiple class="input-img-upload" itemId="'+ dictionary.itemId +'" /><button type="button" class="btn_imgUpload" itemId="'+ dictionary.itemId +'" >上传图片</button>',
        // '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" >查看大图</a><button class="btn_imgUpload" itemId="'+ dictionary.itemId +'">添加图片</button>',
        '   </p>',
        '   <div>',
        '	    <ul>',
        '	    </ul>',
        '   </div>',
        '</li>'
    ].join("");
    var liStr = '',
        qcloadUrl = 'http://testimg-1253887111.file.myqcloud.com/';
    if(dictionary.img_url_list && dictionary.img_url_list[0] != null && dictionary.img_url_list[0] != ""){
        dictionary.img_url_list.forEach(function (value, index, array) {
            liStr += '<li><img src="'+ qcloadUrl +''+ value +'"></li>';
        })
    }

    this.$dom = $(domStr);
    this.$dom.addClass("imgUpload");
    this.$a = this.$dom.find('a');
    this.$btn = this.$dom.find('button');
    this.$input = this.$dom.find('input');
    this.$liStr = $(liStr);
    this.itemId = this.$input[0].getAttribute('itemId')
    var idx = 0;
    //图片显示与隐藏
    setInterval(function () {
        if(idx >= $('img').length){
            idx = 0;
        }
        $('img').eq(idx).parent().css({'border-bottom': '1px solid #000'}).fadeIn().siblings().fadeOut();
        idx++;
    }, 2000)

    this.$ul_imgWrap = this.$dom.find('ul');
    this.$liStr.appendTo(this.$ul_imgWrap);
    this.$dom.appendTo(container);
}

Other_ImgUpload.prototype.bindEvent = function (container, dictionary) {
    var self = this;
    //跳转页面
    this.$a.click(function () {
        var itemId = self.$a.attr('itemid');
        window.open('checkImg.html?item_type_id=' + self.item_type_id + '&emr_main_id=' + self.emr_main_id + '&emr_img_id=' + self.emr_img_id);
    })

    //显示模态框
    this.$btn.click(function () {
        // window.itemId_btn_imgUpload = $(this).attr('itemId');
        // $("#modal").modal('show');
        var imgUrlArr = [],         //存放图片地址的数组
            files = self.$input[0].files,
            len = files.length,     //文件数量
            idx = 0;                //当前上传的文件
        if(len){
            //回调函数将云上地址保存到数据库
            uploadQcload(files, idx, imgUrlArr, updataImgs)
        }else{
            alert('请选择图片')
        }
    })
    function uploadQcload(files, idx, imgUrlArr, callback) {
        //更改文件名字
        var file = files[idx],
            newFile = new File([file], parseInt(Math.random()*10e16) + '' + Date.parse(new Date()) + file.name),
            len = files.length,       //文件数量
            // 对象存储实例
            cos = new COS({
                SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
            });
        cos.putObject({
            Bucket: 'testimg-1253887111',
            Region: 'ap-beijing-1',
            Key: newFile.name,
            StorageClass: 'STANDARD',
            Body: newFile,       // 上传文件对象
        }, function(err, data) {
            imgUrlArr.push(data.Location.substring(56));
            idx++;
            //递归调用
            if(idx <= len - 1){
                uploadQcload(files, idx, imgUrlArr, updataImgs)
            }else{
                alert('上传成功')
                callback(imgUrlArr)
            }
        });
    }

    //保存到后台
    function updataImgs(imgUrlArr) {
        self.$input[0].value = null;
        //获取原来的图片地址
        var originalImg = self.$input[0].getAttribute('data-itemValues'),
            item_type_id  = self.$input[0].getAttribute('data-item_type_id'),
            emr_img_id  = self.$input[0].getAttribute('data-emr_img_id'),
            itemValues = undefined;
        if(originalImg){
            //如果原来有图片则拼到一起
            itemValues = originalImg.split().concat(imgUrlArr).join();
            // self.$input[0].setAttribute('data-itemValues', (originalImg.split().concat(imgUrlArr)).join())
        }else{
            //原来没有图片
            itemValues = imgUrlArr.join();
            // self.$input[0].setAttribute('data-itemValues', imgUrlArr.join())
        }
        var selfParam = {
            "emr_main_id"   : self.emr_main_id,
            "item_type_id"  : item_type_id,
            "item_type_name": "other",
            "item_type_cname": "其它",
            "emr_img_id"    : emr_img_id,
            "itemId"        : self.itemId,
            "itemValues"    : itemValues
        }
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_img_value_update",
                param: JSON.stringify(selfParam)
            }),
            success: function (data) {
                if (data.code == 0) {
                    alert('修改成功');
                    // sessionStorage.clear();
                }
            }
        })

    }
}
//重大事件 创建时间选择器表单,依赖bootstrap-datepicker库
function EventInputTimeForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
EventInputTimeForm.prototype.init = function(container, dictionary) {
    var itemValue = dictionary.event_date ? dictionary.event_date : '';
    var domStr = [
        '<li class="caseItemLi">',
        '	<p  class="caseItemP">',
        '		<span>事件时间</span>',
        '	</p>',
        // '   <form  class="caseItemForm">',
        '	    <p>',
        '           <label>',
        '               <input type="text" value="'+ itemValue +'" id='+ dictionary.itemId +' class="eventDatepicker">',
        '           </label>',
        '       </p>',
        // '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);

    this.$dom.find('input').addClass('datepicker');
    //日历初始化
    $('.datepicker').datepicker({language: 'zh-CN'});
}
//重大事件说明
function eventRemark(container, dictionary) {
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary);
}
eventRemark.prototype.init = function (container, dictionary) {
    var event_remark = dictionary.event_remark ? dictionary.event_remark : "";
    var domStr = [
        '<li  class="caseItemLi">',
        '	<p class="caseItemP">',
        '		<span>其它说明</span>',
        '	</p>',
        // '   <form  class="caseItemForm">',
        '       <p class="textareaWraper">',
        //'		    <textarea id="treatment_textarea" type="textarea" emr_main_id="'+ dictionary.emr_main_id+'">'+ treat_content +'</textarea>',
        '	    </p>',
        // '   </form>',
        '</li>'
    ].join("");

    this.$dom = $(domStr);
    var textareas = '';
    this.$textareaWraper = this.$dom.find('.textareaWraper');
    if(dictionary.event_remark instanceof Array){
        dictionary.event_remark.forEach(function (value, index, array) {
            textareas += '<textarea class="event_textarea" type="textarea" emr_main_id="'+ dictionary.emr_main_id +'" rows="5" cols="30">'+ value +'</textarea>'
        })
        this.$domTextareas = $(textareas);
        this.$domTextareas.appendTo(this.$textareaWraper);
    }else{
        var textVal = dictionary.event_remark ? dictionary.event_remark : '';
        var domTextarea = [
            '<textarea class="event_textarea" type="textarea" itemid="'+ dictionary.itemId+'" emr_main_id="'+ dictionary.emr_main_id +'" rows="5" cols="30">'+ textVal +'</textarea>'
        ].join("");

        this.$domTextarea = $(domTextarea);
        this.$domTextarea.appendTo(this.$textareaWraper);
    }
    this.$dom.appendTo(container);
}


//重大事件下拉选择
function EventSelectForm(container, dictionary){
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
EventSelectForm.prototype.init = function(container, dictionary) {
    var domStr = [
        '<li class="caseItemLi">',
        '   <p class="caseItemP">',
        '		<span>事件类型</span>',
        '   </p>',
        // '   <form  class="caseItemForm">',
        '       <label>',
        '	        <select class="levelOne_select" type="select-one"><option value="0">请选择</option></select>',
        '       </label>',
        '       <label>',
        '	        <select class="levelTwo_select" type="select-one"><option value="0">请选择</option></select>',
        '       </label>',
        // '   </form>',
        '</li>'
    ].join("");
    this.$dom = $(domStr);
    this.$levelOne_select = this.$dom.find('.levelOne_select');
    this.$levelTwo_select = this.$dom.find('.levelTwo_select');

    //optionOne选项
    var levelOne_optionStr = '';
    if(dictionary.level_1_option_list){
        dictionary.level_1_option_list.forEach(function (value, index, array) {
            levelOne_optionStr += '<option value="'+ value.option_id +'" emr_main_id="'+ dictionary.emr_main_id+'">' + value.option_name + '</option>'
        })
    }
    this.$levelOne_optionStr = $(levelOne_optionStr);
    this.$levelOne_select.append(this.$levelOne_optionStr);
    this.$levelOne_select.val(dictionary.level_1_selected_id);

    //optionOne选项
    if(dictionary.level_2_option_list){
        var levelTwo_optionStr = '';
        dictionary.level_2_option_list.forEach(function (value, index, array) {
            levelTwo_optionStr += '<option value="'+ value.option_id +'" emr_main_id="'+ dictionary.emr_main_id+'">' + value.option_name + '</option>'
        })
        this.$levelTwo_optionStr = $(levelTwo_optionStr);
        this.$levelTwo_select.append(this.$levelTwo_optionStr);
        this.$levelTwo_select.val(dictionary.level_2_selected_id);
    }

    this.$dom.appendTo(container);
}
EventSelectForm.prototype.bindEvent = function (container, dictionary) {
    $('.levelOne_select').change(function () {
        var self = this;
        var levelOneSelectObj = {};
        levelOneSelectObj.id = $(this).val();
        $.ajax({
            type: "POST",
            url: ajaxUrl + "comm",
            contentType : "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify({
                methodName: "sp_cm_emr_event_option_list",
                param: JSON.stringify(levelOneSelectObj)
            }),
            success: function(data){
                if(data.code == 0){
                    if(data.data){
                        var levelTwo_optionStr = '';
                        data.data.forEach(function (value, index, array) {
                            levelTwo_optionStr += '<option class="canRemove" value="'+ value.option_id +'">' + value.option_name + '</option>'
                        })
                        $levelTwo_optionStr = $(levelTwo_optionStr);
                        //添加二级选项
                        $(self).parent().siblings().children().empty(".canRemove");
                        $(self).parent().siblings().children().append($('<option class="not" value="0">请选择</option>'));
                        $(self).parent().siblings().children().append($levelTwo_optionStr);
                    }
                }
            }
        })
    })
}
//创建病例条目
function createCaseItem(container, dictionary) {
    switch (true){
        case dictionary.itemTypeId == 1:
            new ItemTypeOne(container, dictionary)
            break;
        case dictionary.itemTypeId == 2:
            new TextareaForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 3:
            new SelectForm(container, dictionary);
            break;
        case dictionary.itemTypeId == 4:
            new inputCheckboxForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 5:
            break;
        case dictionary.itemTypeId == 6:
            new itemTypeSix(container, dictionary)
            break;
        case dictionary.itemTypeId == 7:
            new inputRadiosForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 8:
            new TextForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 9:
            new SelectForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 10:
            new ImgUpload(container, dictionary)
            break;
        case dictionary.itemTypeId == 11:
            new InputTimeForm(container, dictionary)
            break;
        case dictionary.itemTypeId == 12:
            break;
    }
}





