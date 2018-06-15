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
                            console.log(itemid, parentId, value);
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
                    items_form.push({'itemId': field.getAttribute('itemid'), 'parentId': field.getAttribute('parentId'), 'itemValue': field.value + '$'});
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
    this.dictionary = dictionary;
    this.container = container;
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
            '<textarea type="textarea" itemid="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">'+ textVal +'</textarea>'
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
}
TextForm.prototype.init = function(container, dictionary){
    var textVal = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
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

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
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
    this.container = container;
    this.dictionary = dictionary;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
ImgUpload.prototype.init = function (container, dictionary) {
    var domStr = [
        '<li>',
        '   <p>',
        '       <a href="javascript: void(0)" itemId="'+ dictionary.itemId+'" parentId="'+ dictionary.parentId+'">查看大图</a><button class="btn_imgUpload" itemId="'+ dictionary.itemId +'" parentId="'+ dictionary.parentId+'">添加图片</button>',
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
        window.localStorage.setItem(dictionary.itemId,  dictionary.itemValues.join(','));
        dictionary.itemValues.forEach(function (value, index, array) {
            liStr += '<li><img src="'+ qcloadUrl +''+ value +'"></li>';
        })
    }

    this.$dom = $(domStr);
    this.$dom.addClass("imgUpload");
    this.$a = this.$dom.find('a');
    this.$btn = this.$dom.find('button');
    this.$liStr = $(liStr);
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

ImgUpload.prototype.bindEvent = function (container, dictionary) {
    var self = this;
    //跳转页面
    this.$a.click(function () {
        var itemId = self.$a.attr('itemId');
        window.open('checkImg.html?itemId=' + itemId);
        window.sessionStorage.removeItem(itemId);
    })

    //显示模态框
    this.$btn.click(function () {
        window.itemId_btn_imgUpload = $(this).attr('itemid');
    })
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





