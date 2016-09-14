<?php
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use Phalcon\Mvc\Model;

class divers extends Model
{
 public $id_divers;   
 public $photo;   
 public $libelDivers;    
 public $id_compte;  
 public $datepub;  
 
 public function initialize(){
        $this->setSource("divers");
         // relation avec la table login
        $this->belongsTo("id_compte", "login", "id");
    }
 
}