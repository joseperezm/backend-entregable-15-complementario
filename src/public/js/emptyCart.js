document.addEventListener("DOMContentLoaded", function() {
    const deleteButtons = document.querySelectorAll('.delete-cart-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartId = this.getAttribute('data-cart-id');
            
            if (confirm('¿Estás seguro de que quieres vaciar este carrito?')) {
                fetch(`/api/carts/${cartId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert('Carrito vaciado correctamente');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al vaciar el carrito');
                });
            }
        });
    });
});