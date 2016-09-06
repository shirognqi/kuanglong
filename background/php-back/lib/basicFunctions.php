<?php

function callBack($input,$callback=false){
	
	$callbackStr = false;
	
	if($callback){
		if(is_string($callback))
			$callbackStr = $callbackStr;
	}
	if(!$callbackStr){
		if(isset($GLOBALS['callback'])){
			if(is_string($GLOBALS['callback'])){
				if($GLOBALS['callback'] !== ''){
					$callbackStr = $GLOBALS['callback'];
				}
			}
		}
	}

	if(is_string($input)){
		if($callbackStr)
			return $callbackStr."('".$input."');";
		return $input;
	}
	if(is_object($input) or is_array($input)){
		if($callbackStr)
			return $callbackStr."('".json_encode($input)."');";
		return json_encode($input);
	}
	return ;
}
	
function getInput(array $params){
	if(isset($params['GET'])){
		getParamsFromGET($params['GET']);
	}
	
	if(isset($params['POST'])){
		getParamsFromPOST($params['POST']);
	}
}

function getParamsFromGET($keys){
	if(is_string($keys)){
		if(isset($_GET[$keys]))
			$GLOBALS[$keys] = $_GET[$keys];
	}elseif(is_array($keys)){
		foreach($keys as $key){
			if(isset($_GET[$key]))
				$GLOBALS[$key] = $_GET[$key];
		}      

	}
	unset($_GET);
}

function getParamsFromPOST($keys){
	if(is_string($keys)){
		if(isset($_GET[$keys]))
			$GLOBALS[$keys] = $_POST[$keys];
	}elseif(is_array($keys)){
		foreach($keys as $key){
			if(isset($_POST[$key]))
				$GLOBALS[$key] = $_POST[$key];
		}
	}
	unset($_POST);
}
