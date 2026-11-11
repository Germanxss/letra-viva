# Letra Viva · Biblioteca virtual

Aplicación web responsiva para una biblioteca pública. Permite consultar el catálogo, verificar la disponibilidad de los libros y reservarlos en línea para recogerlos en la sede o leerlos en formato digital. También presenta los servicios, los espacios, la agenda de eventos y las preguntas frecuentes de la biblioteca.

**Autor:** German Andres Tirado Ariza
**Programa:** Ingeniería de Software

## Problemática

El catálogo de la biblioteca solo podía consultarse en la sede. Los usuarios se desplazaban sin saber si el libro estaba disponible, se formaban filas para apartar libros y muchos servicios eran poco conocidos. Letra Viva lleva esa información a cualquier dispositivo.

## Cómo ver el proyecto

No requiere instalación. Abre el archivo `index.html` en un navegador moderno (Chrome, Edge, Firefox o Safari).

## Estructura

```
letra-viva/
├── index.html              Estructura de la página (HTML5 semántico)
├── css/
│   ├── estilos.css         Variables, tipografías, base y encabezado
│   ├── componentes.css     Botones, tarjetas, formularios, ventanas y galería
│   └── responsive.css      Media Queries (mobile-first)
├── js/
│   ├── datos.js            Datos del catálogo de libros
│   └── app.js              Búsqueda, filtros, ventanas, mi lista, galería y reservas
├── img/                    Ilustraciones e íconos SVG
│   └── patrones/           Motivos decorativos de las portadas
├── fonts/                  Tipografías Lora e Inter (.woff2)
└── docs/
    └── documentacion.pdf   Documentación del proyecto
```

## Video de validación

https://youtu.be/msi-Jd10GaI

## Funcionalidades

- Buscador en la portada y en el catálogo.
- Filtros por categoría, interruptor «Solo disponibles» y ordenamiento.
- Tarjetas de libros con estado de disponibilidad.
- Ventana de detalle de cada libro.
- «Mi lista de lectura» guardada en el navegador.
- Galería de espacios con visor ampliado.
- Inscripción a eventos con conteo de cupos.
- Preguntas frecuentes desplegables.
- Formulario de reservas con validación y modalidad física o digital.
- Modo nocturno.
- Menú de navegación adaptable.

## Diseño responsivo

| Ancho | Dispositivo | Catálogo |
|---|---|---|
| Menos de 380 px | Teléfono pequeño | 1 columna |
| Base | Teléfono | 2 columnas |
| 600 px o más | Tableta pequeña | 3 columnas |
| 768 px o más | Tableta | 3 columnas, portada en 2 columnas |
| 1024 px o más | Computador | 4 columnas, menú horizontal |

## Tecnologías

HTML5, CSS3 (variables, Flexbox, CSS Grid, Media Queries) y JavaScript sin librerías externas.
