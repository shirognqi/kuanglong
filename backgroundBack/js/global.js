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
		}else if(type === seqBlockKeyWord){
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

  // var position = editor.getCursor();
  // editor.insertValue(" ");
  // editor.setSelection({line:position.line, ch:position.ch}, {line:position.line, ch:(position.ch+1)});
  // editor.replaceSelection("");
	// return ret;

};

var subscript = function(){
	var addSubscriptLine = function(){
	  if($(".markdown-body .subscriptLine").length){
		$(".markdown-body .subscriptLine").nextAll().remove();
	  }else{
		var subxcriptLine = $('<hr class="subscriptLine" style="border:1px dashed #000;">');
		$(".editormd-preview-container").append(subxcriptLine);
	  }
	}
	var boxSubscripts = [];
	var boxSubscriptsMatch = [];
	var subscriptsCounter = 1;
  var subscriptsCounterFlag = 0;
	$(".markdown-body").children('p').each(function(){
		var matchTest = $(this).text().match(/^( )*\[\^.*?\][:：]/);
		if(matchTest){
		  var matchSub = matchTest[0].substring(0,matchTest[0].length-1);
      matchSub = matchSub.replace(/^[\s]*/g, "");
		  matchBox = {
			'text' : matchSub,
			'id'   : subscriptsCounter
		  };
		  boxSubscriptsMatch.push(matchBox);
		  var _dom = $(this);
		  _dom.html(_dom.html().replace(/^( )*\[\^.*?\][:：]/,'['+subscriptsCounter+'] : '));
		  var _href = 'Subscripts_'+subscriptsCounter+'_stpircsbuS';
		  _dom.attr('id', _href);
		  _dom.attr('name', _href);
		  boxSubscripts.push(_dom);
		  $(this).remove();
		  subscriptsCounter++;
      if(!subscriptsCounterFlag) subscriptsCounterFlag = 1;
		}
	});
	if(subscriptsCounterFlag){
	  addSubscriptLine();
	  var i;
	  for(i in boxSubscripts){
  		var box = boxSubscripts[i];
  		$(".markdown-body").append(box);
	  }
	  $(".markdown-body").children().each(function(){
  		var i;
  		for(i in boxSubscriptsMatch){
  			var matchTest = $(this).text().indexOf(boxSubscriptsMatch[i]['text']);
  			if(matchTest>=0){
  			  var subscriptsMatch = boxSubscriptsMatch[i];
  			  var after  = $(this).html().substring($(this).html().lastIndexOf(subscriptsMatch['text']));
  			  var before = $(this).html().substring(0,$(this).html().lastIndexOf(subscriptsMatch['text']));
  			  var after  = after.replace(subscriptsMatch['text'],'<sup><a href="#Subscripts_'+subscriptsMatch['id']+'_stpircsbuS">['+subscriptsMatch['id']+']</a></sup>');
  			  $(this).html(before+after);
  			}
  		}
	  });
	}
};

var changeDlDtDd = function(){
  $(".editormd-preview-container").children().each(function(){
      var nextchild = '';
      var x = $(this).html().match(/<br>[\:：]\s/gi);
      if(x){
          var tempStr = $(this).html();
          for(var i in x){
              tempStr = tempStr.replace(x[i],'<_R-B-_BREAK_-B-R_>');
          }
          var centensArr= tempStr.split('<br>');
          for(var i in centensArr){
              var dldtArr = centensArr[i].split('<_R-B-_BREAK_-B-R_>');
              var firstFlag = true;
              for(var j in dldtArr){
                  if(firstFlag){
                     firstFlag=false;
                     nextchild = nextchild + '<dt>'+dldtArr[j]+'</dt>';
                  }else{
                     nextchild = nextchild + '<dd>'+dldtArr[j]+'</dd>';
                  }
              }
          }
          nextchild  = '<dl>'+nextchild+'</dl>';
          $(this).before(nextchild);
          $(this).remove();
      }
  });
}

$(window).resize(function() {
  $("#kuanglong-editor").css("height",$(window).height()+"px");
});

var myPaster = function(){
	var paster = $(".CodeMirror-wrap").find("textarea");
	if(!paster) return ;
	paster.unbind('paste');
	paster.bind('paste',function(e){return false;});

	paster.on('focus', function(){}).pastableTextarea().on('blur', function(){});

	paster.on('pasteImage', function(ev, data){
		  var blobUrl = URL.createObjectURL(data.blob);
		  var html_str = '<div class="result">image: '+
			data.width+
			'x'+
			data.height+
			'<img src="' + data.dataURL +'" >'+
			'<a href="' + blobUrl + '">'+blobUrl +'</a>'+
		  '</div>';
			
			editor.insertValue('![剪切板图案2]('+blobUrl+')');
			console.log(html_str);

	}).on('pasteImageError', function(ev, data){
//		var html_str = 'Oops: ' + data.message;
//		if(data.url){
//			html_str += '\n'+ 'But we got its url anyway:' + data.url;
//			
//			editor.insertValue('![剪切板图案3]('+data.url+')');
//		}
//		console.log(html_str);
	}).on('pasteText', function(ev, data){
		editor.insertValue(data.text);
		//var html_str = 'text: ' + data.text;
		//console.log(html_str);
	});
}
