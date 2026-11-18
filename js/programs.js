
// ========================================
// КАТАЛОГ ОБРАЗОВАТЕЛЬНЫХ ПРОГРАММ
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // Получаем элементы страницы
  const grid = $("#programGrid");
  const search = $("#programSearch");
  const faculty = $("#facultyFilter");
  const degree = $("#degreeFilter");
  const sort = $("#sortPrograms");
  const form = $("#programForm");

  // Если на странице нет каталога, прекращаем выполнение
  if (!grid || !search || !faculty || !degree || !sort || !form) {
    return;
  }

  // Добавляем факультеты в фильтр автоматически
  [...new Set(getPrograms().map(p => p.faculty))]
    .forEach(f => {
      faculty.insertAdjacentHTML(
        "beforeend",
        `<option>${escapeHTML(f)}</option>`
      );
    });

  // Получаем факультет из адресной строки, если он указан
  const params = new URLSearchParams(location.search);

  if (params.get("faculty")) {
    faculty.value = params.get("faculty");
  }

  // ========================================
  // ОТОБРАЖЕНИЕ ПРОГРАММ
  // ========================================

  function render() {

    let items = getPrograms();

    // Получаем текст поиска
    const q = search.value.trim().toLowerCase();

    // Поиск и фильтрация
    items = items.filter(p =>
      (p.name + " " + p.description)
        .toLowerCase()
        .includes(q) &&
      (!faculty.value || p.faculty === faculty.value) &&
      (!degree.value || p.degree === degree.value)
    );

    // Сортировка
    if (sort.value === "az") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort.value === "za") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sort.value === "duration") {
      items.sort((a, b) => a.duration - b.duration);
    }

    // Показываем количество найденных программ
    $("#programCount").textContent =
      `Найдено программ: ${items.length}`;

    // Создаём карточки программ
    grid.innerHTML = items.length
      ? items.map(p => `
        <div class="col-md-6 col-xl-4">
          <article class="item-card">

            <div class="d-flex justify-content-between">
              <div class="item-icon">
                ${escapeHTML(p.icon || "✦")}
              </div>

              <button
                class="btn btn-sm btn-soft favorite-btn"
                data-fav="${p.id}"
                title="В избранное"
              >
                ${getFavorites().includes(p.id) ? "★" : "☆"}
              </button>
            </div>

            <span class="tag">${escapeHTML(p.degree)}</span>

            <h5 class="mt-3">${escapeHTML(p.name)}</h5>

            <p class="muted small">
              ${escapeHTML(p.description)}
            </p>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="muted small">
                ${escapeHTML(p.faculty)}
              </span>

              <span class="tag">${p.duration} лет</span>
            </div>

            <div class="d-flex gap-2 mt-3">
              <button
                class="btn btn-outline-light btn-sm edit-btn"
                data-edit="${p.id}"
              >
                Изменить
              </button>

              <button
                class="btn btn-outline-light btn-sm delete-btn"
                data-delete="${p.id}"
              >
                Удалить
              </button>
            </div>

          </article>
        </div>
      `).join("")
      : `
        <div class="col-12">
          <div class="empty-state">
            По вашему запросу ничего не найдено.
          </div>
        </div>
      `;

    // ========================================
    // ДОБАВЛЕНИЕ В ИЗБРАННОЕ
    // ========================================

    $$(".favorite-btn", grid).forEach(button => {

      button.onclick = () => {

        let favorites = getFavorites();
        const id = Number(button.dataset.fav);

        if (favorites.includes(id)) {
          favorites = favorites.filter(x => x !== id);
        } else {
          favorites = [...favorites, id];
        }

        setFavorites(favorites);

        render();
      };

    });

    // ========================================
    // УДАЛЕНИЕ ПРОГРАММЫ
    // ========================================

    $$(".delete-btn", grid).forEach(button => {

      button.onclick = () => {

        if (confirm("Удалить эту программу?")) {

          savePrograms(
            getPrograms().filter(
              p => p.id !== Number(button.dataset.delete)
            )
          );

          render();

          toast("Программа удалена");
        }

      };

    });

    // ========================================
    // РЕДАКТИРОВАНИЕ ПРОГРАММЫ
    // ========================================

    $$(".edit-btn", grid).forEach(button => {

      button.onclick = () => {

        const p = getPrograms().find(
          x => x.id === Number(button.dataset.edit)
        );

        $("#editId").value = p.id;
        $("#pName").value = p.name;
        $("#pFaculty").value = p.faculty;
        $("#pDegree").value = p.degree;
        $("#pDuration").value = p.duration;
        $("#pDescription").value = p.description;

        $("#modalTitle").textContent =
          "Редактировать программу";

        bootstrap.Modal
          .getOrCreateInstance($("#programModal"))
          .show();

      };

    });

  }

  // ========================================
  // ОБРАБОТКА ПОИСКА И ФИЛЬТРОВ
  // ========================================

  [search, faculty, degree, sort].forEach(element => {
    element.addEventListener("input", render);
  });

  // ========================================
  // ДОБАВЛЕНИЕ И СОХРАНЕНИЕ ПРОГРАММ
  // ========================================

  form.addEventListener("submit", event => {

    event.preventDefault();

    let data = getPrograms();

    const id = $("#editId").value;

    const program = {
      id: id ? Number(id) : Date.now(),
      name: $("#pName").value.trim(),
      faculty: $("#pFaculty").value,
      degree: $("#pDegree").value,
      duration: Number($("#pDuration").value),
      description: $("#pDescription").value.trim(),
      icon: "✦"
    };

    // Если ID есть — редактируем программу
    if (id) {

      data = data.map(x =>
        x.id === Number(id) ? program : x
      );

    } else {

      // Если ID нет — добавляем новую программу
      data.push(program);

    }

    savePrograms(data);

    form.reset();

    $("#editId").value = "";

    bootstrap.Modal
      .getInstance($("#programModal"))
      .hide();

    render();

    toast("Данные программы сохранены");

  });

  // Очищаем форму после закрытия окна
  $("#programModal").addEventListener(
    "hidden.bs.modal",
    () => {

      form.reset();

      $("#editId").value = "";

      $("#modalTitle").textContent =
        "Новая программа";

    }
  );

  // Первоначальное отображение каталога
  render();

});
