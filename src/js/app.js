// Datos de ejemplo
const categories = [
    { id: 1, name: 'Ofertas', image: 'offers.jpg' },
    { id: 2, name: 'No te pueden faltar', image: 'must-have.jpg' },
    { id: 3, name: 'Latas a la lata', image: 'cans.jpg' },
    { id: 4, name: 'Cerveza', image: 'beer.jpg' },
    { id: 5, name: 'Licores', image: 'liquor.jpg' },
    { id: 6, name: 'Cola y Pola', image: 'cola.jpg' },
    { id: 7, name: 'Pony Malta y Malta Leona', image: 'malta.jpg' },
    { id: 8, name: 'Bebidas sin alcohol', image: 'non-alcoholic.jpg' },
    { id: 9, name: 'Electrolyt', image: 'electrolyt.jpg' },
    { id: 10, name: 'Mercado', image: 'market.jpg' },
    { id: 11, name: 'Nuevo en BeerExpress', image: 'new.jpg' }
];

const products = [
    {
        id: 1,
        name: 'Cerveza Aguila Original Retornable',
        description: '330cm3 x30 uds',
        originalPrice: 75000,
        discountPrice: 65000,
        image: 'aguila.jpg',
        category: 'beer',
        stock: 50,
        rating: 4.5
    },
    {
        id: 2,
        name: 'Corona Extra',
        description: '355ml x6 uds',
        originalPrice: 45000,
        discountPrice: 39900,
        image: 'corona.jpg',
        category: 'beer',
        stock: 30,
        rating: 4.8
    },
    {
        id: 3,
        name: 'Heineken Botella',
        description: '330ml x12 uds',
        originalPrice: 65000,
        discountPrice: 55000,
        image: 'heineken.jpg',
        category: 'beer',
        stock: 25,
        rating: 4.6
    },
    {
        id: 4,
        name: 'Club Colombia Roja Lata',
        description: '355ml x6 uds',
        originalPrice: 35000,
        discountPrice: 29900,
        image: 'club-colombia.jpg',
        category: 'beer',
        stock: 40,
        rating: 4.3
    },
    {
        id: 5,
        name: 'BBC Candelaria Rubia',
        description: '330ml x4 uds',
        originalPrice: 42000,
        discountPrice: 35000,
        image: 'bbc.jpg',
        category: 'beer',
        stock: 20,
        rating: 4.7
    }
];

// Estado de la aplicación
let cart = [];
let currentFilter = 'all';
let isLoading = false;

// Formatear precio en COP
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(price);
};

// Mostrar loader
const showLoader = () => {
    isLoading = true;
    const loader = document.createElement('div');
    loader.className = 'loader';
    document.body.appendChild(loader);
};

// Ocultar loader
const hideLoader = () => {
    isLoading = false;
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
};

// Sistema de notificaciones
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Forzar un reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });
    
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
};

// Cargar categorías con animación
const loadCategories = () => {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categories.map((category, index) => `
        <div class="category-item scroll-reveal" style="animation-delay: ${index * 0.1}s">
            <img src="src/assets/images/${category.image}" 
                 alt="${category.name}"
                 loading="lazy"
                 data-src="src/assets/images/${category.image}">
            <span>${category.name}</span>
        </div>
    `).join('');

    // Inicializar lazy loading
    initializeLazyLoading();
};

