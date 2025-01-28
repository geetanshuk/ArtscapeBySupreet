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
}