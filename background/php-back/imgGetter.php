<?php

require(dirname(__FILE__).'/start.php');

class imgGetter{

	public $errMap = array(
		0  => 'OK',
		-1 => 'param \'imgBase64\'lost.',
		-2 => 'param \'fileName\'lost.',
	);


	public function __construct(){
		$err = new myError();
		$err->setErrorMap($this->errMap);
		$inputKeys = array(
			'POST' => array(
				'callback',
				'imgBase64',
				'fileName'
			)
		);
		getInput($inputKeys);
		if(!isset($GLOBALS['imgBase64'])){
			echo $err->getErrorMessage(-1);
			Exit;
		}
		if(!isset($GLOBALS['fileName'])){
			echo $err->getErrorMessage(-2);
			Exit;
		}
	}
	public function imgToFile(){
		$day = date("Y-m-d");
		if(!is_dir(UPLOADIMGDIR.$day)){
			mkdir (UPLOADIMGDIR.$day, 0777);
		}
		$base64   = $GLOBALS['imgBase64'];
		$fileName = $GLOBALS['fileName'];

		$base64_depart = explode(',',$base64);
		$base64_boy = $base64_depart[1];

		$fileType = explode('/',$base64_depart[0])[1];
		$fileType = explode(';',$fileType)[0];
		$fileLocation = UPLOADIMGDIR.$day.'/'.$fileName.'.'.$fileType;
		$data= base64_decode($base64_boy);
		file_put_contents($fileLocation,$data);
		$ret = new stdClass;
		$ret->fileName= $day.'/'.$fileName.'.'.$fileType;
		echo json_encode($ret);
	}
}

$a = new imgGetter();
$a->imgToFile();