// Cargar productos con animación y skeleton loading
const loadProducts = async () => {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    // Mostrar skeleton loading
    productsGrid.innerHTML = Array(5).fill(0).map(() => `
        <div class="product-card skeleton">
            <div class="product-image skeleton"></div>
            <div class="product-info">
                <div class="skeleton" style="height: 24px; width: 80%;"></div>
                <div class="skeleton" style="height: 18px; width: 60%; margin: 10px 0;"></div>
                <div class="skeleton" style="height: 34px; width: 100%;"></div>
            </div>
        </div>
    `).join('');

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));

    productsGrid.innerHTML = products
        .filter(product => currentFilter === 'all' || product.category === currentFilter)
        .map((product, index) => `
            <div class="product-card scroll-reveal" data-id="${product.id}" style="animation-delay: ${index * 0.1}s">
                <div class="product-image">
                    <img src="src/assets/images/${product.image}" 
                         alt="${product.name}"
                         loading="lazy"
                         data-src="src/assets/images/${product.image}">
                    ${product.stock < 10 ? `<span class="stock-badge">¡Últimas unidades!</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span class="rating-count">(${Math.floor(Math.random() * 100 + 50)} reseñas)</span>
                    </div>
                    <div class="product-price">
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                        <span class="discount-price">${formatPrice(product.discountPrice)}</span>
                        <span class="discount-badge">-${Math.round((1 - product.discountPrice/product.originalPrice) * 100)}%</span>
                    </div>
                    <div class="quantity-selector">
                        <button class="decrease">-</button>
                        <span class="quantity">1</span>
                        <button class="increase">+</button>
                    </div>
                    <button class="add-to-cart">
                        <span class="button-text">Agregar</span>
                        <span class="button-icon">🛒</span>
                    </button>
                </div>
            </div>
        `).join('');

    // Inicializar lazy loading y scroll reveal
    initializeLazyLoading();
    initializeScrollReveal();
    addProductEventListeners();
};

// Generar estrellas de rating
const generateRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
        ${'★'.repeat(fullStars)}
        ${hasHalfStar ? '½' : ''}
        ${'☆'.repeat(emptyStars)}
    `;
};

// Lazy loading para imágenes
const initializeLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Scroll reveal para elementos
const initializeScrollReveal = () => {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => scrollObserver.observe(element));
};

// Event listeners para productos
const addProductEventListeners = () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productId = parseInt(card.dataset.id);
        const decreaseBtn = card.querySelector('.decrease');
        const increaseBtn = card.querySelector('.increase');
        const quantitySpan = card.querySelector('.quantity');
        const addToCartBtn = card.querySelector('.add-to-cart');

        decreaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity > 1) {
                quantitySpan.textContent = quantity - 1;
                animateButton(decreaseBtn);
            }
        });

        increaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent);
            quantitySpan.textContent = quantity + 1;
            animateButton(increaseBtn);
        });

        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantitySpan.textContent);
            addToCart(productId, quantity);
            animateButton(addToCartBtn);
            quantitySpan.textContent = '1';
        });
    });
};

// Animación de botones
const animateButton = (button) => {
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200);
};

// Agregar al carrito con animación
const addToCart = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
        showToast(`Se actualizó la cantidad de ${product.name} en el carrito`);
    } else {
        cart.push({
            productId,
            quantity,
            name: product.name,
            price: product.discountPrice,
            image: product.image
        });
        showToast(`¡${product.name} agregado al carrito!`);
    }

    // Animar icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 1000);

    updateCartCount();
    updateCartModal();
    saveCart();
};

// Actualizar contador del carrito con animación
const updateCartCount = () => {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    cartCount.classList.add('pulse');
    setTimeout(() => cartCount.classList.remove('pulse'), 300);
};

// Actualizar modal del carrito con animaciones
const updateCartModal = () => {
    const cartItems = document.querySelector('.cart-items');
    const subtotalSpan = document.getElementById('cartSubtotal');
    const totalSpan = document.getElementById('cartTotal');

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-id="${item.productId}" style="animation-delay: ${index * 0.1}s">
            <img src="src/assets/images/${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="quantity-selector">
                    <button class="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
            <button class="remove-item">×</button>
        </div>
    `).join('');

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Animación de números
    animateNumber(subtotalSpan, subtotal);
    animateNumber(totalSpan, subtotal);

    addCartEventListeners();
};

// Animación de números
const animateNumber = (element, finalValue) => {
    const duration = 500;
    const startValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
        element.textContent = formatPrice(currentValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};

// Event listeners iniciales
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    loadCart();

    // Event listener para el icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', toggleCart);

    // Event listener para el botón de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showLoader();
            setTimeout(() => {
                hideLoader();
                showToast('¡Gracias por tu compra! Tu pedido está en camino.', 'success');
                cart = [];
                updateCartCount();
                updateCartModal();
                saveCart();
                toggleCart();
            }, 1500);
        } else {
            showToast('Tu carrito está vacío. Agrega algunos productos antes de finalizar la compra.', 'error');
        }
    });

    // Inicializar scroll reveal
    initializeScrollReveal();
}); 