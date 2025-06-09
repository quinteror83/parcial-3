// Datos de ejemplo (en un proyecto real, esto vendría de una API)
const products = [
    {
        id: 1,
        title: "Cerveza Aguila Light",
        category: "nacionales",
        brand: "aguila",
        price: 2500,
        originalPrice: 3000,
        rating: 4.5,
        reviews: 128,
        image: "../assets/images/products/aguila-light.jpg",
        stock: 50,
        badge: "Popular"
    },
    {
        id: 2,
        title: "Corona Extra",
        category: "importadas",
        brand: "corona",
        price: 4500,
        originalPrice: 5000,
        rating: 4.8,
        reviews: 256,
        image: "../assets/images/products/corona.jpg",
        stock: 30,
        badge: "Importada"
    },
    // Más productos aquí...
];

// Estado de la aplicación
let state = {
    filters: {
        categories: [],
        brands: [],
        ratings: [],
        priceRange: {
            min: 0,
            max: 100000
        }
    },
    sort: "relevance",
    currentPage: 1,
    itemsPerPage: 12
};

// Elementos DOM
const productsGrid = document.querySelector('.products-grid');
const productsCount = document.querySelector('.products-count span');
const sortSelect = document.getElementById('sortSelect');
const filterInputs = document.querySelectorAll('.filter-option input');
const priceRange = document.getElementById('priceRange');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const clearFiltersBtn = document.querySelector('.clear-filters');
const paginationContainer = document.querySelector('.pagination');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderProducts();
    setupEventListeners();
});

// Inicializar filtros
function initializeFilters() {
    // Establecer valores iniciales para el rango de precios
    const prices = products.map(p => p.price);
    const maxPrice = Math.max(...prices);
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    maxPriceInput.value = maxPrice;
    state.filters.priceRange.max = maxPrice;
}

// Configurar event listeners
function setupEventListeners() {
    // Event listener para ordenamiento
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        renderProducts();
    });

    // Event listeners para filtros de checkbox
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateFilters();
            renderProducts();
        });
    });

    // Event listeners para filtros de precio
    priceRange.addEventListener('input', updatePriceFilter);
    minPriceInput.addEventListener('change', updatePriceFilter);
    maxPriceInput.addEventListener('change', updatePriceFilter);

    // Event listener para limpiar filtros
    clearFiltersBtn.addEventListener('click', clearFilters);
}

// Actualizar filtros
function updateFilters() {
    state.filters.categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(input => input.value);
    state.filters.brands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(input => input.value);
    state.filters.ratings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(input => Number(input.value));
}

// Actualizar filtro de precio
function updatePriceFilter() {
    state.filters.priceRange.min = Number(minPriceInput.value) || 0;
    state.filters.priceRange.max = Number(maxPriceInput.value) || priceRange.max;
    renderProducts();
}

// Limpiar filtros
function clearFilters() {
    filterInputs.forEach(input => input.checked = false);
    priceRange.value = priceRange.max;
    minPriceInput.value = '';
    maxPriceInput.value = priceRange.max;
    state.filters = {
        categories: [],
        brands: [],
        ratings: [],
        priceRange: {
            min: 0,
            max: priceRange.max
        }
    };
    renderProducts();
}

// Filtrar productos
function filterProducts(products) {
    return products.filter(product => {
        const matchesCategory = state.filters.categories.length === 0 || state.filters.categories.includes(product.category);
        const matchesBrand = state.filters.brands.length === 0 || state.filters.brands.includes(product.brand);
        const matchesRating = state.filters.ratings.length === 0 || state.filters.ratings.some(rating => product.rating >= rating);
        const matchesPrice = product.price >= state.filters.priceRange.min && product.price <= state.filters.priceRange.max;

        return matchesCategory && matchesBrand && matchesRating && matchesPrice;
    });
}

// Ordenar productos
function sortProducts(products) {
    const sortedProducts = [...products];
    switch (state.sort) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// Paginar productos
function paginateProducts(products) {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return products.slice(startIndex, startIndex + state.itemsPerPage);
}

// Renderizar productos
function renderProducts() {
    let filteredProducts = filterProducts(products);
    const sortedProducts = sortProducts(filteredProducts);
    const paginatedProducts = paginateProducts(sortedProducts);

    productsCount.textContent = `${filteredProducts.length} productos`;
    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    renderPagination(filteredProducts.length);
    initializeCartButtons();
}

// Crear tarjeta de producto
function createProductCard(product) {
    const stars = createStarRating(product.rating);
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
}

// Crear calificación de estrellas
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

// Renderizar paginación
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    const paginationNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');

    // Actualizar estado de botones prev/next
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;

    // Event listeners para botones prev/next
    prevBtn.onclick = () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
        }
    };

    nextBtn.onclick = () => {
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
        }
    };

    // Renderizar números de página
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= state.currentPage - 1 && i <= state.currentPage + 1)
        ) {
            paginationHTML += `
                <button class="page-number ${i === state.currentPage ? 'active' : ''}"
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (
            i === state.currentPage - 2 ||
            i === state.currentPage + 2
        ) {
            paginationHTML += '<span>...</span>';
        }
    }

    paginationNumbers.innerHTML = paginationHTML;
}

// Cambiar página
function changePage(page) {
    state.currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializar botones de carrito
function initializeCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
        });
    });
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === Number(productId));
    if (product) {
        // Aquí iría la lógica para agregar al carrito
        // Por ahora solo mostraremos una notificación
        showToast(`${product.title} agregado al carrito`, 'success');
        updateCartCount();
    }
}

// Mostrar notificación
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

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    // Aquí iría la lógica para obtener la cantidad real de items en el carrito
    const currentCount = Number(cartCount.textContent);
    cartCount.textContent = currentCount + 1;
} 