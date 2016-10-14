

/**
 * 解决浏览器outerHTML兼容性问题
 *
 **/

if(typeof(HTMLElement)!="undefined" && !window.opera) { 
	HTMLElement.prototype.__defineGetter__("outerHTML",function() { 
		var a=this.attributes, 
		    str="<"+this.tagName, 
		    i=0;
		for(;i<a.length;i++) 
			if(a[i].specified) 
				str+=" "+a[i].name+'="'+a[i].value+'"'; 
		if(!this.canHaveChildren) 
			return str+" />"; 
		return str+">"+this.innerHTML+"</"+this.tagName+">"; 
	}); 
	HTMLElement.prototype.__defineSetter__("outerHTML",function(s) { 
			var r = this.ownerDocument.createRange(); 
			r.setStartBefore(this); 
			var df = r.createContextualFragment(s); 
			this.parentNode.replaceChild(df, this); 
			return s; 
	}); 
	HTMLElement.prototype.__defineGetter__("canHaveChildren",function() { 
		return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase()); 
	}); 
}

var oldRootNodes = false;
var oldStr = false;
var globalInc = 0;
var nodeDiff = function ( inputStr_init, appendTo ) {

	var inputStr = inputStr_init.replace(/(<img )|(<IMG )/g,'<br '); // some browser whill apply source for img nomatter the img tag band to real tag or NOT! if img domCreated,it applys!
	
	if ( inputStr == oldStr ) return;
	var newRootNodes = $( '<div>' + inputStr + '</div>' );
	newRootNodes = subscript(newRootNodes);
	newRootNodes = userNameandTabs(newRootNodes);
	newRootNodes = changeDlDtDd(newRootNodes);

	if ( oldRootNodes === false ) {
		oldRootNodes = newRootNodes;
		oldStr       = inputStr;
		appendTo.html( inputStr_init );
		subscript($('.markdown-body'));
		userNameandTabs($('.markdown-body'));
		changeDlDtDd($('.markdown-body'));
		return ;
	}
	var newNodes  = newRootNodes.children(),
	    oldNodes      = oldRootNodes.children(),
	    newNodeNumber       = newNodes.length,
	    oldNodeNumber       = oldNodes.length;

	if ( newNodeNumber < 3 || oldNodeNumber < 3 ) {
		oldRootNodes = newRootNodes;
		oldStr       = inputStr;
		appendTo.html(newNodes);
		return ;
	}

	var diffHead = 0,
	    diffFoot = 0,
	    i        = 0,
	    headBreakFlag = false,
	    footBreakFlag = false,
	    minLineNum    = Math.min( newNodeNumber, oldNodeNumber);
	while(true){
		if ( headBreakFlag && footBreakFlag ) break;
		if ( !headBreakFlag ) {
			if ( ( diffHead + diffFoot ) < ( minLineNum )){
				if ( typeof(oldNodes.get(i)) == 'undefined' || typeof(newNodes.get(i)) == 'undefined' ) footBreakFlag = true;
				else {
					if ( oldNodes.get(i).outerHTML !== newNodes.get(i).outerHTML ) {
						headBreakFlag = true;
					}
				}
				diffHead = i;
			} else {
				headBreakFlag = true;
			}
		}

		if ( !footBreakFlag ) {
			if ( ( diffHead + diffFoot ) < ( minLineNum ) ) {
				if ( typeof(oldNodes.get(oldNodeNumber-i-1)) == 'undefined' || typeof(newNodes.get(newNodeNumber-i-1)) == 'undefined') {
					footBreakFlag = true;
				} else {
					if ( oldNodes.get(oldNodeNumber-i-1).outerHTML !== newNodes.get(newNodeNumber-i-1).outerHTML ) {
						footBreakFlag = true;
					}
				}
				diffFoot = i;
			} else {
				footBreakFlag = true;
			}
		}
		i++;
	}
	// console.log(diffHead+'-'+diffFoot);
	if ( ( diffHead+diffFoot ) ==  oldNodeNumber ) {
		 // console.log('add');
		var dropStart = diffHead;
		var insertEnd = newNodeNumber-diffFoot-1;
		if ( dropStart ) {
			// 从中间插入
			if ( dropStart != insertEnd ) {
				for (var j = insertEnd; j>= dropStart; j--) {
					appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(j));
				}
			}else{
				appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(dropStart));
			}
		} else {
			// 从头插入
			if ( dropStart != insertEnd ) {
				for (var j = insertEnd; j>= dropStart; j--) {
					appendTo.prepend(newRootNodes.children().eq(j));
				}
			} else {
				appendTo.prepend(newRootNodes.children().eq(dropStart));
			}

		}
	}else if( ( diffHead+diffFoot ) ==  newNodeNumber ) {
			// console.log('delete');
			var dropStart = diffHead;
			var dropEnd   = oldNodeNumber-diffFoot-1;
			// console.log(dropStart+'-'+dropEnd);
			if ( dropStart != dropEnd ){
				var childs = appendTo.children();
				for ( var j =0 ; j<childs.length; j++){
					if(j>=dropStart && j <= dropEnd){
						childs.eq(j).remove();
					}
					if(j>dropEnd) break;
				}	
			}else
				appendTo.children().eq(dropEnd).remove();
	} else {
		// console.log('change');
		var dropStart = diffHead;
		var dropEnd   = oldNodeNumber-diffFoot-1;
		if ( dropStart != dropEnd ){
			var childs = appendTo.children();
			for ( var j =0 ; j<childs.length; j++){
				if(j>=dropStart && j <= dropEnd){
					childs.eq(j).remove();
				}
				if(j>dropEnd) break;
			}
		}else{
			appendTo.children().eq(dropEnd).remove();
		}
		var insertEnd = newNodeNumber-diffFoot-1;

		if(dropStart){
			// 从中间插入
			if ( dropStart != insertEnd ) {
				for (var j = insertEnd; j>= dropStart; j--) {
					appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(j));
				}
			}else{
				appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(dropStart));
			}
		}else{
			// 从头插入
			if ( dropStart != insertEnd ) {
				for (var j = insertEnd; j>= dropStart; j--) {
					appendTo.prepend(newRootNodes.children().eq(j));
				}
			} else {
				appendTo.prepend(newRootNodes.children().eq(dropStart));
			}

		}
	}
	oldRootNodes = $( '<div>' + inputStr + '</div>' );
	oldRootNodes = subscript(oldRootNodes);
	oldRootNodes = userNameandTabs(oldRootNodes);
	oldRootNodes = changeDlDtDd(oldRootNodes);
	oldStr = inputStr;
}



