<?php
// Database credentials
$servername = "localhost";
$username = "root";
$password = "rootroot";
$dbname = "artscapebysupreet"; 

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch all paintings
$sql = "SELECT * FROM paintings"; // Adjust table name if necessary
$result = $conn->query($sql);

// Check if there are any paintings in the table
if ($result->num_rows > 0) {
    $paintings = [];
    
    // Fetch all paintings and add them to an array
    while($row = $result->fetch_assoc()) {
        $paintings[] = $row;
    }

    // Return the paintings as a JSON response
    echo json_encode(["data" => $paintings]);
} else {
    echo json_encode(["message" => "No paintings found"]);
}

// Close the connection
$conn->close();
?>
