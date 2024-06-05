    document.addEventListener('DOMContentLoaded', () => {
        ['success-message', 'error-message'].forEach(id => {
            const messageElement = document.getElementById(id);
            if (messageElement) {
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
            }
        });
    });
