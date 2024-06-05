document.getElementById('finalize-purchase').addEventListener('click', function() {
    const cartId = this.getAttribute('data-cart-id');

    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Compra finalizada con éxito!');
            if (data.failedProducts && data.failedProducts.length > 0) {
                let failedMessage = 'Algunos productos no pudieron ser comprados debido a falta de stock: ';
                data.failedProducts.forEach(prod => {
                    failedMessage += `${prod.title} ID:${prod._id} / `;
                });
                failedMessage;
                alert(failedMessage);
            }
            window.location.href = '/products';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error al procesar la compra:', error);
        alert('Error al finalizar la compra, por favor intente nuevamente.');
    });
});