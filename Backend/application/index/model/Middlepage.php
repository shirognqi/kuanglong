<?php

namespace app\index\model;

use think\Model;


class Middlepage extends Model{


	protected function initialize(){
		parent::initialize();
	}
	
	// 设置表名
	protected $table = 'Persons';

}
