<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
use Phalcon\Mvc\Controller,
    Phalcon\Mvc\Model\Resultset,
    Phalcon\Tag;
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;

/**
 * Controlleur des fonctionnalités d'authentification
 * Gère l'authentification et la deconnexion des utilisateurs
 *
 * @author aadehan
 */
class SessionController extends \Phalcon\Mvc\Controller
{

    public function initialize()
    {
        $this->view->setMainView("session");
    }

    private function _registerSession($user)
    {
        $this->session->set('auth', array('id' => $user->iduser, 'name' => $user->login));
    }

    //@todo  how to check if a session is already opened

    public function indexAction()
    {
        $iduser = $this->session->get("id");
        $data = login::find($iduser);
        $this->view->data = $data->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);
    }

    /**
     * gère l'authentification des utilisateurs et l'ouverture de session
     */
    public function loginAction()
    {
        //print_r($this->dispatcher);
        if ($this->request->isPost('su1')) {
            $email = $this->request->getPost('mail');
            $mdp = $this->request->getPost('pwd');
            if (empty($mdp)) {
                //$this->flashSession->error('veillez entrer votre identifiant');
                $this->response->redirect('session/index');
            } elseif (empty($email)) {
               // $this->flashSession->error('veillez entrer votre identifiant');
                $this->response->redirect('session/index');
            } else {
                $md= sha1($mdp);
                $con = login::findFirst(array("email =:mail: and password =:pass:",
                        'bind' => array('mail' => $email, 'pass' => $md)));
                if (($email ==$con->email ) && ($md == $con->password)) {
                    $this->session->set("id", $con->id);
                    $this->response->redirect('home/index');
                }
                else{
                    $this->response->redirect('session/index');
                }
            }
        }
    }

    public function SaveAction()
    {

        if ($this->request->isPost('sus')) {
            $nom = $this->request->getPost('nom');
            $prenom = $this->request->getPost('prenom');
            $sexe = $this->request->getPost('sexe');
            $country = $this->request->getPost('pays');
            $email = $this->request->getPost('email');
            $mdp = $this->request->getPost('pwd');

            $data = new login();
            if (empty($nom)) {
                $this->flashSession->error("Veuillez renseigner votre nom");
                $this->response->redirect("session/index");
            } elseif (empty($prenom)) {
                $this->flashSession->error("Veuillez renseigner votre prenom");
                $this->response->redirect("session/index");
            } elseif (empty($email)) {
                $this->flashSession->error("Veuillez renseigner votre email");
                $this->response->redirect("session/index");
            } elseif (empty($mdp)) {
                $this->flashSession->error("Veuillez renseigner votre un mot de passe");
                $this->response->redirect("session/index");
            } else {
                $data->nom = $nom;
                $data->prenom = $prenom;
                $data->email = $email;
                $data->sexe = $sexe;
                $data->pays = $country;
                $data->password = sha1($mdp);

                if ($data->save()){
                     $this->session->set("email", $email);
                    $this->response->redirect('session/authentificate');
                }else{
                    $this->response->redirect('session/index');
                }
            }
            //$this->response->redirect('session/index');
        }
    }

    /**
     * gère la fermeture de session de l'utilisateur en cours
     */
    public function LogoutAction()
    {
        $this->session->destroy();
        $this->response->redirect("session/index");
    }
/*
 * 
 * gérer lauthentification après inscription
 */
    public function AuthentificateAction()
    {
        $mail = $this->session->get("email");
        //$this->view->$mail;
        if ($this->request->isPost()) {
            $user = $this->request->getPost('user');
            $login = $this->request->getPost('pwd');
            
            if(empty($user)){
                $this->flashSession->error("veillez entrer votre email!");
                $this->response->redirect("session/index");
            }elseif(empty ($login)){
                $this->flashSession->error("veillez entre votre mot de passe");
                $this->response->redirect("session/index");
            }
            else{
                $md=  sha1($login);
                $data= login::findFirst(array("email =:mail: and password =:pass:",
                        'bind' => array('mail' => $user, 'pass' => $md)));
                if(($user== $data->email)&&($md ==$data->password)){
                    $this->flashSession->error("Identifiant incorrect veillez reéssayer");
                    $this->response->redirect("home/index");
                }else{
                    $this->flashSession->error("Identifiant incorrect veillez reéssayer");
                    $this->response->redirect("session/authentificate");
                }
            }
            
        }
    }
    /**
     * gère la récuperation du mot de passe d'un compte par son utilisateur
     */
    public function passwordLostAction()
    {
        
    }

    /**
     * gère la récupération de l'identifiant d'un compte par son utilisateur
     */
    public function loginLostAction()
    {
        
    }

    /**
     * Verifie si l'utilisateur dispose d'une autorisation d'administrateur 
     * pour accéder aux outils d'administration
     */
    public function adminLoginAction()
    {
        
    }
}
