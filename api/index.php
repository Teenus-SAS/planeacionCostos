<?php

  use Psr\Http\Message\ResponseInterface as Response;
  use Psr\Http\Message\ServerRequestInterface as Request;
  use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
  use Slim\Factory\AppFactory;

  require __DIR__ . '/vendor/autoload.php';
  include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
  require_once DAO_PATH. "UserDao.php";
  require_once DAO_PATH. "MaterialDao.php";
  require_once DAO_PATH. "ProductDao.php";

  $app = AppFactory::create();
  $app->setBasePath('/api');

  $sessionActive = function (Request $request, RequestHandler $handler) {
    session_start();
    $response = $handler->handle($request);
    if (isset($_SESSION["user"])) {
      return $response;
    } else {
      $newResponse = new \Slim\Psr7\Response();
      $newResponse = $newResponse->withStatus(401);
      return $newResponse;
    }

  };


  $app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
  });

  $app->get('/materials/company/{id}', function (Request $request, Response $response, $args) {
    $materialDao = new MaterialDao();
    $response->getBody()->write(json_encode($materialDao->findByCompany($args["id"])));

    return $response->withHeader('Content-Type', 'application/json');
  })->add($sessionActive);

  $app->get('/products/company/{id}[/{expenses}[/{processes}[/materials]]]', function (Request $request, Response $response, $args) {
    $productDao = new ProductDao();
    $response->getBody()->write(json_encode($productDao->findByCompany($args["id"],$args["expenses"],$args["processes"],$args["materials"])));

    return $response->withHeader('Content-Type', 'application/json');
  })->add($sessionActive);


  $app->run();