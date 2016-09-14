<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

try {

    //Load configuration files
    $config = new Phalcon\Config\Adapter\Ini('../app/config/settings.ini');
    //Register an autoloader
    $loader = new \Phalcon\Loader();
    //load application classes folders
    $loader->registerDirs(array(
        $config->application->controllersDir,
        $config->application->pluginsDir,
        $config->application->libraryDir,
        $config->application->modelsDir,
    ))->register();

    //Create a DI
    $di = new Phalcon\DI\FactoryDefault();
    //$di->set('config', $config);
    // setting up the dispatcher
    $di->set('dispatcher', function() use ($di) {
        //Obtain the standard eventsManager from the DI
        $eventsManager = $di->getShared('eventsManager');
        //Instantiate the Security plugin
        $security = new Security($di);
        //Listen for events produced in the dispatcher using the Security plugin
//        $eventsManager->attach('dispatch', $security);
        $dispatcher = new Phalcon\Mvc\Dispatcher();
        //Bind the EventsManager to the Dispatcher
        $dispatcher->setEventsManager($eventsManager);
        return $dispatcher;
    }, true);

    //Setting up the view component
    $di->set('view', function() use ($config) {
        $view = new \Phalcon\Mvc\View();
        $view->setViewsDir($config->application->viewsDir);
        return $view;
    });

    $di->set('router', function() use ($di, $config) {
        $router = new \Phalcon\Mvc\Router();
        $router->setDefaultController("session");
        //$router->setUriSource($config->application->baseUri);
        return $router;
    });

    $di->set('url', function() use ($config) {
        $url = new \Phalcon\Mvc\Url(); //new UrlProvider();
        $url->setBaseUri($config->application->baseUri);
        return $url;
    });

    // Setting up session service
    $di->set('session', function() {
        $session = new Phalcon\Session\Adapter\Files();
        $session->start();
        return $session;
    });

     $di->set('flashSession', function () {
        $flashsession = new \Phalcon\Flash\Session(array(
            'error' => 'alert alert-danger alert-dismissable',
            'success' => 'alert alert-success alert-dismissable',
            'notice' => 'alert alert-info alert-dismissable',
            'warning' => 'alert alert-warning alert-dismissable'
        ));
        return $flashsession;
    });
    
    // Setting up the data source service
    $di->set('db', function() use ($config) {
        return new \Phalcon\Db\Adapter\Pdo\Mysql(array(
            "host" => $config->database->host,
            "username" => $config->database->username,
            "password" => $config->database->password,
            "dbname" => $config->database->name
        ));
    });

    //Handle the request
    $application = new \Phalcon\Mvc\Application($di);

    echo $application->handle()->getContent();
} catch (\Phalcon\Exception $e) {
    echo "PhalconException: ", $e->getMessage();
}

