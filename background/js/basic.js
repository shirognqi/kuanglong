var oldRootNodes = false;
var oldStr = false;
var nodeDiff = function ( inputStr, appendTo ) {
	if ( inputStr == oldStr ) return;
	var newRootNodes = $( '<div>' + inputStr + '</div>' );
	if ( oldRootNodes === false ) {
		oldRootNodes = newRootNodes;
		oldStr       = inputStr;
		appendTo.html( inputStr );
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
	if ( ( diffHead+diffFoot ) ==  oldNodeNumber ) {
		var dropStart = diffHead;
		var insertEnd = newNodeNumber-diffFoot-1;
		if ( dropStart ) {
			// 从中间插入
			if ( dropStart != insertEnd ) {
				appendTo.children().eq(diffHead-1).after(newRootNodes.children(':gt(' + (dropStart-1) + '):lt(' + (insertEnd-dropStart+1) + ')'));
						}else{
						appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(dropStart));
						}
						} else {
						// 从头插入
						if ( dropStart != insertEnd ) {
						appendTo.prepend(newRootNodes.children(':gt(' + (dropStart-1) + '):lt(' + (insertEnd-dropStart+1) + ')'));
								} else {
								appendTo.prepend(newRootNodes.children().eq(dropStart));
								}

								}
								}else if( ( diffHead+diffFoot ) ==  newNodeNumber ) {
								var dropStart = diffHead;
								var dropEnd   = oldNodeNumber-diffFoot-1;
								if ( dropStart != dropEnd )
								appendTo.children(':gt(' + (dropStart-1) + '):lt(' + (dropEnd-dropStart+1) + ')').remove();
										else
										appendTo.children().eq(dropEnd).remove();
										} else {
										var dropStart = diffHead;
										var dropEnd   = oldNodeNumber-diffFoot-1;
										if ( dropStart != dropEnd )
										appendTo.children(':gt(' + (dropStart-1) + '):lt(' + (dropEnd-dropStart+1) + ')').remove();
												else
												appendTo.children().eq(dropEnd).remove();
												var insertEnd = newNodeNumber-diffFoot-1;

												if(dropStart){
												// 从中间插入
												if ( dropStart != insertEnd ) {
												appendTo.children().eq(diffHead-1).after(newRootNodes.children(':gt(' + (dropStart-1) + '):lt(' + (insertEnd-dropStart+1) + ')'));
														}else{
														appendTo.children().eq(diffHead-1).after(newRootNodes.children().eq(dropStart));
														}
														}else{
														// 从头插入
														if ( dropStart != insertEnd ) {
														appendTo.prepend(newRootNodes.children(':gt(' + (dropStart-1) + '):lt(' + (insertEnd-dropStart+1) + ')'));
																} else {
																appendTo.prepend(newRootNodes.children().eq(dropStart));
																}

																}
																}
																oldRootNodes = $( '<div>' + inputStr + '</div>' );
																oldStr = inputStr;
																}
