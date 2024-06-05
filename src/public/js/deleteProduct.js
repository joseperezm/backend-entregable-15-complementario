document.addEventListener("DOMContentLoaded", function() {
    const deleteButtons = document.querySelectorAll('.delete-product-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartId = this.getAttribute('data-cart-id');
            const productId = this.getAttribute('data-product-id');

            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
        });
    });
});