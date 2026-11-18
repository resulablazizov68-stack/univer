document.addEventListener("DOMContentLoaded", () => {
  const host = $("#profileContent");

  if (!host) return;

  // Получаем данные пользователя
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("su_user") || "null");
  } catch (error) {
    user = null;
  }

  // Если пользователь не зарегистрирован
  if (!user) {
    host.innerHTML = `
      <div class="surface text-center py-5">
        <div class="item-icon mx-auto">◉</div>

        <h3>Выполните вход</h3>

        <p class="muted">
          Чтобы открыть личный кабинет, создайте демонстрационный профиль или войдите.
        </p>

        <a href="login.html" class="btn btn-primary me-2">
          Войти
        </a>

        <a href="register.html" class="btn btn-outline-light">
          Регистрация
        </a>
      </div>
    `;

    return;
  }

  // Получаем избранные программы
  const favorites = getFavorites();

  const programs = getPrograms().filter(program =>
    favorites.includes(program.id)
  );

  // Формируем инициалы пользователя
  const initials = (
    (user.name || "")[0] || ""
  ) + (
    (user.surname || "")[0] || ""
  );

  // Отображаем личный кабинет
  host.innerHTML = `
    <div class="row g-3">

      <div class="col-lg-4">
        <div class="surface h-100">

          <div class="profile-avatar mb-3">
            ${escapeHTML(initials)}
          </div>

          <h3>
            ${escapeHTML(user.name || "")}
            ${escapeHTML(user.surname || "")}
          </h3>

          <p class="muted">
            ${escapeHTML(user.email || "")}
          </p>

          <div class="feature-line">
            <span>▣</span>
            <span>
              Студенческий номер:
              <b>${escapeHTML(user.number || "Не указан")}</b>
            </span>
          </div>

          <div class="feature-line">
            <span>⌂</span>
            <span>
              Обучение:
              <b>${escapeHTML(user.course || "Не указано")}</b>
            </span>
          </div>

          <button
            id="logoutBtn"
            class="btn btn-outline-light w-100 mt-3"
          >
            Выйти из профиля
          </button>

        </div>
      </div>

      <div class="col-lg-8">

        <div class="surface">

          <div class="d-flex justify-content-between align-items-center">

            <div>
              <div class="eyebrow">Saved items</div>
              <h3 class="mb-0">Избранные программы</h3>
            </div>

            <span class="tag">
              ${programs.length} сохранено
            </span>

          </div>

          <div class="row g-3 mt-2" id="favoriteList">

            ${
              programs.length
                ? programs.map(program => `
                    <div class="col-md-6">
                      <div class="item-card">

                        <span class="tag">
                          ${escapeHTML(program.degree)}
                        </span>

                        <h5 class="mt-3">
                          ${escapeHTML(program.name)}
                        </h5>

                        <p class="muted small">
                          ${escapeHTML(program.faculty)}
                        </p>

                        <button
                          class="btn btn-soft btn-sm remove-fav"
                          data-id="${program.id}"
                        >
                          Убрать из избранного
                        </button>

                      </div>
                    </div>
                  `).join("")
                : `
                    <div class="col-12">
                      <div class="empty-state">
                        Пока нет избранных программ.
                        Добавь их в каталоге.
                      </div>
                    </div>
                  `
            }

          </div>
        </div>

        <div class="surface mt-3">

          <div class="eyebrow">Quick access</div>

          <div class="d-flex flex-wrap gap-2 mt-2">

            <a href="schedule.html" class="btn btn-outline-light">
              Расписание
            </a>

            <a href="news.html" class="btn btn-outline-light">
              Новости
            </a>

            <a href="programs.html" class="btn btn-outline-light">
              Каталог программ
            </a>

          </div>
        </div>

      </div>
    </div>
  `;

  // Выход из профиля
  $("#logoutBtn").onclick = () => {
    localStorage.removeItem("su_user");
    location.reload();
  };

  // Удаление программы из избранного
  $$(".remove-fav").forEach(button => {
    button.onclick = () => {
      const id = Number(button.dataset.id);

      const updatedFavorites = getFavorites().filter(
        favoriteId => favoriteId !== id
      );

      setFavorites(updatedFavorites);

      location.reload();
    };
  });

});