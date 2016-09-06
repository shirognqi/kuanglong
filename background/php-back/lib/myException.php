<?php
class MyException extends exception{

	public function __construct($message, $code){

		parent::__construct($message, $code);

	}

	public function __toString(){

		$ret = array(
			'ErrorFrom'	=> 'Error from MyException.',
			'code' 		=> $this->code,
			'message' 	=> $this->message,
			'file' 		=> $this->file,
			'line'		=> $this->line,

		);
		return callBack($ret);
	}
}


