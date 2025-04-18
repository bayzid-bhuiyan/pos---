
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const sidebar = document.getElementById("sidebar");
  const welcome = document.getElementById("welcomeMsg");

  if (sidebar && user) {
    if (user.role === "cashier") hideLinks(["products.html"]);
    else if (user.role === "manager") hideLinks(["sales.html"]);
    if (welcome) welcome.innerText = `Logged in as ${user.username} (${user.role})`;
  }

  if (!user && !window.location.href.includes("index.html") && !window.location.href.includes("register.html")) {
    window.location.href = "index.html";
  }

  if (document.getElementById("productForm")) loadProducts();
  if (document.getElementById("salesForm")) {
    loadProductsForSales();
    loadSalesHistory();
  }
});

function login() {
  const u = document.getElementById("loginUsername").value;
  const p = document.getElementById("loginPassword").value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const match = users.find(x => x.username === u && x.password === p);
  if (match) {
    localStorage.setItem("currentUser", JSON.stringify(match));
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("errorMsg").innerText = "Invalid login.";
  }
}

function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(x => x.username === username)) {
    document.getElementById("regMsg").innerText = "Username already exists.";
    return;
  }
  users.push({ username, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("regMsg").innerText = "Registration successful!";
}

function logout() {
  localStorage.removeItem("currentUser");
}

function hideLinks(pages) {
  pages.forEach(page => {
    const link = Array.from(document.querySelectorAll("a")).find(a => a.href.includes(page));
    if (link) link.style.display = "none";
  });
}

function addProduct() {
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);
  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  let products = JSON.parse(localStorage.getItem("products") || "[]");
  products.push({ name, price, quantity });
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
  document.getElementById("productForm").reset();
}

function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.quantity}</td>
      <td>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Delete</button>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function editProduct(index) {
  const products = JSON.parse(localStorage.getItem("products"));
  const product = products[index];
  const newName = prompt("Edit product name:", product.name);
  const newPrice = prompt("Edit price:", product.price);
  const newQty = prompt("Edit quantity:", product.quantity);
  if (newName && !isNaN(newPrice) && !isNaN(newQty)) {
    products[index] = {
      name: newName,
      price: parseFloat(newPrice),
      quantity: parseInt(newQty)
    };
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
  }
}

function deleteProduct(index) {
  const products = JSON.parse(localStorage.getItem("products"));
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
  }
}

function loadProductsForSales() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const select = document.getElementById("productSelect");
  select.innerHTML = products
    .map((p, i) => `<option value="${i}">${p.name} ($${p.price.toFixed(2)})</option>`)
    .join("");
}

function makeSale() {
  const index = parseInt(document.getElementById("productSelect").value);
  const quantity = parseInt(document.getElementById("saleQuantity").value);
  let products = JSON.parse(localStorage.getItem("products") || "[]");

  if (!products[index] || isNaN(quantity)) {
    alert("Invalid selection.");
    return;
  }

  if (products[index].quantity < quantity) {
    alert("Insufficient stock.");
    return;
  }

  products[index].quantity -= quantity;
  localStorage.setItem("products", JSON.stringify(products));

  let sales = JSON.parse(localStorage.getItem("sales") || "[]");
  const now = new Date();
  const sale = {
    name: products[index].name,
    quantity,
    total: (quantity * products[index].price).toFixed(2),
    date: now.toLocaleString()
  };
  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  alert(`--- Receipt ---\nProduct: ${sale.name}\nQuantity: ${sale.quantity}\nTotal: $${sale.total}\nDate: ${sale.date}\n----------------`);

  document.getElementById("salesForm").reset();
  loadProductsForSales();
  loadSalesHistory();
}

function loadSalesHistory() {
  const sales = JSON.parse(localStorage.getItem("sales") || "[]");
  const tbody = document.getElementById("salesTableBody");
  if (tbody) {
    tbody.innerHTML = sales.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.quantity}</td>
        <td>$${s.total}</td>
        <td>${s.date || 'N/A'}</td>
      </tr>
    `).join("");
  }
}

function exportSalesCSV() {
  const sales = JSON.parse(localStorage.getItem("sales") || "[]");
  const rows = [["Product", "Quantity", "Total", "Date"]];
  sales.forEach(s => rows.push([s.name, s.quantity, s.total, s.date]));
  exportToCSV(rows, "sales_report.csv");
}



function loadSalesHistory() {
  const sales = JSON.parse(localStorage.getItem("sales") || "[]");
  const tbody = document.getElementById("salesTableBody");
  if (tbody) {
    tbody.innerHTML = sales.map((s, i) => `
      <tr>
        <td>${s.name}</td>
        <td>${s.quantity}</td>
        <td>$${s.total}</td>
        <td>${s.date || 'N/A'}</td>
        <td><button onclick="deleteSale(${i})">Delete</button></td>
      </tr>
    `).join("");
  }
}

function deleteSale(index) {
  let sales = JSON.parse(localStorage.getItem("sales") || "[]");
  if (confirm("Are you sure you want to delete this sale?")) {
    sales.splice(index, 1);
    localStorage.setItem("sales", JSON.stringify(sales));
    loadSalesHistory();
  }
}



function addProduct() {
  const sku = document.getElementById("productSKU").value;
  const name = document.getElementById("productName").value;
  const brand = document.getElementById("productBrand").value;
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);
  const imageFile = document.getElementById("productImage").files[0];

  if (!sku || !name || !brand || !category || isNaN(price) || isNaN(quantity)) {
    alert("Please fill out all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    let products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push({ sku, name, brand, category, price, quantity, image: e.target.result });
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    document.getElementById("productForm").reset();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    let products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push({ sku, name, brand, category, price, quantity, image: "" });
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    document.getElementById("productForm").reset();
  }
}

function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
    const row = `<tr>
      <td><img src="${p.image}" style="width:50px;height:50px;" /></td>
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.brand}</td>
      <td>${p.category}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.quantity}</td>
      <td>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Delete</button>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
}
