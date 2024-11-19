class Product {
  constructor(name, price, imgSrc) {
    this.name = name;
    this.price = price;
    this.imgSrc = imgSrc;
    this.quantity = 0;
    this.isFavorited = false;  
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) this.quantity--;
  }

  get totalPrice() {
    return this.quantity * this.price;
  }

  toggleFavorite(icon) {
    this.isFavorited = !this.isFavorited;
    icon.style.color = this.isFavorited ? 'red' : '';
  }

  render() {
    return `
      <div class="card-body">
        <div class="card" style="width: 18rem">
          <img src="${this.imgSrc}" class="card-img-top" alt="${this.name}" />
          <div class="card-body">
            <h5 class="card-title">${this.name}</h5>
            <p class="card-text">This is a ${this.name.toLowerCase()}</p>
            <h4 class="unit-price">${this.price} $</h4>
            <div>
              <i class="fas fa-plus-circle" onclick="cart.increaseQuantity('${this.name}')"></i>
              <span class="quantity">${this.quantity}</span>
              <i class="fas fa-minus-circle" onclick="cart.decreaseQuantity('${this.name}')"></i>
            </div>
            <div>
              <i class="fas fa-trash-alt" onclick="cart.removeProduct('${this.name}')"></i>
              <i class="fas fa-heart" id="heart-${this.name}" data-product="${this.name}"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}


class Cart {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    this.products.push(product);
  }

  increaseQuantity(productName) {
    const product = this.products.find(p => p.name === productName);
    if (product) {
      product.increaseQuantity();
      this.updateTotalPrice();
      this.renderProducts();
    }
  }

  decreaseQuantity(productName) {
    const product = this.products.find(p => p.name === productName);
    if (product) {
      product.decreaseQuantity();
      this.updateTotalPrice();
      this.renderProducts();
    }
  }

  removeProduct(productName) {
    this.products = this.products.filter(p => p.name !== productName);
    this.updateTotalPrice();
    this.renderProducts();
  }

  updateTotalPrice() {
    const total = this.products.reduce((sum, product) => sum + product.totalPrice, 0);
    document.querySelector('.total').innerText = total + ' $';
  }

  renderProducts() {
    const productsContainer = document.querySelector('.list-products');
    productsContainer.innerHTML = this.products.map(product => product.render()).join('');
    this.addFavoriteListeners(); // Add event listeners for the hearts after rendering
  }

  addFavoriteListeners() {
    this.products.forEach(product => {
      const heartIcon = document.querySelector(`#heart-${product.name}`);
      if (heartIcon) {
        heartIcon.addEventListener('click', () => {
          product.toggleFavorite(heartIcon);
        });
      }
    });
  }
}

const cart = new Cart();

cart.addProduct(new Product('Baskets', 100, '/assets/baskets.png'));
cart.addProduct(new Product('Socks', 20, '/assets/socks.png'));
cart.addProduct(new Product('Bag', 50, '/assets/bag.png'));

window.onload = () => cart.renderProducts();
