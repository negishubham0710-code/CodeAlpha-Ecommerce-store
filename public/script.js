let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(id, name, price) {
  cart.push({id, name, price});
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(name + " cart me add ho gaya!");
}

fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const div = document.getElementById('products');
    products.forEach(p => {
      div.innerHTML += `
        <div class="product">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
        </div>`
    })
  })