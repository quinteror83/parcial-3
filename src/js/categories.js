document.addEventListener('DOMContentLoaded', () => {
    // Filtrado de categorías
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Filtrar categorías
            categoryCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else if (card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Búsqueda en tiempo real
    const searchInput = document.querySelector('.search-bar input');
    const searchSuggestions = document.querySelector('.search-suggestions');

    // Datos de ejemplo para la búsqueda
    const searchData = [
        'Cerveza Aguila',
        'Corona Extra',
        'Heineken',
        'Club Colombia',
        'BBC Cajicá',
        'Stella Artois',
        'Budweiser',
        'Miller Lite',
        'Poker',
        'Costeña'
    ];

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            const filteredResults = searchData.filter(item => 
                item.toLowerCase().includes(searchTerm)
            );

            if (filteredResults.length > 0) {
                searchSuggestions.innerHTML = filteredResults.map(result => `
                    <div class="search-suggestion-item">
                        <img src="src/assets/images/products/${result.toLowerCase().replace(' ', '-')}.jpg" 
                             alt="${result}" 
                             onerror="this.src='src/assets/images/products/default.jpg'">
                        <span>${result}</span>
                    </div>
                `).join('');
                searchSuggestions.style.display = 'block';
            } else {
                searchSuggestions.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
                searchSuggestions.style.display = 'block';
            }
        } else {
            searchSuggestions.style.display = 'none';
        }
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });

    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            // Aquí iría la lógica para enviar el email al servidor
            showToast('¡Gracias por suscribirte!');
            emailInput.value = '';
        }
    });

    // Sistema de notificaciones toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Forzar un reflow para que la animación funcione
        toast.offsetHeight;
        
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Lazy loading para imágenes
    const images = document.querySelectorAll('.category-image img');
    
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

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}); 