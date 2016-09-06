<?php

class myError{

	public $errorMap = array();
	
	public function setErrorMap(array $errorMap){
		$this->errorMap = $errorMap;
	}
	
	public function getErrorMessage($errorCode, $errorMessage = false){
		if(!is_int($errorCode)){
			$errorMsg = 'param \'errorCode\' mast be an number.';
			throw new exception($errorMsg);
			return ;
		}
		$message = '';
		if($errorMessage === false){
			if(isset($this->errorMap[$errorCode])){
				$message = $this->errorMap[$errorCode];
			}
		}else{
			$message = $errorMessage;
		}
		$ret = new stdClass();
		$ret->doce 	= $errorCode;
		$ret->message 	= $message;
		return callBack($ret);
	}
}
