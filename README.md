# ⚽ FULBODLE

¡Bienvenido a **FULBODLE**, el desafío diario para los amantes del fútbol! Inspirado en el famoso juego Wordle, pero adaptado íntegramente al universo del fútbol profesional. ¿Podrás adivinar el equipo del día antes de quedarte sin intentos?

---

## 🎮 Cómo jugar

Tu objetivo es adivinar un club de fútbol oculto (puede ser de Argentina, Europa o el resto de América).

1.  **Ingresa un equipo:** Escribe el nombre en el buscador y selecciónalo.
2.  **Analiza las pistas:** Cada columna te dará información sobre la relación entre tu intento y el equipo objetivo:
    * **País:** Si el equipo es de la misma nación.
    * **Federación:** Si comparten confederación (CONMEBOL, UEFA, CONCACAF, etc.).
    * **Categoría:** Si juegan en la misma división (1 para Primera, 2 para Segunda).
    * **Colores:** Indica si comparten colores institucionales (Verde = Coincidencia total, Amarillo = Coincidencia parcial).
    * **Palmarés:** Cantidad de títulos de liga local. Una flecha te indicará si el número es mayor o menor.
    * **Fundación:** Año en que se creó el club. También incluye flechas de guía.
3.  **Límite de intentos:** ¡Ten cuidado! Solo tienes **5 intentos** para ganar.

---

## 🛠️ Características Técnicas

* **Interfaz de Usuario (UI):** Estética de "Ficha Técnica" con celdas de proporción **2:1** para mayor legibilidad de textos largos.
* **Diseño:** Minimalista y limpio, con un color base Verde Ceniza (`#396145`) y tipografía *Outfit*.
* **Mensajes Dinámicos:** Si pierdes, recibirás una frase aleatoria con el mejor folklore del fútbol (ej. *"¡Era por abajo, Palacio!"*).
* **Base de Datos:** Amplio catálogo que incluye:
    * Todo el fútbol Argentino (A y B).
    * Ligas completas: Premier League, La Liga, Serie A.
    * Top clubes de Brasil, México, MLS y resto de Sudamérica.

---

## 🚀 Instalación y Desarrollo

Este proyecto fue construido con **React** y **Tailwind CSS**.

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/fulbodle.git](https://github.com/tu-usuario/fulbodle.git)
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

---

## 📝 Notas de Versión
* **Intentos:** Ajustados a 5 para aumentar la dificultad.
* **Proporción:** Celdas optimizadas a 2:1 para visualización móvil.
* **Nombre:** Branding actualizado a **FULBODLE**.

---

*"La próxima pedí el VAR, capaz te dan por válida la respuesta."* 🏁
