<?php
require 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];
$role = $data['role'];
$stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $password, $role);
if ($stmt->execute()) {
  echo json_encode(["message" => "User registered successfully"]);
} else {
  http_response_code(400);
  echo json_encode(["error" => "Registration failed"]);
}
?>