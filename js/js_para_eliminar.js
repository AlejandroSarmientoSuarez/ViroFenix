document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-user-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
         
            const userId = this.getAttribute('data-user-id'); 

            if (!userId) {
                alert('Error: No se encontró el ID de usuario.');
                return;
            }

            if (confirm('¿Estás seguro de que deseas eliminar al usuario con ID ' + userId + '?')) {
                
               
                fetch('eliminar_usuario_seguro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `id=${userId}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('✅ Usuario eliminado correctamente.');
                       
                        this.closest('tr').remove(); 
                    } else {
                        alert('❌ Error al eliminar: ' + (data.message || 'Error desconocido.'));
                    }
                })
                .catch(error => {
                    console.error('Error de conexión:', error);
                    alert('Error en la comunicación con el servidor.');
                });
            }
        });
    });
});