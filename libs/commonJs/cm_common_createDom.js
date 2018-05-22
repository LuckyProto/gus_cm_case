
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
        domStr += '<label><input type="radio" itemId='+ dictionary.itemId +' optionid='+ value.optionId + ' name='+ dictionary.itemId +'>'+ value.optionName +'</label>';
    })
    this.$dom = $(domStr);
    this.$inputs = this.$dom.find('input');
    this.$inputs.each(function(){
        if($(this).attr("optionid") == dictionary.itemValue){
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
        domStr += '<label><input type="checkbox" itemId='+ dictionary.itemId +' optionid='+ value.optionId + ' name='+ dictionary.itemId +'>'+ value.optionName +'</label>';
    })

    this.$dom = $(domStr);
    $inputs = this.$dom.find('input');
    var self = this;
    if(dictionary.itemValue){
        dictionary.itemValue.forEach(function (value, index, array) {
            $inputs.each(function(){
                if($(this).attr("optionid") == value){
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
    console.log(dictionary)
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