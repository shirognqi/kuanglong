
/**
 * 获取浏览器中的代码块；
 *
 **/
function strToSepcial(input){
  var output = input.replace(/>/g,"_@-_@-g-r-e-a-t-t-h-e-n-@_-@_");
  output     = output.replace(/</g,"_@-_@-s-m-a-l-l-e-r-t-h-e-n-@_-@_");
  output     = output.replace(/&/g,"_@-_@-a-n-d-t-h-e-n-@_-@_");
  return output;
}
function specialToNormalStr(input){
  var output = input.replace(/_@-_@-g-r-e-a-t-t-h-e-n-@_-@_/g,">");
  output     = output.replace(/_@-_@-s-m-a-l-l-e-r-t-h-e-n-@_-@_/g,"<");
  output     = output.replace(/_@-_@-a-n-d-t-h-e-n-@_-@_/g,"&");
  return output;
}
function strTologic(input){
  var output = input.replace(/&/g,"&amp;");
  output     = output.replace(/>/g,"&gt;");
  output     = output.replace(/</g,"&lt;");

  return output;
}

var inputStr;
function getInput(){
  inputStr = '';
	// 整理输入
	var oriStr            = editor.getMarkdown();
	var oriStrTabtoSpace4 = oriStr.replace(/\t/g,'    ');
	var dropRightSpace 	  = oriStrTabtoSpace4.replace(/( )*\n$/g,'\n');
	var oriStrSpaceLinetoEmptyLine = dropRightSpace.replace(/\n\s*?\n/g,'\n\n');
	inputStr = '\n\n'+oriStrSpaceLinetoEmptyLine;
  var supScriptBox = inputStr.match(/\n\[\^.*?\].*?\n/g);
  for(i in supScriptBox){
    inputStr = inputStr.replace(supScriptBox[i],'\n')+supScriptBox[i];
  }
	// 去掉大块的代码段
	var bigBlocks = inputStr.match(/(\n```[\s\S]*?```\n)|([\n][\n][ ]{4}[\s\S]*?[\n]([\w_-]|\/|>|<|=|\\|\*|:|\||\?|\.|,|;|\[|\]|\{|\}|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|~|`|((\s){1,3}\S)))|(<pre[\s\S]*?(<\/pre>))/g);
	var mathBlockKeyWords = ['math', 'katex', 'latex'];
	var flowBlockKeyWord  = 'flow';
	var seqBlockKeyWord   = 'seq';
	var seqBlockKeyWord2  = 'sequence';
	var codeBlock = [],
		flowBlock = [],
		seqBlock  = [];
	var i;
	for(i in bigBlocks){
	  var charBlock = bigBlocks[i];
	  var charBlockType = charBlock.match(/^(\n```[\s\S]*?\n)/);
	  if(charBlockType){
		var type = charBlockType[0].replace(/\n/g,'').replace('```','');
		if(!type) type = null;
		if($.inArray(type,mathBlockKeyWords) != -1) continue;
		var innerHTMLWithCovers = charBlock;
		inputStr = inputStr.replace(innerHTMLWithCovers,'');
		var dropLastBreak       = charBlock.replace(/(\n)*$/,'');
		var innerHTMLDropCovers = dropLastBreak.replace(/\n```[\s\S]*?\n/g,'');
		innerHTMLDropCovers     = innerHTMLDropCovers.substr(0,innerHTMLDropCovers.length-3);
		innerHTMLDropCovers     = innerHTMLDropCovers.replace(/(\n)*$/,'');
		if(type === flowBlockKeyWord){
		  innerHTMLDropCovers     = strToSepcial(innerHTMLDropCovers);
		  flowBlock.push(innerHTMLDropCovers);
		}else if(type === seqBlockKeyWord || type === seqBlockKeyWord2){
		  innerHTMLDropCovers     = strToSepcial(innerHTMLDropCovers);
		  seqBlock.push(innerHTMLDropCovers);
		}else{
		  codeBlock.push({
			type : type,
			innerHTML : innerHTMLDropCovers
		  });
		}
	  }else{
		var preStart = charBlock.match(/^(<pre>)/i);
		if(preStart){
		  var blankcode = charBlock.replace(/^(<pre>)/i,'');
		  blankcode = blankcode.replace(/(<\/pre>)$/i,'');
		}else{
		  var blankcode = charBlock.replace('\n','').replace(/\n[\s]{4}/g,'\n');
		  blankcode = blankcode.replace(/^\n/,'');
		  blankcode = blankcode.substr(0,blankcode.length-3);
		  //blankcode = strToSepcial(blankcode);
		}
		codeBlock.push({
		  type : null,
		  innerHTML : blankcode
		});
	  }
	}
	// 替换flowchart
	$(".editormd-preview-container div.flowchart").each(function(index,element){
	  var flowHTML = flowBlock.shift();
	  $(element).html(flowHTML);
	});
	// 替换sequence-diagram
	$(".editormd-preview-container div.sequence-diagram").each(function(index,element){
	  var seqHTML = seqBlock.shift();
	  $(element).html(seqHTML).removeClass().addClass('diagram');
	});
	// 替换代码高亮
	$(".editormd-preview-container .prettyprint").each(function(index,element){
	  var codeInfo = codeBlock.shift();
	  if(codeInfo.type){
		var typeTest = codeInfo.type.replace(/(^[-_,]*)|([-_,]*$)/g,'').split(/[-_,]/);
		var codeType = 'LONG';
		var codeName = 'php';
		if(typeTest.length >2) return false;
		if(typeTest.length == 2){
		  var typeTry0 = typeTest[0].toUpperCase();
		  var typeTry1 = typeTest[1].toUpperCase();
		  if(typeTry0 == 'SHORT' || typeTry0 == 'LONG'){
			codeType = (typeTry0 == 'SHORT')? 'SHORT' :'LONG';
			codeName = typeTest[1];
		  }else if(typeTry1 == 'SHORT' || typeTry1 == 'LONG'){
			codeType = (typeTry1 == 'SHORT')? 'SHORT' : 'LONG';
			codeName = typeTest[0];
		  }
		}else if(typeTest.length == 1){
		  codeName = typeTest[0];
		}
		if(codeType == 'SHORT'){
		  var code = strTologic(codeInfo.innerHTML);
		  var codeHTML = $('<code><code>').attr('data-language',codeName).html(code);
		  $(this).removeClass().addClass('shot-code-block').addClass(codeName).html('').append(codeHTML);
		}else{
		  var code = strTologic(codeInfo.innerHTML);
		  $(this).removeClass().addClass('brush: '+codeName+';').addClass('long-code-block').html(code);
		}
	  }else{
		var code = strTologic(codeInfo.innerHTML);
		$(element).removeClass().addClass('shell').html(code);
	  }
	});

	var mathBlock = [];
	var maths = inputStr.match(/(\n```(math|katex|latex)[\s\S]*?```\n)|(\$\$[\s\S]*?\$\$)/g);
	for(i in maths){
	  var _math = maths[i];
	  var mathType = _math.match(/^(\n```[\s\S]*?\n)/);
	  if(mathType){
		_math = _math.replace(/^(\n```[\s\S]*?\n)/,'');
		_math = _math.replace(/```\n/,'');
		_math = _math.replace(/\n*$/,'');
	  }else{
		_math = _math.replace(/\$\$/g,'');
	  }
	  _math   = strToSepcial(_math);
	  _math   = _math.replace(/\\\(/g,'(');
	  _math   = _math.replace(/\\\)/g,')');
	  mathBlock.push(_math);
	}
	$(".editormd-preview-container .editormd-tex").each(function(index,element){
	  var _math = mathBlock.shift();
	  if($(element).is('span')){
		_math = ' '+_math+' ';
		$(element).removeClass().addClass('math').text(_math);
	  }else{
		_math = '\n'+_math+'\n';
		var newElement = $('<div class="math"></div>').text(_math);
		$(element).after(newElement);
		$(element).remove();
	  }
	});
	$('table').addClass('table table-hover table-striped');
	$(".editormd-preview-container").find("span.header-link.octicon.octicon-link").remove()
	$(".editormd-preview-container").find("a.reference-link").removeAttr('class');
	var ret = $('.editormd-preview-container').html();

	ret = specialToNormalStr(ret);
	var position = editor.getCursor();
	editor.insertValue(" ");
	editor.setSelection({line:position.line, ch:position.ch}, {line:position.line, ch:(position.ch+1)});
	editor.replaceSelection("");
	return ret;

};

var addSubscriptLine = function(){
  if($(".markdown-body .subscriptLine").length){
	$(".markdown-body .subscriptLine").nextAll().remove();
  }else{
	var subxcriptLine = $('<hr class="subscriptLine">');
	$(".editormd-preview-container").append(subxcriptLine);
  }
}



$(window).resize(function() {
  $("#kuanglong-editor").css("height",$(window).height()+"px");
});
var imgCallback = function(data){
	console.log(data);
}

var myPaster = function(){
	var paster = $(".CodeMirror-wrap").find("textarea");
	if(!paster) return ;
	paster.unbind('paste');
	paster.bind('paste',function(e){return false;});

	paster.on('focus', function(){}).pastableTextarea().on('blur', function(){});

	paster.on('pasteImage', function(ev, data){
		var postAddress = "/kuanglong/background/php-back/imgGetter.php";
		var postData = {
			'imgBase64': data.dataURL,
			'fileName' : Date.parse(new Date())+'_'+data.width+'x'+data.height
		};
		$.post(postAddress, postData, function(data,status){
			var imgUrl = './uploadImgs/'+$.parseJSON(data).fileName;
			editor.insertValue('![来自剪切板图片]('+ imgUrl +')');

		});
	}).on('pasteImageError', function(ev, data){
	}).on('pasteText', function(ev, data){
		editor.insertValue(data.text);
	});
}

function saveLocal(){
	simpleStorage.set('content',editor.getMarkdown());
	var tittle = '请输入标题';
	if($(".add-tittle")){
		if($(".add-tittle").html() !== ''){
			tittle = $(".add-tittle").html();
		}
	}
	simpleStorage.set('tittle', tittle);
}

function isImgFileExtension(inputStr){
	
	if(typeof(inputStr)  != 'string' ) return false;
	
	var getExtension = inputStr.split('.');
	if(getExtension.length<=1) return false;

	var fileExtension = getExtension[getExtension.length-1];
	if(typeof(fileExtension)  != 'string' ) return false;
	fileExtension = fileExtension.toUpperCase();
	
	var IMGExtensions = {
		'BMP' : 1,
		'JPG' : 2,
		'JPEG': 3,
		'PNG' : 4,
		'GIF' : 5,
		'APNG': 6
	};

	if(IMGExtensions[fileExtension]) return true;

	return false;
}

function imgLodingError(who){
	var isIMG;
	if(typeof(who.src) != 'string') {
		isIMG = false;
	}else if(who.src == ''){
		isIMG = false;
	}else{
		isIMG = isImgFileExtension(who.src);
	}
	console.log(isIMG);
	if ( isIMG ) {
		who.src='./images/imgLinkBroken.jpeg';
		$(who).css({height:'80px',width:'80px'});
		return false;
	} else {

		var fileSrc = $(who).attr('src'),

		fileInfo = fileSrc.replace(/\\/g,'/').split('/'),

		i=fileInfo.length-1,

		fileName = '';

		while(i>=0){
			fileName = fileInfo[i];
			if(fileName !== '') break;
			i--;
		}

		fileName = (fileName == '') ? '为命名文件':fileName;
		var subFileName = fileName;
		if(fileName.length>12){
			subFileName = fileName.substr(0,12)+'...';
		}
		var _html = 
			'<a href="'+fileSrc.replace(/\\/g,'/')+'" title="下载文件：'+fileName+'"  class="attachment-placeholder download-href-no-line" download="'+fileName+'" target="_blank">'+
				'<i class="icon-file-code download-big-fount-size"></i>'+
				'<span class="download-fileInfo">'+
					'<span class="file-name">'+subFileName+'</span>'+
					'<br>'+
					'<span class="file-size">0.6 KB</span>'+
				'</span>';
			'</a>';
		$(who).after(_html);
		$(who).remove();

	}
}

function changeSpecialImg(who){
	who.find('br[src]').each(function(){
		$(this).after($(this).get(0).outerHTML.replace(/(<br )|(<BR )/g,'<img '));
		$(this).remove();
	});
}

function blockquoteFooter(who){
	who.children('blockquote').each(function(){
		if($(this).children().length>1) return ;
		var _html = $(this).children().eq(0).html();
		var A = _html.indexOf('-&gt;-&gt;') != -1;
		var C = _html.indexOf('-》-》') != -1;

		if ( A || C ) {
			var sp    = (A) ? '-&gt;-&gt;' : '-》-》';
			var splen = (A) ? 10 : 4;
			var tail = _html.substring(_html.lastIndexOf(sp)+splen).trim();
			var head = _html.substring(0,_html.lastIndexOf(sp)).trim();
			if(tail && head){
				tail = '<footer class="blockquote-reverse">'+tail+'</footer>';
				$(this).children().eq(0).html(head).after(tail);
			}
		} else {

			var B = _html.indexOf('-&lt;-&lt;') != -1;
			var D = _html.indexOf('-《-《') != -1;
			if ( B || D ) {
				var sp    = (B) ? '-&lt;-&lt;' : '-《-《';
				var splen = (B) ? 10 : 4;
				var tail = _html.substring(_html.lastIndexOf(sp)+splen).trim();
				var head = _html.substring(0,_html.lastIndexOf(sp)).trim();
				if(tail && head){
					tail = '<footer>'+tail+'</footer>';
					$(this).children().eq(0).html(head).after(tail);
				}    
			}
		} 

	});

}





