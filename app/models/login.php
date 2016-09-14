<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of login
 *
 * @author karth solution
 */
use Phalcon\Mvc\Model;

class login extends Model
{
    //put your code here
    public $id;
    public $nom;
    public $prenom;
    public $sexe;
    public $pays;
    public $email;
    public $password;
    public $img_profile;
    
    public function initialize(){
        $this->setSource("login");
        
         //relation avec la table house
        $this->hasMany("id", "work", "id_user");
        $this->hasMany("id","divers","id_compte");
    }
    
}
