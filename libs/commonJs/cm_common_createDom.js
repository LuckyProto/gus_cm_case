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
                            value = options[m].value;
                            item.itemId = itemid;
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
            default:
                if(field.value) {
                    items_form.push({'itemId': field.getAttribute('itemid'), 'itemValue': field.value});
                }
                break;
        }
    }
    return items_form;
}

//创建每个项目标题
function createTitle(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary)
}
createTitle.prototype.init = function(container, dictionary){
    var textVal = dictionary.itemName ? dictionary.itemName : '';
    var domStr = [
        '<p>',
        '	<span>'+ textVal +'</span>',
        '</p>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}

//创建输入框表单
function TextForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
TextForm.prototype.init = function(container, dictionary){
    var textVal = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        '<form>',
        '   <p>',
        '       <input type="text" value="'+ textVal +'" itemid="'+ dictionary.itemId+'">',
        '       <span>'+ dictionary.itemUnit+'</span>',
        '   </p>',
        '</form>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}

//创建文本框表单
function TextareaForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
TextareaForm.prototype.init = function(container, dictionary){
    var textVal = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        '<form>',
        '   <p>',
        '		<textarea type="textarea" itemid="'+ dictionary.itemId+'">'+ textVal +'</textarea>',
        '	</p>',
        '</form>'
    ].join("");

    this.$dom = $(domStr);
    this.$dom.appendTo(container);
}

//创建单选按钮组表单
function inputRadiosForm(container, dictionary){
    this.container = container;
    this.init(container, dictionary);
}
inputRadiosForm.prototype.init = function(container, dictionary){
    //这里注释部分只适合有3个选项的单选按钮组
    // var domStr = [
    //     '<form>',
    //     '	<p>',
    //     '		<label><input type="radio" name="itemid" itemid="'+ dictionary.itemId+'" optionid="'+ dictionary.options[0].optionId+'">'+ dictionary.options[0].optionName +'</label>',
    //     '		<label><input type="radio" name="itemid" itemid="'+ dictionary.itemId+'" optionid="'+ dictionary.options[1].optionId+'">'+ dictionary.options[1].optionName +'</label>',
    //     '		<label><input type="radio" name="itemid" itemid="'+ dictionary.itemId+'" optionid="'+ dictionary.options[2].optionId+'">'+ dictionary.options[2].optionName +'</label>',
    //     '	</p>',
    //     '</form>'
    // ].join("");

    // this.$dom = $(domStr);
    // this.$inputs = this.$dom.find('input');
    // this.$inputs.each(function(){
    //     if($(this).attr("optionid") == dictionary.itemValue){
    //         $(this).attr({'checked': 'checked'});
    //     }
    // })
    // this.$dom.appendTo(container);


    //适合有多个选项的按钮组
    var $form = $("<form>"),
        $p = $('<p>'),
        domStr = '';
    dictionary.options.forEach(function (value, index4, array3) {
        domStr += '<label><input type="radio" itemId='+ dictionary.itemId +' value='+ value.optionId + ' name='+ dictionary.itemId +'>'+ value.optionName +'</label>';
    })
    this.$dom = $(domStr);
    this.$inputs = this.$dom.find('input');
    this.$inputs.each(function(){
        if($(this).val() == dictionary.itemValue){
            $(this).attr({'checked': 'checked'});
        }
    })
    this.$dom.appendTo($p);
    $p.appendTo($form);
    $form.appendTo(container)
}

//创建复选框表单
function inputCheckboxForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary)
}
inputCheckboxForm.prototype.init = function (container, dictionary) {
    var $form = $("<form>"),
        $p = $("<p>"),
        domStr = '';

    dictionary.options.forEach(function(value, index, array){
        domStr += '<label><input type="checkbox" name='+ dictionary.itemId +' itemId='+ dictionary.itemId +' value='+ value.optionId + ' >'+ value.optionName +'</label>';
    })

    this.$dom = $(domStr);
    $inputs = this.$dom.find('input');
    var self = this;
    if(dictionary.itemValue){
        var itemValue = [];
        if((typeof dictionary.itemValue) == 'string'){
            itemValue.push(dictionary.itemValue);
        }else{
            itemValue = dictionary.itemValue
        }
        itemValue.forEach(function (value, index, array) {
            $inputs.each(function(){
                if($(this).val() == value){
                    $(this).attr({'checked': 'checked'});
                }
            })
        })
    }
    this.$dom.appendTo($p);
    $p.appendTo($form);
    $form.appendTo(container);
}


