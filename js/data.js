
// ========================================
// ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ========================================

// Находим один HTML-элемент по CSS-селектору
const $ = (selector, root = document) =>
  root.querySelector(selector);

// Находим все HTML-элементы по CSS-селектору
const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


// ========================================
// ДАННЫЕ ОБРАЗОВАТЕЛЬНЫХ ПРОГРАММ
// ========================================

const programsSeed = [
  {
    id: 1,
    name: "Computer Science",
    faculty: "Информационные технологии",
    degree: "Бакалавриат",
    duration: 4,
    description: "Алгоритмы, разработка программного обеспечения, искусственный интеллект и анализ данных.",
    icon: "⌘"
  },
  {
    id: 2,
    name: "Software Engineering",
    faculty: "Информационные технологии",
    degree: "Бакалавриат",
    duration: 4,
    description: "Проектирование, тестирование и сопровождение современных программных систем.",
    icon: "{ }"
  },
  {
    id: 3,
    name: "Cybersecurity",
    faculty: "Информационные технологии",
    degree: "Бакалавриат",
    duration: 4,
    description: "Защита цифровой инфраструктуры, сетей и пользовательских данных.",
    icon: "◈"
  },
  {
    id: 4,
    name: "Data Science",
    faculty: "Информационные технологии",
    degree: "Магистратура",
    duration: 2,
    description: "Машинное обучение, статистика и интеллектуальный анализ больших данных.",
    icon: "▥"
  },
  {
    id: 5,
    name: "Business Administration",
    faculty: "Бизнес и экономика",
    degree: "Бакалавриат",
    duration: 4,
    description: "Управление организациями, предпринимательство и стратегическое планирование.",
    icon: "↗"
  },
  {
    id: 6,
    name: "Finance",
    faculty: "Бизнес и экономика",
    degree: "Бакалавриат",
    duration: 4,
    description: "Финансовый анализ, инвестиции и управление рисками.",
    icon: "＄"
  },
  {
    id: 7,
    name: "International Relations",
    faculty: "Гуманитарные науки",
    degree: "Бакалавриат",
    duration: 4,
    description: "Международная политика, дипломатия и межкультурная коммуникация.",
    icon: "◎"
  },
  {
    id: 8,
    name: "Digital Marketing",
    faculty: "Бизнес и экономика",
    degree: "Бакалавриат",
    duration: 4,
    description: "Цифровые коммуникации, аналитика аудитории и развитие брендов.",
    icon: "✳"
  },
  {
    id: 9,
    name: "Mechanical Engineering",
    faculty: "Инженерия",
    degree: "Бакалавриат",
    duration: 4,
    description: "Механика, проектирование устройств и современные производственные системы.",
    icon: "⚙"
  },
  {
    id: 10,
    name: "Architecture",
    faculty: "Инженерия",
    degree: "Бакалавриат",
    duration: 5,
    description: "Архитектурное проектирование, урбанистика и устойчивые пространства.",
    icon: "⌂"
  },
  {
    id: 11,
    name: "Applied Mathematics",
    faculty: "Естественные науки",
    degree: "Бакалавриат",
    duration: 4,
    description: "Математическое моделирование, вычисления и прикладная статистика.",
    icon: "∑"
  },
  {
    id: 12,
    name: "Biotechnology",
    faculty: "Естественные науки",
    degree: "Магистратура",
    duration: 2,
    description: "Биотехнологические процессы, лабораторные исследования и биоинформатика.",
    icon: "⌬"
  }
];


// ========================================
// РАБОТА С ОБРАЗОВАТЕЛЬНЫМИ ПРОГРАММАМИ
// ========================================

// Получаем программы из LocalStorage
// Если данных нет, используем начальный массив
function getPrograms() {
  return JSON.parse(
    localStorage.getItem("su_programs") || "null"
  ) || programsSeed;
}

// Сохраняем программы
function savePrograms(data) {
  localStorage.setItem(
    "su_programs",
    JSON.stringify(data)
  );
}


// ========================================
// ИЗБРАННЫЕ ПРОГРАММЫ
// ========================================

// Получаем список избранного
function getFavorites() {
  return JSON.parse(
    localStorage.getItem("su_favorites") || "[]"
  );
}

// Сохраняем список избранного
function setFavorites(data) {
  localStorage.setItem(
    "su_favorites",
    JSON.stringify(data)
  );
}


// ========================================
// УВЕДОМЛЕНИЯ
// ========================================

function toast(message) {
  let area = $("#toastArea");

  // Если контейнера ещё нет, создаём его
  if (!area) {
    area = document.createElement("div");
    area.id = "toastArea";
    area.className = "toast-area";

    document.body.append(area);
  }

  // Показываем сообщение
  area.innerHTML = `
    <div class="alert alert-info shadow mb-0">
      ${escapeHTML(message)}
    </div>
  `;

  // Убираем сообщение через 2,6 секунды
  setTimeout(() => {
    area.innerHTML = "";
  }, 2600);
}


// ========================================
// ЗАЩИТА HTML-ТЕКСТА
// ========================================

// Преобразуем специальные символы,
// чтобы пользовательский текст не воспринимался как HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}


// ========================================
// ОБЩИЕ НАСТРОЙКИ САЙТА
// ========================================

function initCommon() {

  // Получаем сохранённую тему
  const savedTheme =
    localStorage.getItem("su_theme") || "dark";

  // Применяем тему
  document.body.classList.toggle(
    "light-theme",
    savedTheme === "light"
  );

  // Находим кнопку переключения темы
  const toggle = $("#themeToggle");

  if (toggle) {
    toggle.textContent =
      savedTheme === "dark" ? "☼ Тема" : "☾ Тема";

    toggle.addEventListener("click", () => {

      // Проверяем текущую тему
      const isLight =
        document.body.classList.toggle("light-theme");

      // Определяем новую тему
      const next = isLight ? "light" : "dark";

      // Сохраняем выбор пользователя
      localStorage.setItem("su_theme", next);

      // Меняем текст кнопки
      toggle.textContent =
        next === "dark" ? "☼ Тема" : "☾ Тема";
    });
  }

  // Подсвечиваем активную страницу в меню
  const current =
    location.pathname.split("/").pop() || "index.html";

  $$(".nav-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}


// ========================================
// ЗАПУСК ОБЩИХ ФУНКЦИЙ
// ========================================

// Ждём загрузки HTML-страницы
document.addEventListener(
  "DOMContentLoaded",
  initCommon
);

