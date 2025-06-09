// Carrito de compras
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.modal = document.getElementById('cartModal');
        this.cartCount = document.querySelector('.cart-count');
        this.cartItems = document.querySelector('.cart-items');
        this.subtotalElement = document.getElementById('cartSubtotal');
        this.totalElement = document.getElementById('cartTotal');
        this.closeBtn = document.querySelector('.close-cart');
        this.checkoutBtn = document.querySelector('.checkout-btn');

        this.initialize();
    }

    initialize() {
        // Event listeners
        document.querySelector('.cart-icon').addEventListener('click', () => this.toggleCart());
        this.closeBtn.addEventListener('click', () => this.toggleCart());
        this.checkoutBtn.addEventListener('click', () => this.checkout());

        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal')) {
                this.toggleCart();
            }
        });

        // Actualizar contador inicial
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    toggleCart() {
        this.modal.classList.toggle('active');
        if (this.modal.classList.contains('active')) {
            this.updateCartDisplay();
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        showToast(`${product.title} agregado al carrito`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        showToast('Producto eliminado del carrito', 'success');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeItem(productId);
            }
            this.saveCart();
        }
    }

    updateCartCount() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
    }

    calculateTotal() {
        const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        // Aquí podrías agregar lógica para impuestos, envío, etc.
        return {
            subtotal,
            total: subtotal
        };
    }

    updateCartDisplay() {
        if (!this.cartItems) return;

        if (this.items.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            this.subtotalElement.textContent = '$0';
            this.totalElement.textContent = '$0';
            return;
        }

        this.cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        const { subtotal, total } = this.calculateTotal();
        this.subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        this.totalElement.textContent = `$${total.toLocaleString()}`;
    }

    checkout() {
        if (this.items.length === 0) {
            showToast('Tu carrito está vacío', 'error');
            return;
        }

        // Aquí iría la lógica de checkout
        showToast('Procesando tu pedido...', 'success');
        setTimeout(() => {
            this.items = [];
            this.saveCart();
            this.toggleCart();
            showToast('¡Gracias por tu compra!', 'success');
        }, 2000);
    }
}

// Utilidades
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Lazy loading para imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrito
    window.cart = new ShoppingCart();

    // Event listeners
    window.addEventListener('scroll', handleHeaderScroll);

    // Inicializar lazy loading
    lazyLoadImages();
});

// Búsqueda en tiempo real
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            // Aquí iría la lógica de búsqueda
            // Por ahora solo mostraremos un mensaje
            if (searchTerm.length > 2) {
                showToast(`Buscando: ${searchTerm}`, 'success');
            }
        }, 500);
    });
}

// Exportar funciones y clases necesarias
export {
    ShoppingCart,
    showToast,
    lazyLoadImages
}; 