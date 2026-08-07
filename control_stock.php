<?php
include 'db.php'; // conexión a MySQL

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $producto_id = intval($_POST["producto_id"]);
    $cantidad = intval($_POST["cantidad"]);

    // Validamos que los valores sean correctos
    if ($producto_id <= 0 || $cantidad <= 0) {
        echo "Error: datos inválidos.";
        exit;
    }

    // Verificamos si el producto existe y su stock actual
    $sql = "SELECT StockActual, Estado FROM Productos WHERE ProductoID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $producto_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $producto = $resultado->fetch_assoc();
        $stock_actual = $producto["StockActual"];

        if ($producto["Estado"] == "Agotado") {
            echo "El producto ya está agotado.";
            exit;
        }

        // Si hay stock suficiente, descontamos
        if ($stock_actual >= $cantidad) {
            $nuevo_stock = $stock_actual - $cantidad;

            // Actualizamos el stock
            $sql_update = "UPDATE Productos SET StockActual = ? WHERE ProductoID = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("ii", $nuevo_stock, $producto_id);
            $stmt_update->execute();

            // Si llega a 0, marcamos como agotado
            if ($nuevo_stock <= 0) {
                $sql_estado = "UPDATE Productos SET Estado = 'Agotado' WHERE ProductoID = ?";
                $stmt_estado = $conn->prepare($sql_estado);
                $stmt_estado->bind_param("i", $producto_id);
                $stmt_estado->execute();
                echo "El producto se agotó y fue retirado de la tienda.";
            } else {
                echo "Producto agregado al carrito. Stock restante: $nuevo_stock";
            }
        } else {
            echo "Stock insuficiente. Solo quedan $stock_actual unidades.";
        }
    } else {
        echo "Error: producto no encontrado.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Método no permitido.";
}
?>