document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('admin-flag')) {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const cartLink = document.querySelector('.nav-link[href*="/carts/"]');
        const href = cartLink ? cartLink.getAttribute('href') : '';
        const cartId = href.split('/carts/')[1];

        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const quantityInput = document.getElementById(`quantity-${productId}`);
                const quantity = quantityInput ? quantityInput.value : 1;

                fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessage('Producto añadido al carrito con éxito', 'success');
                    } else {
                        showMessage(data.message || 'Error al añadir el producto al carrito', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('No se pudo añadir el producto al carrito.', 'error');
                });
            });
        });
    }
});

const showMessage = (message, type) => {
    const messageContainer = document.createElement("div");
    messageContainer.className = `alert alert-${type}`;
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}