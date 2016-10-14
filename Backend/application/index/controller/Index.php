<?php

namespace app\index\controller;

use \think\Request;
use \think\Exception;
use \think\Response;

class Index{

	private $stateMap = [
		0  => 'OK',
		-1 => '错误码必须为整数，正负均可；',
		-2 => '输入缺少imgBase64或fileName参数；',
		-3 => '剪切板的目标路径存在未知问题；',
		-4 => '剪切板的目标路径不存在',
		-5 => '剪切板的目标路径不可写入',
		-6 => '请定义剪切板的目标路径',
	];

	private function createEextptionFromStateMap($code, $message = false){

		if(is_int($code))
			$code_ = $code;
		else
			$code_ = -1;

		$msg_ = false;
		
		if($message !== false){
			if(is_string($message))
				if($message)
					$msg_ = $message;
		}elseif(isset($this->stateMap[$code])){
			$msg_ = $this->stateMap[$code];
		}
		
		if($msg_ === false) $msg_ = '未输入错误信息;';

		throw new Exception($msg_, $code_);
		EXIT;
	}

	public function index(){
	
		
		$inputParamsIsOK = $this->inputTest();
		
		if(!$inputParamsIsOK) {
			$this->createEextptionFromStateMap(-2);
		}

		
		$enventOK = $this->targetDirTest();
		
		if(!$enventOK) {
			$this->createEextptionFromStateMap(-3);
		}
		$imgData  = Request::instance()->post('imgBase64');
		$fileName = Request::instance()->post('fileName');
		
		$imgInfo  = $this->imgDataHandler( $imgData ); // keys=>[ imgData, fileType ];
		
		$fileNameExtend = $fileName . '.' . $imgInfo['fileType'];
		
		$targetFile 	= config('Clipboard_Img_Dir').$this->subDirName . '/' . $fileNameExtend;

		file_put_contents( $targetFile, $imgInfo['imgData'] );
		
		$ret = new \stdClass();

		$ret->fileName = $this->subDirName . '/' . $fileNameExtend;

		echo json_encode($ret);

 	}
	/**
	  * the data from ClipBoard is like that: 
	  * base64/jpeg;,xxxxxxxxxxxx(Base64Encode)
	  *
	  */

	private function imgDataHandler( $imgData ){
		
		$imgInfo 	= explode(',',$imgData);
		
		$mimeTyepInfo 	= $imgInfo[0];
		$imgDataBase64	= $imgInfo[1];
		
		
		$fileTypeInfo	= explode( '/', $mimeTyepInfo)[1];
		$fileType	= explode( ';', $fileTypeInfo)[0];
		
		
		$imgData 	= base64_decode($imgDataBase64);
		return [
			'fileType' 	=> $fileType,
			'imgData' 	=> $imgData
		];


	}



	private function inputTest(){
		$paramReq1 = Request::instance()->has('imgBase64','post');
		$paramReq2 = Request::instance()->has('fileName','post');
		return $paramReq1 && $paramReq2;
	}

	private $subDirName = null;

	private function targetDirTest(){
		
		$Clipboard_Img_Dir = config('Clipboard_Img_Dir');
		
		if(!$Clipboard_Img_Dir) $this->createEextptionFromStateMap(-6);

		if(!is_dir($Clipboard_Img_Dir)) $this->createEextptionFromStateMap(-4);


		$fp = @dir($Clipboard_Img_Dir);
		if ($fp === false)
			$this->createEextptionFromStateMap(-5); // 目录不可写
		unset($fp);
		
		$subDirName 	= date("Y-m-d");
		$realLocation 	= $Clipboard_Img_Dir.$subDirName;
		if( !is_dir( $realLocation ) ){
			if( mkdir ($realLocation, 0777) ) {
				$this->subDirName = $subDirName;
				return true;
			}
			return false;
		}
		$this->subDirName = $subDirName;
		return true;
	}



}
