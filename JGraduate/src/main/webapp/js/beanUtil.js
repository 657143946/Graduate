/**
 * @fileOverview 寻英项目bean处理工具类
 * 
 * @author chenqianqian(72)
 * @version 1.0.0
 */

var xy_beanUtil =  {
		/**
		 * 自动封装bean
		 * 
		 * @param   {String} prefix    前缀字符串
		 * @param   {Array} attr       需要封装的属性列表
		 * @returns {Object}           生成的bean
		 * 
		 * @see com.dahua.dss.opt.util.beanUtil.addAttr for param 'attr'
		 */
		creatBean: function(prefix, attr)
		{
			var bean = {};
			
			if ( prefix == null )
			{
				prefix = "";
			}
			
			//顺序拼装
			for ( var i = 0, len = attr.length; i < len; i++ )
			{
				if ( !attr[i].domName )
				{
					attr[i].domName = prefix + attr[i].name;
				}
				this.addAttr(bean, attr[i]);
			}
			return bean;
		},
		
		/**
		 * 向bean中添加属性
		 * 
		 * @param {Object}  bean                   目标bean
		 * @param {Object}  attr                   属性
		 * @param {Number}  attr.type              dom节点类型(默认值1) 1:表单元素; 2:单选/多选按钮;3:其它dom元素
		 * @param {String}  attr.domName           节点名称(id or name值)
		 * @param {Boolean} attr.isRemoveEmpty     是否移除空属性标志位,默认false
		 * @param {String}  attr.replaceVal        空值的替代值(不设置则不替换)
		 * @param {String}  attr.value             指定value,有该参数则直接附值
		 */
		addAttr: function(bean, attr)
		{
			if ( !xy_validator.isNull(attr.value) )
			{
				bean[attr.name] = attr.value;
				return;
			}
			
			var type = attr.type || 1;
			var value = null;
			
			//name类型较验
			switch ( type.toString() )
			{
				//表单类型,name对应id
				case "1":
					value = $.trim($("#" + attr.domName).val());
					break;
				
				//单选/复选按钮,name对应name
				case "2":
					var buffer = [];
					$("[name='" + attr.domName + "']").each(function(){
						switch (this.tagName.toUpperCase())
						{
							//标准单/复选框
							case "INPUT":
								if ( $(this).is(":checked") )
								{
									buffer.push($(this).val());
								}
								break;
							
							//自定义单/复选框
							case "CITE":
								if ( $(this).hasClass("checked") )
								{
									buffer.push($(this).attr("value"));
								}
								break;
	
							default:
								break;
						}
					});
					if ( buffer.length > 0 )
					{
						value = buffer.join(",");
					}
					break;
					
				//其它dom节点,name对应id
				case "3":
					value = $.trim($("#" + attr.domName).text());
					break;
					
				default:
					break;
			}
			
			//非空值
			if ( xy_validator.notNullOrEmpty(value) )
			{
				bean[attr.name] = value;
				return;
			}
			
			//已设置移除空属性
			if ( attr.isRemoveEmpty )
			{
				return;
			}
			
			//空值处理
			
			//设置replaceVal
			if ( xy_validator.notNullOrEmpty(attr.replaceVal) )
			{
				bean[attr.name] = attr.replaceVal;
				return;
			}
			
			//按类型设置值
			if ( xy_validator.nullOrEmpty(attr.valType) )
			{
				attr.valType = "string";
			}
			switch (attr.valType) 
			{
				case "number":
					value = 0;
					break;
					
				case "date":
					value = new Date();
					break;
	
				default:
					break;
			}
			
			bean[attr.name] = value;
		},
		//-- addAttr END
		
		/**
		 * 将bean里的属性(批量)写到页面上
		 * @param {Object} bean      目标bean
		 * @param {String} prefix    与页面DOM元素匹配的字符串前缀
		 * @param {Array}  attr      需要写到页面上的属性列表
		 * 
		 * @see com.dahua.dss.opt.util.beanUtil.writeAttr for param 'attr'
		 */
		writeToDom: function(bean, prefix, attr)
		{
			if ( prefix == null )
			{
				prefix = "";
			}
			
			//顺序拼装
			for ( var i = 0, len = attr.length; i < len; i++ )
			{
				if ( !attr[i].domName )
				{
					attr[i].domName = prefix + attr[i].name;
				}
				this.writeAttr(bean, attr[i]);
			}
		},
		
		/**
		 * 将bean里指定的属性写到页面上
		 * 
		 * @param {Object} bean              目标bean
		 * @param {Object} attr              属性参数
		 * @param {String} attr.domName      页面DOM元素名
		 * @param {String} attr.type         页面元素类型,默认值1. 1:表单类型, 2:单选/多选按钮, 3:标准DOM元素
		 * @param {String} attr.name         属性名
		 * @param {String} attr.valType      值类型(默认空值).可选值: "", "date"
		 * @param {String} attr.format       当valType="date"时,显示内容的format格式,默认值"yyyy-MM-dd"
		 */
		writeAttr: function(bean, attr)
		{
			if ( xy_validator.nullOrEmpty(attr.name) )
			{
				return;
			}
			
			var type = attr.type || 1;
			
			//获取 value
			var value = "";
			var names = attr.name.split(".");
			var valueBuffer = bean;
			for ( var i = 0, len = names.length; i < len; i++ )
			{
				if ( valueBuffer[names[i]] != undefined )
				{
					valueBuffer = valueBuffer[names[i]];
				}
				else
				{
					valueBuffer = "";
					break;
				}
			}
			value = valueBuffer;

			if ( xy_validator.nullOrEmpty(attr.valType) )
			{
				attr.valType = "";
			}
			
			//value格式转换
			switch (attr.valType)
			{
				//时间格式
				case "date":
					if ( xy_validator.isEmpty(value) || value == 0 )
					{
						value = "";
					}
					else
					{
						if ( xy_validator.nullOrEmpty(attr.format) )
						{
							attr.format = "yyyy-MM-dd";
						}
						value = new Date(value).format(attr.format);
					}
					
					break;
	
                default:
					break;
			}
			
			//name类型较验
			switch ( type.toString() )
			{
				//表单类型,name对应id
				case "1":
					$("#" + attr.domName).val(value);
					break;
				
				//单选/复选按钮,name对应name
				case "2":
					$("[name='" + attr.domName + "']").attr("checked", false);
					$("[name='" + attr.domName + "']").removeClass("checked");
					
					var valueList = value.toString().split(",");
					for ( var i = 0, len = valueList.length; i < len; i++ )
					{
						var selecter = $("[name='" + attr.domName + "'][value='" + valueList[i] + "']");
						if ( selecter.length == 0 )
						{
							break;
						}
						
						switch (selecter.get(0).tagName.toUpperCase())
						{
							//标准单/复选框
							case "INPUT":
								selecter.attr("checked", true);
								break;
							
							//自定义单/复选框
							case "CITE":
								selecter.addClass("checked");
								break;

							default:
								break;
						}
					}
					
					break;
					
				//其它dom节点,name对应id
				case "3":
                    if(value == -1){
                        value = "";
                    }
					$("#" + attr.domName).text(value);
					//$("#" + attr.domName).attr("title", htmlTitleEncode(value));
					break;
					
				default:
					break;
			}
		},
		//-- writeAttr END
		
		/**
		 * 增加附件列
		 * @param {String} id            页面dom元素ID
		 * @param {Object} data          附件data
		 * @param {String} file          文件名
		 * @param {Boolean} hasDelBtn    是否显示删除按钮(默认显示)
		 */
		addAccessoryRow: function(id, data, file, hasDelBtn)
		{
			var target = $("#" + id);
			
			var li = $("<li>");
			var input = $("<input type='hidden'>");
			input.val(data.id);
			var a = $("<a>");
			a.attr("target", "_blank");
			a.attr("href", "/boc/rest/attach/getAttach/" + data.id + "/" + encodeURI(data.attachName));
			
			//TODO:解决IE下中文显示乱码问题
			if ( file )
			{
				a.text(file);
			}
			else
			{
				a.text(data.attachName);
			}
			
			input.appendTo(li);
			a.appendTo(li);
			
			if ( hasDelBtn !== false )
			{
				var delBtn = $("<ins>");
				delBtn.attr("title", "删除");
				delBtn.on("click", function(){
					$(this).closest("li").remove();
					if ( target.children().length == 0 )
					{
						target.hide();
					}
				});
				delBtn.appendTo(li);
			}
			
			li.appendTo(target);
			target.show();
		},
		
		/**
		 * 获取附件列表
		 * 
		 * @param {String} id    页面dom元素ID
		 * @returns {Array}      附件列表    
		 */
		getAccessoryList: function(id)
		{
			var list = [];
			$("#"+id).find("input:hidden").each(function(){
				list.push({
					id: $(this).val()
				});
			});
			return list;
		}
};