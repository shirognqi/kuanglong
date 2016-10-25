<?php
namespace app\index\controller;

use \think\Request;
use \think\Exception;
use \think\Response;
use \think\Loader;


class Middlepage {


	private $stateMap = [
		0  => 'OK',
		-1 => '错误码必须为整数，正负均可；',
		-2 => '输入缺少content或title参数；',
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

//		// 这个接口没有防刷策略，请注意防刷；
//
//		$inputParamsIsOK = $this->inputTest();
//		
//		if(!$inputParamsIsOK) {
//			$this->createEextptionFromStateMap(-2);
//		}
//
//		$content = Request::instance()->post('content');
//
//		$title   = Request::instance()->post('title');
//
//		$title = ($title !== '') ?: '未输入标题';
//		
//
//		$contentOK = $this->inputTester($content);
//
//		$titleOK   = $this->inputTester($tittle);
//
//		if($contentOK && $titleOK){
//						
//		}
		// $i=Db::table('Persons')->where('Id_P',1)->find();
		// print_($i);
//		$middlePage = model('Middlepage');
//		$i = $middlePage->getName(0);
//		print_r($i);	
//
		//$i = Db::table('Persons')->where('Id_P',1)->find();
		//print_r($i);
		$user = Loader::model('Middlepage');
	
		$i = $user->where('Id_P', 1)->find();
		print_r($i);
 	}

	private function inputTest(){
		$paramReq1 = Request::instance()->has('content','post');
		$paramReq2 = Request::instance()->has('title','post');
		return $paramReq1 && $paramReq2;
	}



}
