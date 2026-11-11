/* =========================================================
   Letra Viva - Lógica de la interfaz
   1.  Utilidades
   2.  Modo nocturno
   3.  Menú de navegación adaptable
   4.  Encabezado, enlace activo y botón "volver arriba"
   5.  Catálogo: búsqueda, filtros, orden y tarjetas
   6.  Ventana de detalle del libro
   7.  Mi lista de lectura (panel lateral)
   8.  Galería de espacios
   9.  Inscripción a eventos
   10. Formulario de reservas
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. Utilidades ---------- */
  const $ = (selector, contexto = document) => contexto.querySelector(selector);
  const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];
  const raiz = document.documentElement;
  const cuerpo = document.body;

  // Quita tildes y pasa a minúsculas para comparar textos
  const normalizar = (texto) =>
    texto.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  const guardarDato = (clave, valor) => {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (error) { /* almacenamiento no disponible */ }
  };
  const leerDato = (clave, porDefecto) => {
    try {
      const valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : porDefecto;
    } catch (error) {
      return porDefecto;
    }
  };

  const aviso = $("#aviso");
  let temporizadorAviso;
  const mostrarAviso = (mensaje) => {
    aviso.textContent = mensaje;
    aviso.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 2800);
  };

  const buscarLibro = (id) => LIBROS.find((libro) => libro.id === id);

  const textoEstado = (libro) => {
    if (libro.estado === "disponible") return "Disponible";
    if (libro.estado === "digital") return "Lectura digital";
    return `Prestado hasta el ${libro.devolucion}`;
  };

  /* ---------- 2. Modo nocturno ---------- */
  const botonTema = $("#boton-tema");

  const aplicarTema = (tema) => {
    raiz.dataset.tema = tema;
    const oscuro = tema === "oscuro";
    botonTema.setAttribute("aria-pressed", String(oscuro));
    botonTema.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo nocturno");
    $('meta[name="theme-color"]').setAttribute("content", oscuro ? "#11161d" : "#1d2b3a");
  };

  aplicarTema(leerDato("letraviva-tema", "claro"));

  botonTema.addEventListener("click", () => {
    const nuevo = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
    aplicarTema(nuevo);
    guardarDato("letraviva-tema", nuevo);
  });

  /* ---------- 3. Menú de navegación adaptable ---------- */
  const menuBoton = $("#menu-boton");
  const navegacion = $("#navegacion");
  const escritorio = window.matchMedia("(min-width: 1024px)");

  const cerrarMenu = () => {
    navegacion.classList.remove("abierta");
    menuBoton.setAttribute("aria-expanded", "false");
    menuBoton.setAttribute("aria-label", "Abrir menú");
  };

  menuBoton.addEventListener("click", (evento) => {
    evento.stopPropagation();
    const abierta = navegacion.classList.toggle("abierta");
    menuBoton.setAttribute("aria-expanded", String(abierta));
    menuBoton.setAttribute("aria-label", abierta ? "Cerrar menú" : "Abrir menú");
  });

  navegacion.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) cerrarMenu();
  });

  document.addEventListener("click", (evento) => {
    if (navegacion.classList.contains("abierta") && !navegacion.contains(evento.target)) cerrarMenu();
  });

  escritorio.addEventListener("change", (evento) => {
    if (evento.matches) cerrarMenu();
  });

  /* ---------- 4. Encabezado, enlace activo y "volver arriba" ---------- */
  const encabezado = $("#encabezado");
  const botonArriba = $("#arriba");

  const alDesplazar = () => {
    encabezado.classList.toggle("encabezado--sombra", window.scrollY > 10);
    botonArriba.classList.toggle("visible", window.scrollY > 700);
  };
  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  botonArriba.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const enlaces = $$(".navegacion__enlace");
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        enlaces.forEach((enlace) =>
          enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${entrada.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  $$("main section[id]").forEach((seccion) => observador.observe(seccion));

  /* ---------- 5. Catálogo ---------- */
  const contenedorLibros = $("#libros");
  const resultado = $("#resultado");
  const vacio = $("#vacio");
  const buscadorCatalogo = $("#buscador-catalogo");
  const selectorOrden = $("#orden");
  const soloDisponibles = $("#solo-disponibles");
  const chips = $$(".chip");

  const filtros = { texto: "", categoria: "todas", disponibles: false, orden: "titulo" };
  let guardados = new Set(leerDato("letraviva-lista", []));

  const crearTarjeta = (libro) => {
    const guardado = guardados.has(libro.id);
    return `
      <article class="libro" data-id="${libro.id}">
        <div class="libro__portada" style="--color-libro: ${libro.color}" aria-hidden="true">
          <img class="libro__patron" src="img/patrones/${libro.patron}.svg" alt="">
          <span class="libro__portada-categoria">${CATEGORIAS[libro.categoria]}</span>
          <span class="libro__portada-titulo">${libro.titulo}</span>
          <span class="libro__portada-autor">${libro.autor}</span>
        </div>
        <div class="libro__cuerpo">
          <span class="estado estado--${libro.estado}">${textoEstado(libro)}</span>
          <h3 class="libro__titulo">${libro.titulo}</h3>
          <p class="libro__autor">${libro.autor} · ${libro.anio}</p>
          <div class="libro__acciones">
            <button type="button" class="boton boton--pequeno ver-detalle" data-id="${libro.id}">Ver detalles</button>
            <button type="button" class="guardar${guardado ? " guardado" : ""}" data-id="${libro.id}" aria-pressed="${guardado}" aria-label="${guardado ? "Quitar de" : "Guardar en"} mi lista: ${libro.titulo}">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
              <span>${guardado ? "Guardado" : "Guardar"}</span>
            </button>
          </div>
        </div>
      </article>`;
  };

  const ordenar = (lista) => {
    const copia = [...lista];
    const comparar = {
      titulo: (a, b) => a.titulo.localeCompare(b.titulo, "es"),
      autor: (a, b) => a.autor.localeCompare(b.autor, "es"),
      reciente: (a, b) => b.anio - a.anio,
      antiguo: (a, b) => a.anio - b.anio
    };
    return copia.sort(comparar[filtros.orden]);
  };

  const mostrarCatalogo = () => {
    const texto = normalizar(filtros.texto);
    const filtrados = LIBROS.filter((libro) => {
      const coincideTexto =
        !texto ||
        normalizar(`${libro.titulo} ${libro.autor} ${CATEGORIAS[libro.categoria]} ${libro.anio}`).includes(texto);
      const coincideCategoria = filtros.categoria === "todas" || libro.categoria === filtros.categoria;
      const coincideEstado = !filtros.disponibles || libro.estado !== "prestado";
      return coincideTexto && coincideCategoria && coincideEstado;
    });

    const lista = ordenar(filtrados);
    contenedorLibros.innerHTML = lista.map(crearTarjeta).join("");
    vacio.hidden = lista.length > 0;
    resultado.textContent =
      lista.length === 1 ? "Mostrando 1 libro" : `Mostrando ${lista.length} libros`;
  };

  buscadorCatalogo.addEventListener("input", () => {
    filtros.texto = buscadorCatalogo.value;
    mostrarCatalogo();
  });

  selectorOrden.addEventListener("change", () => {
    filtros.orden = selectorOrden.value;
    mostrarCatalogo();
  });

  soloDisponibles.addEventListener("change", () => {
    filtros.disponibles = soloDisponibles.checked;
    mostrarCatalogo();
  });

  const activarCategoria = (categoria) => {
    filtros.categoria = categoria;
    chips.forEach((chip) => {
      const activo = chip.dataset.categoria === categoria;
      chip.classList.toggle("activo", activo);
      chip.setAttribute("aria-pressed", String(activo));
    });
    mostrarCatalogo();
  };

  chips.forEach((chip) => chip.addEventListener("click", () => activarCategoria(chip.dataset.categoria)));

  $("#limpiar-filtros").addEventListener("click", () => {
    buscadorCatalogo.value = "";
    filtros.texto = "";
    soloDisponibles.checked = false;
    filtros.disponibles = false;
    activarCategoria("todas");
    buscadorCatalogo.focus();
  });

  // Búsqueda desde la portada y sugerencias populares
  const buscarDesdePortada = (texto) => {
    buscadorCatalogo.value = texto;
    filtros.texto = texto;
    activarCategoria("todas");
    $("#catalogo").scrollIntoView({ behavior: "smooth" });
  };

  $("#buscador-portada").addEventListener("submit", (evento) => {
    evento.preventDefault();
    buscarDesdePortada($("#busqueda-portada").value);
  });

  $$(".sugerencia").forEach((boton) =>
    boton.addEventListener("click", () => {
      $("#busqueda-portada").value = boton.dataset.busqueda;
      buscarDesdePortada(boton.dataset.busqueda);
    })
  );

  // Delegación de eventos para los botones de las tarjetas
  contenedorLibros.addEventListener("click", (evento) => {
    const botonDetalle = evento.target.closest(".ver-detalle");
    const botonGuardar = evento.target.closest(".guardar");
    if (botonDetalle) abrirDetalle(botonDetalle.dataset.id);
    if (botonGuardar) alternarGuardado(botonGuardar.dataset.id);
  });

  /* ---------- 6. Ventana de detalle ---------- */
  const modal = $("#modal-libro");
  const modalCuerpo = $("#modal-cuerpo");

  const abrirDetalle = (id) => {
    const libro = buscarLibro(id);
    const guardado = guardados.has(id);
    const esperaTexto = libro.estado === "prestado" ? "Unirme a la lista de espera" : "Reservar este libro";

    modalCuerpo.innerHTML = `
      <div class="libro__portada libro__portada--modal" style="--color-libro: ${libro.color}" aria-hidden="true">
        <img class="libro__patron" src="img/patrones/${libro.patron}.svg" alt="">
        <span class="libro__portada-categoria">${CATEGORIAS[libro.categoria]}</span>
        <span class="libro__portada-titulo">${libro.titulo}</span>
        <span class="libro__portada-autor">${libro.autor}</span>
      </div>
      <div class="modal__info">
        <span class="estado estado--${libro.estado}">${textoEstado(libro)}</span>
        <h2 id="modal-titulo">${libro.titulo}</h2>
        <p class="modal__autor">${libro.autor}</p>
        <dl class="ficha">
          <div><dt>Año</dt><dd>${libro.anio}</dd></div>
          <div><dt>Páginas</dt><dd>${libro.paginas}</dd></div>
          <div><dt>Formato</dt><dd>${libro.formato}</dd></div>
          <div><dt>Categoría</dt><dd>${CATEGORIAS[libro.categoria]}</dd></div>
        </dl>
        <p class="modal__sinopsis">${libro.sinopsis}</p>
        <div class="modal__acciones">
          <button type="button" class="boton boton--primario" data-reservar="${libro.id}">${esperaTexto}</button>
          <button type="button" class="boton boton--secundario" data-guardar="${libro.id}">${guardado ? "Quitar de mi lista" : "Guardar en mi lista"}</button>
        </div>
      </div>`;
    modal.showModal();
  };

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal || evento.target.closest("[data-cerrar]")) modal.close();

    const reservar = evento.target.closest("[data-reservar]");
    if (reservar) {
      modal.close();
      prepararReserva(reservar.dataset.reservar);
    }

    const guardar = evento.target.closest("[data-guardar]");
    if (guardar) {
      alternarGuardado(guardar.dataset.guardar);
      guardar.textContent = guardados.has(guardar.dataset.guardar) ? "Quitar de mi lista" : "Guardar en mi lista";
    }
  });

  /* ---------- 7. Mi lista de lectura ---------- */
  const panel = $("#mi-lista");
  const velo = $("#velo");
  const botonLista = $("#boton-lista");
  const contador = $("#contador-lista");
  const listaGuardados = $("#lista-guardados");
  const listaVacia = $("#lista-vacia");

  const actualizarLista = () => {
    contador.textContent = guardados.size;
    contador.classList.toggle("contador--activo", guardados.size > 0);
    listaVacia.hidden = guardados.size > 0;
    listaGuardados.innerHTML = [...guardados]
      .map(buscarLibro)
      .filter(Boolean)
      .map(
        (libro) => `
        <li class="guardado-item">
          <span class="guardado-item__portada" style="--color-libro: ${libro.color}" aria-hidden="true"></span>
          <div class="guardado-item__texto">
            <strong>${libro.titulo}</strong>
            <small>${libro.autor} · ${textoEstado(libro)}</small>
            <button type="button" class="enlace-boton" data-reservar="${libro.id}">Reservar</button>
          </div>
          <button type="button" class="icono-boton icono-boton--pequeno" data-quitar="${libro.id}" aria-label="Quitar ${libro.titulo} de mi lista">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </li>`
      )
      .join("");
    guardarDato("letraviva-lista", [...guardados]);
  };

  const alternarGuardado = (id) => {
    const libro = buscarLibro(id);
    if (guardados.has(id)) {
      guardados.delete(id);
      mostrarAviso(`«${libro.titulo}» se quitó de tu lista`);
    } else {
      guardados.add(id);
      mostrarAviso(`«${libro.titulo}» se guardó en tu lista`);
      contador.classList.remove("rebote");
      void contador.offsetWidth;
      contador.classList.add("rebote");
    }
    actualizarLista();
    mostrarCatalogo();
  };

  const abrirPanel = () => {
    panel.hidden = false;
    velo.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("abierto");
      velo.classList.add("visible");
    });
    botonLista.setAttribute("aria-expanded", "true");
    cuerpo.classList.add("sin-desplazamiento");
    $("#cerrar-lista").focus();
  };

  const cerrarPanel = () => {
    panel.classList.remove("abierto");
    velo.classList.remove("visible");
    botonLista.setAttribute("aria-expanded", "false");
    cuerpo.classList.remove("sin-desplazamiento");
    setTimeout(() => {
      panel.hidden = true;
      velo.hidden = true;
    }, 300);
  };

  botonLista.addEventListener("click", (evento) => {
    evento.stopPropagation();
    cerrarMenu();
    panel.classList.contains("abierto") ? cerrarPanel() : abrirPanel();
  });
  $("#cerrar-lista").addEventListener("click", cerrarPanel);
  velo.addEventListener("click", cerrarPanel);

  listaGuardados.addEventListener("click", (evento) => {
    const quitar = evento.target.closest("[data-quitar]");
    const reservar = evento.target.closest("[data-reservar]");
    if (quitar) alternarGuardado(quitar.dataset.quitar);
    if (reservar) {
      cerrarPanel();
      prepararReserva(reservar.dataset.reservar);
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape") return;
    if (panel.classList.contains("abierto")) cerrarPanel();
    if (navegacion.classList.contains("abierta")) {
      cerrarMenu();
      menuBoton.focus();
    }
  });

  /* ---------- 8. Galería de espacios ---------- */
  const visor = $("#visor");
  const visorImagen = $("#visor-imagen");
  const visorTexto = $("#visor-texto");
  const fotos = $$(".galeria__boton").map((boton) => {
    const imagen = $("img", boton);
    return { src: imagen.getAttribute("src"), alt: imagen.alt, texto: $(".galeria__texto", boton).textContent };
  });
  let fotoActual = 0;

  const mostrarFoto = (indice) => {
    fotoActual = (indice + fotos.length) % fotos.length;
    const foto = fotos[fotoActual];
    visorImagen.src = foto.src;
    visorImagen.alt = foto.alt;
    visorTexto.textContent = `${foto.texto} · ${fotoActual + 1} de ${fotos.length}`;
  };

  $$(".galeria__boton").forEach((boton) =>
    boton.addEventListener("click", () => {
      mostrarFoto(Number(boton.dataset.indice));
      visor.showModal();
    })
  );

  $("#visor-anterior").addEventListener("click", () => mostrarFoto(fotoActual - 1));
  $("#visor-siguiente").addEventListener("click", () => mostrarFoto(fotoActual + 1));
  visor.addEventListener("click", (evento) => {
    if (evento.target === visor || evento.target.closest("[data-cerrar]")) visor.close();
  });
  visor.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrarFoto(fotoActual - 1);
    if (evento.key === "ArrowRight") mostrarFoto(fotoActual + 1);
  });

  /* ---------- 9. Inscripción a eventos ---------- */
  $$(".inscribir").forEach((boton) => {
    boton.addEventListener("click", () => {
      const cupos = $("[data-cupos]", boton.closest(".evento"));
      const inscrito = boton.classList.toggle("inscrito");
      const disponibles = Number(cupos.textContent) + (inscrito ? -1 : 1);
      cupos.textContent = disponibles;
      boton.textContent = inscrito ? "Inscrito ✓" : "Inscribirme";
      boton.setAttribute("aria-pressed", String(inscrito));
      mostrarAviso(inscrito ? `Quedaste inscrito en: ${boton.dataset.evento}` : "Cancelaste tu inscripción");
    });
  });

  /* ---------- 10. Formulario de reservas ---------- */
  const formulario = $("#formulario-reserva");
  const selectLibro = $("#libro");
  const campoFecha = $("#campo-fecha");
  const inputFecha = $("#fecha");
  const confirmacion = $("#confirmacion");

  // Opciones del selector generadas a partir del catálogo
  [...LIBROS]
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "es"))
    .forEach((libro) => {
      const opcion = document.createElement("option");
      opcion.value = libro.id;
      const nota = libro.estado === "prestado" ? " (lista de espera)" : libro.estado === "digital" ? " (solo digital)" : "";
      opcion.textContent = `${libro.titulo} – ${libro.autor}${nota}`;
      selectLibro.append(opcion);
    });

  const aFechaISO = (fecha) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 30);
  inputFecha.min = aFechaISO(hoy);
  inputFecha.max = aFechaISO(limite);

  const mensajes = {
    nombre: "Escribe tu nombre completo (mínimo 3 caracteres).",
    carne: "El carné debe tener entre 6 y 10 números.",
    correo: "Ingresa un correo electrónico válido.",
    libro: "Selecciona el libro que deseas reservar.",
    fecha: "Elige una fecha entre hoy y los próximos 30 días.",
    acepto: "Debes aceptar el reglamento para continuar."
  };

  const modalidad = () => $('input[name="modalidad"]:checked', formulario).value;

  // Regla de negocio: el formato del libro debe coincidir con la modalidad elegida
  const revisarCompatibilidad = () => {
    const libro = buscarLibro(selectLibro.value);
    let mensaje = "";
    if (libro && libro.formato === "Digital" && modalidad() === "sede") {
      mensaje = "Este libro solo está disponible en préstamo digital.";
    } else if (libro && libro.formato === "Físico" && modalidad() === "digital") {
      mensaje = "Este libro solo está disponible en formato físico.";
    }
    selectLibro.setCustomValidity(mensaje);
    return mensaje;
  };

  const validarCampo = (control) => {
    const campo = control.closest(".campo");
    const error = campo ? $(".campo__error", campo) : null;
    if (!error) return true;
    if (control === selectLibro) revisarCompatibilidad();
    const valido = control.checkValidity();
    campo.classList.toggle("campo--error", !valido);
    control.setAttribute("aria-invalid", String(!valido));
    error.textContent = valido ? "" : control.validationMessage && control.validity.customError
      ? control.validationMessage
      : mensajes[control.name];
    return valido;
  };

  const actualizarModalidad = () => {
    const digital = modalidad() === "digital";
    campoFecha.hidden = digital;
    inputFecha.required = !digital;
    if (selectLibro.value) validarCampo(selectLibro);
  };

  $$('input[name="modalidad"]', formulario).forEach((radio) => radio.addEventListener("change", actualizarModalidad));

  $$("input, select", formulario).forEach((control) => {
    if (control.type === "radio") return;
    control.addEventListener("blur", () => validarCampo(control));
    control.addEventListener("change", () => validarCampo(control));
    control.addEventListener("input", () => {
      if (control.closest(".campo").classList.contains("campo--error")) validarCampo(control);
    });
  });

  const prepararReserva = (id) => {
    const libro = buscarLibro(id);
    selectLibro.value = id;
    const radio = $(`input[name="modalidad"][value="${libro.formato === "Digital" ? "digital" : "sede"}"]`, formulario);
    radio.checked = true;
    actualizarModalidad();
    validarCampo(selectLibro);
    $("#reservas").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#nombre").focus({ preventScroll: true }), 600);
    mostrarAviso(`Seleccionaste «${libro.titulo}» para reservar`);
  };

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const controles = $$("input[required], select[required]", formulario).filter((c) => !c.closest("[hidden]"));
    const invalidos = controles.filter((control) => !validarCampo(control));

    if (invalidos.length) {
      invalidos[0].focus();
      confirmacion.hidden = true;
      return;
    }

    const datos = new FormData(formulario);
    const libro = buscarLibro(datos.get("libro"));
    const nombre = datos.get("nombre").trim().split(" ")[0];
    const codigo = `LV-${Math.floor(10000 + Math.random() * 90000)}`;
    let detalle;

    if (libro.estado === "prestado") {
      detalle = `Quedaste en la lista de espera de «${libro.titulo}». Te avisaremos cuando sea devuelto (${libro.devolucion}).`;
    } else if (datos.get("modalidad") === "digital") {
      detalle = `Enviamos el enlace de lectura de «${libro.titulo}» a ${datos.get("correo")}.`;
    } else {
      const [anio, mes, dia] = datos.get("fecha").split("-");
      detalle = `Puedes recoger «${libro.titulo}» en la sede el ${dia}/${mes}/${anio}.`;
    }

    confirmacion.innerHTML = `<strong>¡Reserva confirmada, ${nombre}!</strong><span>Código: ${codigo}</span><p>${detalle}</p>`;
    confirmacion.hidden = false;
    formulario.reset();
    actualizarModalidad();
    $$(".campo--error", formulario).forEach((campo) => campo.classList.remove("campo--error"));
    mostrarAviso("Reserva enviada correctamente");
  });

  /* ---------- Inicio ---------- */
  mostrarCatalogo();
  actualizarLista();
  $("#anio").textContent = new Date().getFullYear();
});
