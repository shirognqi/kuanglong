var global_title = '请输入标题';
var editor;
$(function() {
	editormd.katexURL = {
		js  : "katex/katex.min",
		css : "katex/katex.min"
	};
	editor = editormd("kuanglong-editor", {
		width  : "100%",
		height : $(window).height()+"px",
		path   : 'lib/',
		htmlDecode : true,
		tex    : true,
		flowChart  : true,
		sequenceDiagram : true,
		taskList : true,
		delay : 1000,
		lineNumbers: false,
		toolbarIcons : function() {
			return ["undo","redo","|",
			"bold","del","italic","quote","ucwords","uppercase","lowercase","|",
			"h1","h2","h3","|",
			"list-ul","list-ol","hr","|",
			//"link","reference-link","image","code","preformatted-text","code-block","table","datetime","html-entities","pagebreak","|",
			"link","reference-link","image","code","preformatted-text","code-block","table","datetime","html-entities","|",
			//"goto-line","linenumber","watch","preview","fullscreen","clear","search",
			"goto-line","linenumber","watch","preview",
			"tittle"
			];
		},
		// toolbarIconTexts : {
			//   tittle : "文章标题"
			// },
		toolbarIconsClass : {
			tittle : "add-tittle",
			linenumber : "linenumber"
		},
		toolbarHandlers : {
			/**
			* @param {Object}      cm         CodeMirror对象
			* @param {Object}      icon       图标按钮jQuery元素对象
			* @param {Object}      cursor     CodeMirror的光标对象，可获取光标所在行和位置
			* @param {String}      selection  编辑器选中的文本
			*/
			tittle : function(cm, icon, cursor, selection) {
				if(!$('#global_title').length){
					icon.parent().hide();
					if(icon.attr('title')){
						var content = icon.attr('title');
						}else{
						var content = icon.html();
					}
					icon.parent().after('<input id="global_title" class="form-control" type="text" value="'+content+'" />');
					setTimeout(function(){
						$('#global_title').focus();
						$('#global_title').select();
						$('#global_title').blur(function(){
							icon.parent().show(20);
							var title = $('#global_title').val();
							title = title.replace(/^\s*/g,'');
							title = title.replace(/\s*$/g,'');
							title = title?title:'请输入标题';
							global_title = title;
							if(global_title.length>15){
								icon.html(global_title.substr(0,15)+'...');
								}else{
								icon.html(global_title);
							}
							icon.attr('title',global_title);
							$('#global_title').remove();
						});
					},10);
				}
			},
			linenumber : function(cm, icon, cursor, selection){

			}
		},
		onchange : function() {
			subscript();
			changeDlDtDd();
			userNameandTabs();
		},
		htmlDecode : "head,body,meta,link,param,style,script,iframe",
		onload : function() {
			// 显示行号！
			$(".add-tittle").html(global_title);
			$('.linenumber').parent().attr('title','显示行号');
			var lineNumberFun = function(){
				var icon = $(this);
				if(icon.hasClass('line-number-active')){
					editor.config("lineNumbers", false);
					$('.linenumber').removeClass('line-number-active');
					$('.linenumber').parent().css({border: '',background: ''}).attr('title','显示行号');
					}else{
					editor.config("lineNumbers", true);
					$('.linenumber').addClass('line-number-active');
					$('.linenumber').parent().css({border: '1px solid #ddd',background: '#eee'}).attr('title','去掉行号');

				}
				if(global_title.length>15){
					$(".add-tittle").html(global_title.substr(0,15)+'...');
					}else{
					$(".add-tittle").html(global_title);
				}
				$(".add-tittle").attr('title',global_title);
				$('.linenumber').unbind('click');
				$('.linenumber').bind('click',lineNumberFun);
			};
			$('.linenumber').bind('click',lineNumberFun);
			// 粘贴插件
			myPaster();
			// 改变色彩
			$('.markdown-body').css({'background-color':'#f9fafb'});
			// 本地缓存
			
			var content = simpleStorage.get('content');
			if(content){
				editor.insertValue(content);
			}

			
			setInterval("saveLocal()",90000);
			

		}
	});
});
