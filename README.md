# BeerExpress 🍺

BeerExpress es una aplicación web de e-commerce para la venta de cervezas y bebidas, inspirada en apps como Rappi y BEES. Esta versión es un prototipo frontend que demuestra la interfaz de usuario y funcionalidad básica del carrito de compras.

## Características 🌟

- Diseño moderno y responsivo
- Categorías de productos
- Banner promocional
- Menú de accesos rápidos
- Listado de productos destacados
- Carrito de compras funcional
- Persistencia del carrito en localStorage
- Interfaz adaptada a móviles

## Tecnologías Utilizadas 💻

- HTML5
- CSS3 (con variables CSS y diseño responsivo)
- JavaScript vanilla (ES6+)
- LocalStorage para persistencia de datos

## Estructura del Proyecto 📁

```
BeerExpress/
├── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── README.md
```

## Cómo Usar 🚀

1. Clona este repositorio:
```bash
git clone [url-del-repositorio]
```

2. Abre el archivo `index.html` en tu navegador web preferido.

3. Para desarrollo, se recomienda usar un servidor local como Live Server de VS Code.

## Funcionalidades Principales 🛠️

### Carrito de Compras
- Agregar productos
- Modificar cantidades
- Eliminar productos
- Persistencia de datos
- Simulación de checkout

### Categorías
- Navegación por categorías
- Imágenes y nombres descriptivos
- Diseño grid responsivo

### Productos
- Imágenes de productos
- Precios con descuentos
- Selector de cantidad
- Botón de agregar al carrito

## Personalización 🎨

### Colores
Los colores principales se pueden modificar en el archivo `styles.css`:

```css
:root {
    --primary-color: #FF6B00;
    --secondary-color: #FFB800;
    --background-color: #F5F5F5;
    --text-color: #333333;
}
```

### Productos
Los productos se pueden modificar en el archivo `app.js`:

```javascript
const products = [
    {
        id: 1,
        name: 'Nombre del Producto',
        description: 'Descripción',
        originalPrice: 1000,
        discountPrice: 900,
        image: 'imagen.jpg'
    },
    // ...
];
```

## Próximas Mejoras 🚀

- [ ] Integración con backend
- [ ] Sistema de autenticación
- [ ] Procesamiento real de pagos
- [ ] Historial de pedidos
- [ ] Sistema de búsqueda
- [ ] Filtros avanzados
- [ ] Reseñas de productos
- [ ] Sistema de notificaciones

## Contribuir 🤝

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia 📄

Este proyecto está bajo la Licencia MIT - mira el archivo `LICENSE` para detalles 