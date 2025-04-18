<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $res = $conn->query("SELECT * FROM customers");
  $rows = [];
  while ($row = $res->fetch_assoc()) {
    $rows[] = $row;
  }
  echo json_encode($rows);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  $stmt = $conn->prepare("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)");
  $stmt->bind_param("sss", $data['name'], $data['email'], $data['phone']);
  $stmt->execute();
  echo json_encode(["message" => "Customer added"]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str($_SERVER['QUERY_STRING'], $q);
  $stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
  $stmt->bind_param("i", $q['id']);
  $stmt->execute();
  echo json_encode(["message" => "Customer deleted"]);
}
?>