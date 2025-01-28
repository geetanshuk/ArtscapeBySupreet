<?php
class RestServer {
  public $global_method;
  public $serviceClass;

  public function __construct($serviceClass, $method) {
    $this->serviceClass = $serviceClass;
    $this->global_method = $method;
  }

  public function handle() {
    // Use the class property instead of a global variable
    $method = $this->global_method;

    // Set a default value if method is empty
    if (empty($method)) {
      $method = 'GET';
    }

    // Check if the method exists in the request
    $rArray = array_change_key_case($_REQUEST, CASE_LOWER);
    if (array_key_exists("method", $rArray)) {
      $method = $rArray["method"];
    }

    // Check if the method exists in the service class
    if (method_exists($this->serviceClass, $method)) {
      $ref = new ReflectionMethod($this->serviceClass, $method);
      $params = $ref->getParameters();
      $pCount = count($params);
      $pArray = array();
      $paramStr = "";

      $i = 0;

      foreach ($params as $param) {
        $pArray[strtolower($param->getName())] = null;
        $paramStr .= $param->getName();
        if ($i != $pCount - 1) {
          $paramStr .= ", ";
        }

        $i++;
      }

      foreach ($pArray as $key => $val) {
        if (isset($rArray[strtolower($key)])) {
          $pArray[strtolower($key)] = $rArray[strtolower($key)];
        }
      }

      if (count($pArray) == $pCount && !in_array(null, $pArray)) {
        echo call_user_func_array(array($this->serviceClass, $method), $pArray);
      } else {
        echo json_encode(array('errorMessage' => "Required parameter(s) for " . $method . ": " . $paramStr));
      }
    } else {
      echo json_encode(array('errorMessage' => "The method " . $method . " does not exist."));
    }
  }
}
?>