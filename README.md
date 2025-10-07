# Sala de Juegos - Agustín Mondani

Este repositorio contiene mi proyecto **Sala de Juegos**, una aplicación web desarrollada como parte de la Tecnicatura Universitaria en Programación en la UTN. La app combina distintos juegos, login con Supabase, almacenamiento de resultados y componentes.
---

## 🔹 Contenido del proyecto

La web incluye:

1. **Sistema de Autenticación**
   - Registro e inicio de sesión con **Supabase**.
   - Mensajes emergentes para indicar login exitoso.
   - Logout y navegación segura mediante `AuthGuard`.

2. **Sala de Chat**
   - Chat en tiempo real usando **Supabase**.
   - Suscripción a nuevos mensajes para actualización automática.
   - Mensajes limitados a 50 caracteres.
   - Scroll automático al final del chat.
   - Diferenciación visual entre mensajes propios y de otros usuarios.

3. **Juegos incluidos**
   - **Ahorcado**
   - **Mayor o Menor**
   - **Preguntados**
   - **Batalla Naval** *(mi juego propio)*

---

## 🔹 Mi juego propio: Batalla Naval

**Batalla Naval** es un juego estratégico de tablero en el que el jugador debe encontrar y hundir **7 barcos** escondidos en un tablero de 6x6.  

### Mecánicas principales:
- El jugador tiene **8 intentos** para encontrar todos los barcos.
- Cada casilla puede contener:
  - Un barco (**hit**) si se acierta.
  - Agua (**miss**) si se falla, mostrando un **número** que indica la distancia más corta hasta el barco más cercano.
- La pista numérica permite planificar la estrategia para los siguientes movimientos.
- La interfaz incluye animaciones visuales de barcos, explosiones y splashes.
- Al finalizar el juego, se calcula un puntaje basado en aciertos e intentos restantes.
- El puntaje se guarda automáticamente en la base de datos mediante **Supabase** y un servicio de puntuaciones.

🎯 Objetivo: Hundir los 7 barcos antes de quedarte sin intentos.

---

## 🔹 Tecnologías utilizadas

- **Frontend:** Angular (v17) y SCSS para estilos.
- **Autenticación y datos:** Supabase
- **Host** Firebase
- **Gestión de rutas y seguridad:** Angular Router + `AuthGuard`.

---
<img width="534" height="496" alt="image" src="https://github.com/user-attachments/assets/ae3052c8-302d-4441-9d2d-baf28e3312d5" />
<img width="1916" height="892" alt="image" src="https://github.com/user-attachments/assets/2bd7578d-c817-4b21-ac09-50bb83c801d2" />

