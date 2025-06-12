# 🎮 Sala de Juegos - UTN

Bienvenido/a a **Sala de Juegos**, una aplicación desarrollada con Angular como parte de la materia *Laboratorio 2* (UTN - 2025).

---

## 🚀 Tecnologías Utilizadas

- **Angular** (v19)
- **Firebase** ( Hosting)
- **Supabase** ( Auth, Storage)
- **TypeScript / HTML / SCSS**
- **Deck of Cards API** (para el juego Mayor o Menor)
- **The Simpsons Quote API** (para el juego Preguntados)

---

## 🧩 Funcionalidades

### 🟢 Login / Registro
- Autenticación con Supabase.
- Registro de nuevos usuarios con email y nombre.
- Persistencia de sesión.

### 🧠 Juegos Disponibles

#### 📈 Mayor o Menor
- Adiviná si la siguiente carta será mayor o menor.
- API externa de cartas (deckofcardsapi.com).
- Guarda puntaje al finalizar.

#### ❓ Preguntados (Los Simpson)
- Juego de elección múltiple basado en personajes de Los Simpson.
- Pregunta sobre quien es el personaje con imágenes y opciones.
- Almacena puntaje con nombre de usuario.

#### 🔤 Ahorcado
- Adiviná la palabra letra por letra.
- Puntaje según intentos.

#### 🟰 Juego Propio WORDLE
-El juego consiste en adivinar la palabra.
-Son 6 intentos y el juego va dando pistas de las posiciones de las letras.

---

### 💬 Chat
- Chat global en tiempo real usando Supabase Realtime.
- Permite enviar y visualizar mensajes entre usuarios logueados.

---

### 📊 Encuestas
- Encuestas de opinión sobre el juego creado.

---

### 🧾 Historial y Puntajes
- Puntajes por juego y por usuario guardados en Supabase.
- Visualización de resultados por usuario.
- Filtro por tipo de juego.

