/*
* Created by chendongxue on 2015/7/24.
* 说明：在页面初始此方法
*   dc_validation.ready(className);
*   在表单提交的事件里对dc_validation.submitValidate(className)进行判断，为true方可提交表单，否则或做出相应判断;
*
*   html页面要求：验证表单需要放在一个div里如：class=validation div
*       每个节点和错误提示信息需放在一个div里如下面html代码
*       需要验证的表单节点里须有 validated属性（验证规则）、msg属性
*   <div class='validation'>
         <div>
             <input type="text" id="1" validated="require " msg="姓名"/>
             <div class="error"></div>
         </div>
         <div>
             <input type="text" id="2" validated="require email" msg="邮箱"/>
             <div class="error"></div>
         </div>
    </div>
* validated包含的验证种类有(支持input、textarea)
*    require 必填验证
*    email   邮箱验证
*    telephone   电话验证（手机号码）
*    phone      电话验证
*    idCard     身份证验证
*    rePassword 确认密码  第一次输入密码中需写入 password
*    selected 下拉框必选
*
* */

var dc_validation = {

    /**
     * 表单点击事件
     */
    ready: function(className){

        $('input,textarea,select').off('focus').on('focus', function(){
           $(this).parent().find('.error').text('');
        }).off('click').on('click', function(){
           $(this).parent().find('.error').text('');
        });

        this.blurValidate(className);

        //解决在IE8及以下版本不存在indexOf方法
        if (!Array.prototype.indexOf)
        {
            Array.prototype.indexOf = function(elt /*, from*/)
            {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);

                if (from < 0){
                    from += len;
                }

                for (; from < len; from++){
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }

                return -1;
            };
        }
    },

    /**
     *提交验证方法
     * @param className 需要验证区域的class
     * @returns {boolean} 需要返回的布尔值
     */
    submitValidate: function(className){
        var me = this;
        var boolean = true;
        //验证区域
        var validateArea = $('.' + className);

        validateArea.find('input, textarea, select').each(function(){
            //表单节点
            var _that = $(this);
            //需要验证的表单条件
            var validateDom = _that.attr('validated');

            //存在需要验证的属性
            if(validateDom){
            //验证规则
                boolean = me.validateRules(_that,className) && boolean;
            }
        });

        console.log(boolean);
        return boolean;
    },

    /**
     * 失去焦点方法
     */
    blurValidate: function(className){
        var me = this;

        //验证区域
        var validateArea = $('.' + className);
        validateArea.find('input, textarea').off('blur').on('blur', function(){
            //表单节点
            var _that = $(this);
            //为空判断
            if(_that.val() == ""){
                return false;
            }

            //需要验证的表单条件
            var validateDom = _that.attr('validated');

            //存在需要验证的属性
            if(validateDom){
            //验证规则
                me.validateRules(_that,className)
            }
        });
    },

    /**
     *验证规则判断
     * @param _that 需要验证的input节点
     * @returns {boolean}
     */
    validateRules: function(_that,className){
        var me = this;
        var boolean = true;
        //将验证规则放到数组中
        var rule = _that.attr('validated').split(' ');
        var value = _that.val();

        //为空验证
        if(rule.indexOf('require') > -1){
            boolean = me.require(_that, value);
        }

        if(rule.indexOf('chooseRequire') > -1){
            boolean = me.chooseRequire(_that, value);
        }

        //邮箱验证
        if(boolean && rule.indexOf('email') > -1){
            boolean = me.email(_that, value);
        }

        //手机验证
        if(boolean && rule.indexOf('telephone') > -1){
            boolean = me.telephone(_that, value);
        }

        //电话验证
        if(boolean && rule.indexOf('phone') > -1){
            boolean = me.phone(_that, value);
        }

        //身份证验证
        if(boolean && rule.indexOf('idCard') > -1){
            boolean = me.idCard(_that, value);
        }

        //确认密码
        if(boolean && rule.indexOf('rePassword') > -1){
            boolean = me.pwd(_that, value,className);
        }

        //下拉框必选
        if(boolean && rule.indexOf('selected') > -1){
            boolean = me.selectMust(_that,value);
        }

        //整型判断
        if(boolean && rule.indexOf('inter') > -1){
            boolean = me.inter(_that,value);
        }
        //密码类型判断
        if(boolean && rule.indexOf('pwdType') > -1){
            boolean = me.pwdType(_that,value);
        }

        if(boolean && rule.indexOf('telOrPhone') > -1){
            boolean = me.telOrPhone(_that,value);
        }


        //只判断格式不判断必填
        if(rule.indexOf('noRequire') > -1){
            boolean = me.noRequire(_that,value);
        }
        return boolean;
    },

    /**
     *为空验证
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */

    require: function(_that, value){
        if(value == ''){
            _that.parent().find('.error').text('请输入' + (_that.attr('msg') || ''));
            return false;
        }

        return true;
    },

    /**
     * 文本框选择验证不能为空
     * @param _that
     * @param value
     * @returns {boolean}
     */
    chooseRequire: function(_that, value){
        if(value == ''){
            _that.parent().find('.error').text('请选择' + (_that.attr('msg') || ''));
            return false;
        }

        return true;
    },

    /**
     * 若验证格式比正确，否则可不输人
     * @param _that
     * @param value
     * @returns {boolean}
     */
    noRequire: function(_that, value){
        if(value == ''){
            _that.parent().find('.error').text('');
            return true;
        }
        return true;
    },

    /**
     *邮箱验证
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */
    email: function(_that, value){
        var emailExc = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/ ;

        if(!emailExc.test(value)){
            _that.parent().find('.error').text('邮箱格式不正确');
            return false;
        }

        return true;
    },

    /**
     * 手机验证
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */
    telephone: function(_that, value){
        var telephoneExc = /^1[2|3|5|7|8|][0-9]{9}$/;

        if(!telephoneExc.test(value)){
            _that.parent().find('.error').text('电话格式不正确');
            return false;
        }

        return true;
    },

    /**
     * 电话验证
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */
    phone: function(_that, value){
        var phoneExc = /^([0-9\-]{5,})?$/;

        if(!phoneExc.test(value)){
            _that.parent().find('.error').text('电话格式不正确');
            return false;
        }

        return true;
    },

    /**
     * 身份证验证
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */
    idCard: function(_that, value){
        var idCardExc = /^([\d]{15}|[\d]{17}[Xx\d])$/;

        if(!idCardExc.test(value)){
            _that.parent().find('.error').text('身份证格式不正确');
            return false;
        }

        return true;
    },

    /**
     * 确认密码
     * @param _that 需要验证的节点
     * @param value 需要验证的值
     * @returns {boolean}
     */
    pwd: function(_that, value,className){
        var values = "";

        //遍历找第一个密码value
        $("."+className).find("input").each(function(){
            var validateDom = $(this).attr('validated');
            if(validateDom){
                var rule = $(this).attr('validated').split(' ');
                if(rule.indexOf("password") > -1){
                    values = $(this).val();
                }
            }
        });
        //console.log(value+"."+values)
        if(value != values){
            _that.parent().find('.error').text('两次密码输入不一致');
            return false;
        }

        return true;
    },

    /**
     * 下拉框必选判断
     * @param _that
     * @param value
     * @returns {boolean}
     */
    selectMust: function(_that, value){
        if(value == "-1"){
            _that.parent().find('.error').text('请选择' + (_that.attr('msg') || ''));
            return false;
        }

        return true;
    },

    /**
     * 整型判断
     * @param _that
     * @param value
     * @returns {boolean}
     */
    inter: function(_that, value){
        var num = /^[1-9][0-9]*$/;
        if(!num.test(value)){
            _that.parent().find('.error').text('只能输入整数(首位不可为0)');
            return false;
        }

        return true;
    },

    /**
     * 密码类型验证
     * @param _that
     * @param value
     * @returns {boolean}
     */
    pwdType: function(_that, value){
        var pwd =/^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]{8,16}$/;
        if(!pwd.test(value)){
            _that.parent().find('.error').text('请输入8-16位包含字母、数字的密码');
            return false;
        }

        return true;
    },


    telOrPhone : function(_that, value){
        var tel = /^((0?1\d{10})|((0(\d{2,3}))[\-]?\d{7,8}))$|^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})$/;
        if(!tel.test(value)){
            _that.parent().find('.error').text('电话格式不正确');
            return false;
        }

        return true;
    }


};

