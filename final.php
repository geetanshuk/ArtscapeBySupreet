<?php 

$DBSTRING = "mysql:host=localhost;dbname=artscapebysupreet;charset=utf8";
$DBUSER = 'root';
$DBPASS = 'rootroot';
include "sql.inc";
include "final.class.php";

header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Allow-Methods: GET,POST,PUSH,OPTIONS");
header ("content-type: application/json");
header ("Access-Control-Allow-Headers: Content-Type");
require_once "RestServer.php";

$method=str_replace("/","",$_SERVER["PATH_INFO"]);
$METHOD=$method;

$rest = new RestServer (new final_rest(),$method);
$rest->handle ();
