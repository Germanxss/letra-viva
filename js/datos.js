/* =========================================================
   Letra Viva - Datos del catálogo
   Obras de dominio público. Cada libro tiene la información
   que se muestra en las tarjetas y en la ventana de detalle.
   estado: "disponible" | "prestado" | "digital"
   ========================================================= */

const CATEGORIAS = {
  latinoamericana: "Literatura latinoamericana",
  clasicos: "Clásicos universales",
  ciencia: "Ciencia y filosofía",
  aventura: "Aventura y ciencia ficción"
};

const LIBROS = [
  {
    id: "maria",
    titulo: "María",
    autor: "Jorge Isaacs",
    anio: 1867,
    categoria: "latinoamericana",
    paginas: 352,
    formato: "Físico y digital",
    estado: "disponible",
    color: "#7a2e3a",
    patron: "flores",
    sinopsis: "Efraín regresa a la hacienda familiar en el Valle del Cauca y vive un amor juvenil con su prima María. Es una de las novelas más importantes del romanticismo hispanoamericano, con paisajes que retratan la vida rural colombiana del siglo XIX."
  },
  {
    id: "voragine",
    titulo: "La vorágine",
    autor: "José Eustasio Rivera",
    anio: 1924,
    categoria: "latinoamericana",
    paginas: 304,
    formato: "Físico y digital",
    estado: "prestado",
    devolucion: "24 de noviembre",
    color: "#2f5d3a",
    patron: "selva",
    sinopsis: "Arturo Cova huye de Bogotá y termina internado en la selva amazónica, donde descubre la explotación de los trabajadores caucheros. La novela denuncia la violencia de esa época y presenta la selva como una fuerza que devora a quienes entran en ella."
  },
  {
    id: "cuentos-selva",
    titulo: "Cuentos de la selva",
    autor: "Horacio Quiroga",
    anio: 1918,
    categoria: "latinoamericana",
    paginas: 128,
    formato: "Físico",
    estado: "disponible",
    color: "#b5762b",
    patron: "hojas",
    sinopsis: "Colección de relatos protagonizados por animales de la selva de Misiones. Con un lenguaje sencillo, cada cuento deja una enseñanza sobre la amistad, la astucia y el respeto por la naturaleza. Ideal para lectores de todas las edades."
  },
  {
    id: "azul",
    titulo: "Azul...",
    autor: "Rubén Darío",
    anio: 1888,
    categoria: "latinoamericana",
    paginas: 176,
    formato: "Digital",
    estado: "digital",
    color: "#2d4f8a",
    patron: "estrellas",
    sinopsis: "Libro de cuentos y poemas que dio inicio al modernismo en la lengua española. Darío renueva el idioma con imágenes llenas de color, musicalidad y referencias al arte y la mitología."
  },
  {
    id: "quijote",
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    anio: 1605,
    categoria: "clasicos",
    paginas: 1250,
    formato: "Físico y digital",
    estado: "disponible",
    color: "#8a5a2b",
    patron: "molinos",
    sinopsis: "Un hidalgo que ha leído demasiados libros de caballería decide convertirse en caballero andante y recorrer España junto a su escudero Sancho Panza. Considerada la primera novela moderna, mezcla humor, crítica social y reflexión sobre la realidad y la ficción."
  },
  {
    id: "orgullo",
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    anio: 1813,
    categoria: "clasicos",
    paginas: 432,
    formato: "Físico y digital",
    estado: "prestado",
    devolucion: "19 de noviembre",
    color: "#6b4a7a",
    patron: "lineas",
    sinopsis: "Elizabeth Bennet y el señor Darcy se juzgan mal desde su primer encuentro. A través de conversaciones ingeniosas, la novela retrata las costumbres de la sociedad inglesa y muestra cómo las primeras impresiones pueden engañar."
  },
  {
    id: "romeo",
    titulo: "Romeo y Julieta",
    autor: "William Shakespeare",
    anio: 1597,
    categoria: "clasicos",
    paginas: 160,
    formato: "Digital",
    estado: "digital",
    color: "#a23b3b",
    patron: "rombos",
    sinopsis: "Dos jóvenes de familias enfrentadas en Verona se enamoran y se casan en secreto. La tragedia más famosa del teatro explora el amor, el destino y las consecuencias del odio entre generaciones."
  },
  {
    id: "metamorfosis",
    titulo: "La metamorfosis",
    autor: "Franz Kafka",
    anio: 1915,
    categoria: "clasicos",
    paginas: 96,
    formato: "Físico y digital",
    estado: "disponible",
    color: "#3d4a52",
    patron: "puntos",
    sinopsis: "Gregor Samsa despierta una mañana convertido en un insecto. A partir de esta situación absurda, Kafka reflexiona sobre la soledad, el trabajo y la forma en que la familia responde cuando uno de sus miembros deja de ser útil."
  },
  {
    id: "origen",
    titulo: "El origen de las especies",
    autor: "Charles Darwin",
    anio: 1859,
    categoria: "ciencia",
    paginas: 512,
    formato: "Físico y digital",
    estado: "disponible",
    color: "#4f6b4a",
    patron: "hojas",
    sinopsis: "Obra fundamental de la biología en la que Darwin expone la teoría de la evolución por selección natural, apoyada en observaciones realizadas durante su viaje alrededor del mundo a bordo del Beagle."
  },
  {
    id: "discurso",
    titulo: "Discurso del método",
    autor: "René Descartes",
    anio: 1637,
    categoria: "ciencia",
    paginas: 120,
    formato: "Digital",
    estado: "digital",
    color: "#24405e",
    patron: "lineas",
    sinopsis: "Tratado filosófico en el que Descartes propone un método para llegar a conocimientos seguros mediante la duda y el razonamiento. Aquí aparece su conocida frase «pienso, luego existo»."
  },
  {
    id: "frankenstein",
    titulo: "Frankenstein",
    autor: "Mary Shelley",
    anio: 1818,
    categoria: "aventura",
    paginas: 280,
    formato: "Físico y digital",
    estado: "prestado",
    devolucion: "21 de noviembre",
    color: "#38474a",
    patron: "rayos",
    sinopsis: "Victor Frankenstein logra dar vida a un ser creado a partir de restos humanos y luego lo abandona. Considerada la primera novela de ciencia ficción, plantea preguntas sobre la responsabilidad del científico y el rechazo a lo diferente."
  },
  {
    id: "veinte-mil",
    titulo: "Veinte mil leguas de viaje submarino",
    autor: "Julio Verne",
    anio: 1870,
    categoria: "aventura",
    paginas: 448,
    formato: "Físico y digital",
    estado: "disponible",
    color: "#1f5a73",
    patron: "olas",
    sinopsis: "El profesor Aronnax es capturado por el misterioso capitán Nemo y recorre los océanos del mundo a bordo del Nautilus, un submarino adelantado a su tiempo. Una aventura llena de ciencia, exploración y descubrimientos."
  }
];
