<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sql = "SELECT s.id, p.name as product_name, s.quantity, s.total, s.date
          FROM sales s JOIN products p ON s.product_id = p.id";
  $res = $conn->query($sql);
  $rows = [];
  while ($row = $res->fetch_assoc()) {
    $rows[] = $row;
  }
  echo json_encode($rows);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  $stmt = $conn->prepare("SELECT price, quantity FROM products WHERE id = ?");
  $stmt->bind_param("i", $data['product_id']);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_assoc();

  if ($res['quantity'] < $data['quantity']) {
    http_response_code(400);
    echo json_encode(["message" => "Insufficient stock"]);
    exit;
  }

  $total = $res['price'] * $data['quantity'];
  $stmt = $conn->prepare("INSERT INTO sales (product_id, customer_id, quantity, total)
                          VALUES (?, ?, ?, ?)");
  $stmt->bind_param("iiid", $data['product_id'], $data['customer_id'], $data['quantity'], $total);
  $stmt->execute();

  $stmt = $conn->prepare("UPDATE products SET quantity = quantity - ? WHERE id = ?");
  $stmt->bind_param("ii", $data['quantity'], $data['product_id']);
  $stmt->execute();

  echo json_encode(["message" => "Sale recorded"]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str($_SERVER['QUERY_STRING'], $q);
  $stmt = $conn->prepare("DELETE FROM sales WHERE id = ?");
  $stmt->bind_param("i", $q['id']);
  $stmt->execute();
  echo json_encode(["message" => "Sale deleted"]);
}
?>