var subscript = function(who){
	var boxSubscripts = [];
	var boxSubscriptsMatch = [];
	var subscriptsCounter = 1;
  	var subscriptsCounterFlag = 0;
	who.children('p').each(function(){
		var inputStr  = $(this).html().split('<br>');
		var x;
		matchTest = false;
		if(inputStr.length>1){
			for(x=0; x<inputStr.length; x++){
				var matchTest = inputStr[x].match(/^( )*\[\^.*?\][:：]/);
				if(matchTest) break;
			}
		}else{
			var matchTest = inputStr[0].match(/^( )*\[\^.*?\][:：]/);
		}

		if(matchTest){
		  var matchSub = matchTest[0].substring(0,matchTest[0].length-1);
      		  matchSub = matchSub.replace(/^[\s]*/g, "");
		  matchBox = {
			'text' : matchSub,
			'id'   : subscriptsCounter
		  };
		  boxSubscriptsMatch.push(matchBox);
		  if(inputStr.length==1){
			var _dom = $(this);
			_dom.html(_dom.html().replace(/^( )*\[\^.*?\][:：]/,'['+subscriptsCounter+'] : '));
			var _href = 'Subscripts_'+subscriptsCounter+'_stpircsbuS';
			_dom.attr('id', _href);
			_dom.attr('name', _href);
			_dom.addClass('sub-script');
			boxSubscripts.push(_dom);
			$(this).remove();
		  }else{
			var _dom = $('<p>'+inputStr[x]+'</p>');
			_dom.html(_dom.html().replace(/^( )*\[\^.*?\][:：]/,'['+subscriptsCounter+'] : '));
			var _href = 'Subscripts_'+subscriptsCounter+'_stpircsbuS';
			_dom.attr('id', _href);
			_dom.attr('name', _href);
			_dom.addClass('sub-script');
			boxSubscripts.push(_dom);
			var dropSpecialHtml = '';
			for(var y =0 ; y<inputStr.length; y++){
				if(y==x) continue;
				var br = '<br>';
				if(y==inputStr.length-1){
					br = '';
				}
				dropSpecialHtml += inputStr[y]+br;
			}
			$(this).html(dropSpecialHtml);
		  }

		  subscriptsCounter++;
      		  if(!subscriptsCounterFlag) subscriptsCounterFlag = 1;
		}
	});
	if(subscriptsCounterFlag){
  	if(who.find(".subscriptLine").length){
		who.find(".subscriptLine").nextAll().remove();
  	}else{
		var subxcriptLine = $('<hr class="subscriptLine">');
		who.append(subxcriptLine);
  	}

	  var i;
	  for(i in boxSubscripts){
  		var box = boxSubscripts[i];
  		who.append(box);
	  }
	  who.children().each(function(){
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
	return who;
};


var userNameandTabs = function( who ) {
	var box = false;
	var i;
	who.children('p').each(function(){
		if(box!==false) return false;
		var inputStr  = $(this).html().split('<br>');
		if(inputStr.length>1){
			for(i=0 ; i<inputStr.length ;i++){
				if(inputStr[i].match(/^[ ]{0,3}\@[\(（].*?[\)）]\[.*?\]/)){
					box = inputStr[i];
					break;
				}
			}
		}else{
			if(inputStr[0].match(/^[ ]{0,3}\@[（\(].*?[\)）]\[.*?\]/)){
				box = inputStr[0];
			}
		}
		if(box){
			if(inputStr.length > 1){
				var _html = '';
				for(var j=0 ; j<inputStr.length; j++){
					if(j==i) continue;
					var br = '<br>';
					if(j == inputStr.length-1){
						br = '';
					}
					_html = _html+inputStr[j]+br;
				}
				$(this).html(_html);
			}else{
				$(this).remove();
			}
			var separt = box.match(/[\)）][ ]*\[/);
			separt = separt[0];
			var first = box.split(separt)[0].split(/[\(（]/)[1];
			var second = box.split(separt)[1].split(/\]/)[0].split('|');
			if(first)
				first = '<span class="author">'+first+'</span>';
			secondHtml = '';
			if(second){    
				var i;
				for(i in second){
					secondHtml += '<span class="tags">'+second[i]+'</span>';
				}
			}
			
			var header = who.children().eq(0);
			if(!header.attr('data_author_tag')){
				var _html = 
					'<div data_author_tag="1" class="artical-info">'+
						'<div class="artical-info-author">'+
							first+
						'</div>'+
						'<div class = "artical-info-tags">'+ 
							secondHtml+
						'</div>'+
						'<div style="clear:both;"></div>'+
					'</div>';
				header.before(_html);
			}
		}
	});
	return who;
} 

var changeDlDtDd = function(who){
  who.children().each(function(){
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
  return who;
}








