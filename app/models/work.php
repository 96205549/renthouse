<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of index
 *
 * @author karth solution
 */
use Phalcon\Mvc\Model;

class work extends Model
{
 public $id;   
 public $id_user;  
 public $image;  
 public $type_house;  
 public $lieu;  
 public $description;  
 public $time;  
 
 public function initialize(){
        $this->setSource("house");
        
         // relation avec la table login
        $this->belongsTo("id_user", "login", "id");
    }
 //put your code here
}
