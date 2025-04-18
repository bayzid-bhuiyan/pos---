<!DOCTYPE html>
<html>
<head>
  <title>Image Search</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0"></script>
</head>
<body>
  <script>
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) window.location.href = "index.html";
  </script>

  <div class="container">
    <div class="sidebar" id="sidebar">
      <h2>POS System</h2>
      <a href="dashboard.html">Dashboard</a>
      <a href="products.html">Products</a>
      <a href="sales.html">Sales</a>
      <a href="customers.html">Customers</a>
      <a href="image-search.html">Image Search</a>
      <a href="index.html" onclick="logout()">Logout</a>
    </div>

    <div class="main-content">
      <h2>Search Product by Image</h2>
      <input type="file" id="searchImage" accept="image/*">
      <button onclick="searchByImageAI()">Search with AI</button>
      <div id="searchResults" style="margin-top: 20px;"></div>
    </div>
  </div>

  <script src="js/app.js"></script>
  <script>
    async function searchByImageAI() {
      const fileInput = document.getElementById("searchImage");
      const file = fileInput.files[0];
      if (!file) return alert("Upload an image first.");

      const reader = new FileReader();
      reader.onload = async function (e) {
        const uploadedImage = e.target.result;

        const uploadedImg = new Image();
        uploadedImg.src = uploadedImage;
        await new Promise(res => uploadedImg.onload = res);

        const model = await mobilenet.load();
        const uploadedTensor = tf.browser.fromPixels(uploadedImg).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        const uploadedEmbedding = model.infer(uploadedTensor, true);

        // Fetch all products
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();

        const matches = [];

        for (let p of products) {
          if (!p.image) continue;
          const productImg = new Image();
          productImg.src = `data:image/jpeg;base64,${p.image}`;
          await new Promise(res => productImg.onload = res);

          const tensor = tf.browser.fromPixels(productImg).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
          const embedding = model.infer(tensor, true);
          const similarity = tf.losses.cosineDistance(uploadedEmbedding, embedding, 1).dataSync()[0];

          if (similarity < 0.3) { // Adjust threshold if needed
            matches.push({ ...p, similarity });
          }
        }

        const resultDiv = document.getElementById("searchResults");
        if (matches.length === 0) {
          resultDiv.innerHTML = "<p>No matches found.</p>";
        } else {
          resultDiv.innerHTML = matches
            .sort((a, b) => a.similarity - b.similarity)
            .map(p => `
              <div style="border:1px solid #555;padding:10px;margin-bottom:10px;">
                <img src="data:image/jpeg;base64,${p.image}" style="width:100px;height:100px;"><br>
                <strong>${p.name}</strong><br>
                Brand: ${p.brand}<br>
                Category: ${p.category}<br>
                Price: $${p.price}<br>
                Match Score: ${(1 - p.similarity).toFixed(2)}
              </div>
            `).join("");
        }
      };
      reader.readAsDataURL(file);
    }
  </script>
</body>
</html>
