<?php
$conn = new mysqli("localhost", "root", "", "pos_system");
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>