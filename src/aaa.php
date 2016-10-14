<?php

// 生成递归的数组或对象
function getPool($keyarr, $value, $type){
	$key = array_pop($keyarr);
	// 对象迭代
	if($type == 'obj'){
		$pool = new stdClass();
		$pool->$key = $value;
		while(count($keyarr)) {
			$key = array_pop($keyarr);
			$tempObj = new stdClass();
			$tempObj->$key = $pool;
			$pool = $tempObj;
		}
	}else{
	// 数组迭代
		$pool = array($key => $value);
		while(count($keyarr)) {
			$key = array_pop($keyarr);
			$pool = array($key => $pool);
		}
	}
	return $pool;
}


function set( &$obj, $keyArr, $value, $type = 'obj' ) {
	$key = array_shift($keyArr);
	// 依然有键位剩余，尝试进行递归
	if( count($keyArr)>=1 ){
		// 当前复合元素是对象
		if( is_object( $obj ) ) {
			if( isset( $obj->$key ) ) {
				if ( is_array($obj->$key) || is_object($obj->$key) ) {
					// 当前子元素允许递归，继续
					return set($obj->$key, $keyArr, $value, $type);
				}
			}
			// 当前子元素不允许递归，生成递归子元素，覆盖原有的子元素
			$obj->$key = getPool($keyArr, $value, $type);
		// 当前复合元素是数组，下面的逻辑和对象一样，不在重复；
		} elseif( is_array( $obj ) ) {
			if( isset($obj[$key]) ) {
				if ( is_array($obj[$key]) || is_object($obj[$key]) ) {
					return set($obj[$key], $keyArr, $value, $type);
				}
			}
			$obj[$key] = getPool($keyArr, $value, $type);
		}
	} else {
		// 没有剩余键位，如果当前元素是数组或对象则插入元素； 
		if(is_object($obj)) $obj->$key = $value;
		elseif(is_array($obj))  $obj[$key] = $value;
		else return false;
		return true;
	}

}



function arrayillegalTest( $arr ) {
	
	if( !is_array($arr) ) return false;
	
	foreach($arr as $v) {
		if( !is_string($v) ) return false;
		if( $v === '' ) return false;
	}
	return true;
	
}

function smartySet(&$obj, $setArr, $type = 'obj'){
	foreach($setArr as $k => $v) {
		$keyArr = breakKeyByPoint($k);
		set($obj, $keyArr, $v, $type);
	}
}






