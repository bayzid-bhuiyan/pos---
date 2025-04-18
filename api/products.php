<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $result = $conn->query("SELECT * FROM products");
  $products = [];
  while ($row = $result->fetch_assoc()) {
    $row['image'] = base64_encode($row['image']);
    $products[] = $row;
  }
  echo json_encode($products);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $sku = $_POST['productSKU'];
  $name = $_POST['productName'];
  $brand = $_POST['productBrand'];
  $category = $_POST['productCategory'];
  $price = $_POST['productPrice'];
  $quantity = $_POST['productQuantity'];
  $image = addslashes(file_get_contents($_FILES['productImage']['tmp_name']));

  $stmt = $conn->prepare("INSERT INTO products (sku, name, brand, category, price, quantity, image)
                          VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("ssssdis", $sku, $name, $brand, $category, $price, $quantity, $image);
  $stmt->execute();
  echo json_encode(["message" => "Product added"]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str($_SERVER['QUERY_STRING'], $query);
  $id = $query['id'];
  $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  echo json_encode(["message" => "Product deleted"]);
}
?>