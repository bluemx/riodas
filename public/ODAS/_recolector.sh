#!/bin/bash

# Carpeta de origen
origen="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Carpeta de destino en el escritorio
destino="$HOME/Desktop/odas"

# Comprobar si la carpeta de destino existe
if [ ! -d "$destino" ]; then
    mkdir -p "$destino"
fi

# Solicitar nombres de carpeta al usuario
echo "Ingrese los nombres de las carpetas separados por espacios:"
read -r carpetas_input

# Convertir la entrada en un array
IFS=' ' read -ra carpetas <<< "$carpetas_input"

# Iterar sobre el array de nombres de carpeta
for carpeta in "${carpetas[@]}"; do
    # Comprobar si la carpeta de origen existe
    if [ -d "$origen/$carpeta" ]; then
        # Crear la carpeta de destino si no existe
        mkdir -p "$destino"

        # Copiar la carpeta de origen a la carpeta de destino
        cp -R "$origen/$carpeta" "$destino"

        # Comprimir la carpeta en un archivo ZIP
        #zip -r "$destino/$carpeta.zip" "$destino/$carpeta"
        
        # Eliminar la carpeta de destino (opcional, descomenta la siguiente línea si quieres eliminarla)
        # rm -rf "$destino/$carpeta"
    else
        echo "La carpeta $carpeta no existe en el directorio de origen."
    fi
done

echo "¡Proceso completado!"
