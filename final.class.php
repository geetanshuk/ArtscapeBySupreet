<?php
class final_rest
{
    public static function viewPaintings() {
        try {
                // Assuming GET_SQL is a function that executes the SQL query
                $USER = GET_SQL("select * from paintings");
        
                // Prepare data to return
                $retData["status"] = 0;
                $retData["message"] = "Painting fetched successfully";
                $retData["data"] = $USER; // Assuming $USER contains menu items fetched from database
        
                // Return JSON response
                header('Content-Type: application/json');
                echo json_encode($retData);
            } catch (Exception $e) {
                // Handle exceptions
                $retData["status"] = 1;
                $retData["message"] = $e->getMessage();
        
                // Return JSON response
                header('Content-Type: application/json');
                echo json_encode($retData);
            }
    }

    public static function signUp($email, $username, $password)

        {
                try {
                        $EXIST = GET_SQL("select * from users where username=?", $username);
                        if (count($EXIST) > 0) {
                                $retData["status"] = 1;
                                $retData["message"] = "User $username exists";
                        } else {
                                EXEC_SQL("insert into users (email,username,password) values (?,?,?)", $email, $username, password_hash($password, PASSWORD_DEFAULT));
                                $retData["status"] = 0;
                                $retData["message"] = "User $username Inserted";
                        }
                } catch (Exception $e) {
                        $retData["status"] = 1;
                        $retData["message"] = $e->getMessage();
                }

                return json_encode($retData);
        }

        public static function cart($image, $name, $price) {
            try {
                    $EXIST = GET_SQL("SELECT * FROM cart WHERE name = ?", $name);
                    if (count($EXIST) > 0) {
                            EXEC_SQL("update cart set quantity = quantity + 1 where name = ?"
                                    , $name);
                            EXEC_SQL("update cart set price = price * quantity where name = ?"
                                    , $name);
                            $retData["status"] = 1;
                            $retData["message"] = "Item inserted";
                    } else {
                            EXEC_SQL("insert into cart (image_url, name, price, quantity) values (?,?,?,?)"
                                    , $image, $name, $price, 1);
                            $retData["status"] = 0;
                            $retData["message"] = "User Inserted";
                    }
            } catch (Exception $e) {
                    $retData["status"] = 1;
                    $retData["message"] = $e->getMessage();
            }

            return json_encode($retData);
    }

    public static function viewCart() {
        try {
                // Assuming GET_SQL is a function that executes the SQL query
                $USER = GET_SQL("select * from cart");
        
                // Prepare data to return
                $retData["status"] = 0;
                $retData["message"] = "cart fetched successfully";
                $retData["data"] = $USER; // Assuming $USER contains menu items fetched from database
        
                // Return JSON response
                header('Content-Type: application/json');
                echo json_encode($retData);
            } catch (Exception $e) {
                // Handle exceptions
                $retData["status"] = 1;
                $retData["message"] = $e->getMessage();
        
                // Return JSON response
                header('Content-Type: application/json');
                echo json_encode($retData);
            }
    }
}

