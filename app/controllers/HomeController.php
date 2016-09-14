<?php
/*
 * 
 */
use Phalcon\Mvc\Model\Resultset;

/*
 * 
 * 
 */

class HomeController extends \Phalcon\Mvc\Controller
{

    public function IndexAction()
    {
        $iduser = $this->session->get("id");
        $data = login::find($iduser);
        $this->view->data = $data->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);
        $this->view->data_pub = divers::find(array('order' => 'id_divers DESC', 'hydration' => Resultset::HYDRATE_RECORDS));
        $this->view->house = work::find(array('order' => 'id DESC', 'hydration' => Resultset::HYDRATE_RECORDS));
        // $this->view-> house->$house->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);
    }

    public function resizeImage($source, $dest, $new_width, $new_height, $quality)
    {
        $image = new Phalcon\Image\Adapter\GD($source);
        $source_height = $image->getHeight();
        $source_width = $image->getWidth();
        $source_aspect_ratio = $source_width / $source_height;
        $desired_aspect_ratio = $new_width / $new_height;
        if ($source_aspect_ratio > $desired_aspect_ratio) {
            $temp_height = $new_height;
            $temp_width = (int) ($new_height * $source_aspect_ratio);
        } else {
            $temp_width = $new_width;
            $temp_height = (int) ($new_width / $source_aspect_ratio);
        }
        $x0 = ($temp_width - $new_width) / 2;
        $y0 = ($temp_height - $new_height) / 2;
        $image->resize($temp_width, $temp_height)->crop($new_width, $new_height, $x0, $y0);
        $image->save($dest, $quality);
    }

    public function Page1Action()
    {
        
    }

    public function ProfilAction()
    {
        $iduser = $this->session->get("id");
        $data = login::find($iduser);
        $this->view->data = $data->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);
        if ($this->request->isPost()) {
            $nom = $this->request->getPost('nom');
            $prenom = $this->request->getPost('prenom');
            $email = $this->request->getPost('email');
            $mdp = $this->request->getPost('mdp');
            $cmdp = $this->request->getPost('cmdp');
            $country = $this->request->getPost('pays');

            if ($this->request->hasFiles() == true) {

                $uploads = $this->request->getUploadedFiles();

                $isuploads = false;
                foreach ($uploads as $upload) {
                    $path = 'C:/wamp64/www/renthouse/public/image/' . $upload->getName();
                    $isuploads = $upload->moveTo($path);
                }
            }

            if ($mdp == $cmdp) {
                $datas = login::findFirst($iduser);
                if (empty($upload->getName())) {
                    $imgprofil = $datas->img_profile;
                } else {
                    $imgprofil = $upload->getName();
                }
                $datas->nom = $nom;
                $datas->prenom = $prenom;
                $datas->pays = $country;
                $datas->email = $email;
                $datas->img_profile = $imgprofil;
                if (!empty($cmdp)) {
                    $datas->password = sha1($cmdp);
                }
                if ($datas->update()) {
                    $this->flashSession->success('Votre profile a &eacute;t&eacute; mise a jour avec succ&egrave;s');
                    $this->response->redirect('home/profil');
                }
            }
        }
    }

    public function PubAction()
    {
        $iduser = $this->session->get("id");
        $data = login::find($iduser);
        $this->view->data = $data->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);

        if ($this->request->isPost()) {
            //$lieu = $this->request->getPost('lieu');
            $description = $this->request->getPost('description_vente');
            if ($this->request->hasFiles() == true) {
                $uploads = $this->request->getUploadedFiles();

                $isuploads = false;
                foreach ($uploads as $upload) {
                    $path = 'C:/wamp64/www/renthouse/public/image/' . $upload->getName();
                    $isuploads = $upload->moveTo($path);

                    $publication = new divers();
                    $publication->photo = $upload->getName();
                    $publication->libelDivers = $description;
                    $publication->id_compte = $iduser;
                    $publication->datepub = time();
                    $savefile = $publication->save();
                }
            }

            if ($savefile) {
                $this->flashSession->success('enregistrement avec succès');
            } else {
                $this->flashSession->error('Echec d\'enregistrement');
            }
        }
    }

    public function WorkAction()
    {
        $iduser = $this->session->get("id");
        $data = login::find($iduser);
        $this->view->data = $data->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_RECORDS);

        if ($this->request->isPost()) {
            // $img = implode(";",$this->request->getPost('image_house'));
            $typehouse = $this->request->getPost('type_house');
            //$lieu = $this->request->getPost('lieu');
            $description = $this->request->getPost('description');
            if ($this->request->hasFiles() == true) {
                $uploads = $this->request->getUploadedFiles();
                $isuploads = false;
                foreach ($uploads as $upload) {
                    $url = 'C:/wamp64/www/renthouse/public/image/';
                    $path = $url . strtolower($upload->getName());
                    $taille=  sizeof($uploads);
                    $dest = $url . 'thumb_' . strtolower($upload->getName());
                    if ($upload->moveTo($path)) {
                        $imageValues[] = $upload->getName();
                        if($taille<3){
                        $this->resizeImage($path, $dest, 550, 300, 100);
                        }elseif($taille>3){
                         $this->resizeImage($path, $dest, 400, 300, 100);
                        }
                    }
                }
                $tabimg = implode(";", $imageValues);
                //$valueimage = explode(";", $tabimg);
                //return var_dump($tabimg);
            }


            $publ_house = new work();
            $publ_house->id_user = $iduser;
            $publ_house->image = "thumb_" . $tabimg;
            $publ_house->type_house = $typehouse;
            $publ_house->lieu = "drop";
            $publ_house->description = $description;
            $publ_house->time = time();


            if ($publ_house->save()) {
                $this->flashSession->success('enregistrement avec succès');
            } else {
                $this->flashSession->error('Echec d\'enregistrement');
            }
        }
    }
}
