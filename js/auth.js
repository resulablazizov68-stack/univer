
// ========================================
// РЕГИСТРАЦИЯ И АВТОРИЗАЦИЯ
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // РЕГИСТРАЦИЯ
  // ========================================

  const reg = $("#registerForm");

  if (reg) {

    reg.addEventListener("submit", event => {

      event.preventDefault();

      // Получаем данные из формы
      const user = {
        name: $("#regName").value.trim(),
        surname: $("#regSurname").value.trim(),
        email: $("#regEmail").value.trim(),
        number: $("#regNumber").value.trim(),
        course: $("#regCourse").value
      };

      // Сохраняем профиль в браузере
      localStorage.setItem(
        "su_user",
        JSON.stringify(user)
      );

      toast("Профиль создан");

      // Переходим в личный кабинет
      setTimeout(() => {
        location.href = "profile.html";
      }, 700);

    });

  }

  // ========================================
  // ВХОД В АККАУНТ
  // ========================================

  const login = $("#loginForm");

  if (login) {

    login.addEventListener("submit", event => {

      event.preventDefault();

      // Получаем сохранённого пользователя
      const user = JSON.parse(
        localStorage.getItem("su_user") || "null"
      );

      // Получаем введённую электронную почту
      const email = $("#loginEmail").value.trim();

      // Проверяем наличие профиля
      if (
        !user ||
        user.email.toLowerCase() !== email.toLowerCase()
      ) {

        toast(
          "Профиль не найден. Сначала зарегистрируйтесь."
        );

        return;

      }

      toast("Добро пожаловать!");

      // Переходим в личный кабинет
      setTimeout(() => {
        location.href = "profile.html";
      }, 650);

    });

  }

});
