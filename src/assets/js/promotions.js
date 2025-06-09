// Datos de ejemplo (en un proyecto real, esto vendría de una API)
const promotions = {
    dailyDeal: {
        id: 1,
        title: "Pack Premium",
        description: "6 cervezas artesanales + 2 vasos de regalo",
        price: 89900,
        originalPrice: 120000,
        image: "../assets/images/promotions/deal1.jpg",
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas desde ahora
    },
    weeklyDeals: [
        {
            id: 2,
            title: "Combo Familiar",
            description: "24 unidades nacionales",
            price: 60000,
            originalPrice: 80000,
            image: "../assets/images/promotions/deal2.jpg",
            discount: 25
        },
        {
            id: 3,
            title: "Pack Internacional",
            description: "6 cervezas importadas",
            price: 52000,
            originalPrice: 65000,
            image: "../assets/images/promotions/deal3.jpg",
            discount: 20
        }
    ]
};

// Contador de tiempo para la oferta del día
function updateDealTimer() {
    const now = new Date();
    const endTime = new Date(promotions.dailyDeal.endTime);
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        document.getElementById('dealTimer').textContent = "¡Oferta terminada!";
        return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('dealTimer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Inicializar contador
setInterval(updateDealTimer, 1000);

// Manejar botones de agregar al carrito
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.deal-card');
        let product;

        if (card.classList.contains('large')) {
            product = promotions.dailyDeal;
        } else {
            const productId = parseInt(card.dataset.productId);
            product = promotions.weeklyDeals.find(deal => deal.id === productId);
        }

        if (product) {
            window.cart.addItem(product);
        }
    });
});

// Manejar botones de ver más
document.querySelectorAll('.view-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const day = this.closest('.promotion-card').querySelector('.promotion-day').textContent;
        showDayPromotions(day);
    });
});

// Mostrar promociones del día
function showDayPromotions(day) {
    // Aquí iría la lógica para mostrar las promociones específicas del día
    showToast(`Mostrando promociones para ${day}`, 'success');
}

// Manejar formulario de cupón
const couponForm = document.querySelector('.coupon-form');
if (couponForm) {
    couponForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const couponInput = this.querySelector('input');
        const couponCode = couponInput.value.trim();

        if (couponCode) {
            validateCoupon(couponCode);
        } else {
            showToast('Por favor ingresa un código de cupón', 'error');
        }
    });
}

// Validar cupón
function validateCoupon(code) {
    // Aquí iría la validación real del cupón contra el backend
    const validCoupons = {
        'WELCOME10': 10,
        'SUMMER20': 20,
        'SPECIAL30': 30
    };

    if (validCoupons[code]) {
        showToast(`¡Cupón aplicado! ${validCoupons[code]}% de descuento`, 'success');
        // Aquí iría la lógica para aplicar el descuento
    } else {
        showToast('Cupón inválido', 'error');
    }
}

// Manejar formulario de newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email && isValidEmail(email)) {
            subscribeToNewsletter(email);
        } else {
            showToast('Por favor ingresa un email válido', 'error');
        }
    });
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Suscribir al newsletter
function subscribeToNewsletter(email) {
    // Aquí iría la lógica real de suscripción
    showToast('¡Gracias por suscribirte!', 'success');
    document.querySelector('.newsletter-form').reset();
}

// Animaciones al hacer scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.deal-card, .promotion-card');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight * 0.8) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar contador
    updateDealTimer();

    // Configurar animaciones de scroll
    window.addEventListener('scroll', handleScrollAnimations);

    // Aplicar estilos iniciales para animaciones
    document.querySelectorAll('.deal-card, .promotion-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Trigger inicial para las animaciones
    handleScrollAnimations();
}); 