//创建单选按钮表单
function inputRadioForm(container, dictionary){
    this.container = container;
    this.init(container, dictionary);
}
inputRadioForm.prototype.init = function(container, dictionary){
    var domStr = [
        '<form>',
        '	<label><input type="radio">'+ dictionary.itemName +'</label>',
        '</form>'
    ].join("");

    this.$dom = $(domStr);

    this.$dom.appendTo(container);
}

function selectOptionsForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary)
}

//创建时间选择器表单
function InputTimeForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
InputTimeForm.prototype.init = function(container, dictionary) {
    var itemValue = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        "<form>",
        "	<p><label><input type='text' value='"+ itemValue +"' itemid='"+ dictionary.itemId +"'></label></p>",
        "</form>"
    ].join("");

    this.$dom = $(domStr);
    this.$dom.find('input').addClass('datepicker');
    this.$dom.appendTo(container);
}

//下拉选择
function SelectForm(container, dictionary){
    this.container = container;
    this.init(this.container, dictionary);
}
SelectForm.prototype.init = function(container, dictionary) {
    var domStr = [
        '<form>',
        '	<select itemid="'+ dictionary.itemId +'" type="select-one"><option value="请选择">请选择</option></select>',
        '</form>'
    ].join("");
    this.$dom = $(domStr);
    this.$select = this.$dom.find('select');

    //option选项
    var optionStr = '';
    dictionary.options.forEach(function (value, index, array) {
        optionStr += '<option  itemid="'+ dictionary.itemId +'" value="'+ value.optionId +'">' + value.optionName + '</option>'
    })
    this.$optionStr = $(optionStr);


    this.$select.append(this.$optionStr);
    this.$select.val(dictionary.itemValue);
    this.$dom.appendTo(container);
}

//itemTypeId=6的情况，适用于按钮被选中，输入框显示默认值，未被选中，不显示值
function itemType_six(container, dictionary) {
    this.isChecked = false;
    this.container = container;
    this.dictionary = dictionary;
    this.displayStartValue = this.dictionary.displayStartValue;
    this.init(this.container, this.dictionary);
    this.bindEvent();
}
itemType_six.prototype.init = function (container, dictionary) {
    var itemValue = dictionary.itemValue ? dictionary.itemValue : '';
    var domStr = [
        '<p><label><input type="checkbox">'+ dictionary.itemName+'</label></p>',
        '<form>',
        '	<p>',
        '		<input type="text" value="'+ itemValue+'" itemid="'+ dictionary.itemId+'">',
        '		<span>'+ dictionary.itemUnit+'</span>',
        '	</p>',
        '</form>'
    ].join("");

    this.$dom = $(domStr);
    this.$label = this.$dom.find('label');
    this.$checkbox_input = this.$dom.find('input[type="checkbox"]');
    this.$text_input = this.$dom.find('input[type="text"]');
    if(itemValue){
        this.$checkbox_input.attr({"checked": "checked"});
    }
    this.$dom.appendTo(container);
}
itemType_six.prototype.bindEvent = function () {
    var self = this;
    self.$label.click(function () {
        if(self.$checkbox_input.attr("checked")){
            self.$text_input.val("");
        }else{
            self.$text_input.val(self.displayStartValue);
        }
    })
}