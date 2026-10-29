// Демонстраційні дані інформаційної системи університету.
const students = [
  { id: 1, fullName: "Іваненко Марія", group: "КН-21", specialty: "Комп'ютерні науки", year: 2, averageGrade: 91, email: "m.ivanenko@example.com" },
  { id: 2, fullName: "Петренко Максим", group: "КБ-31", specialty: "Кібербезпека", year: 3, averageGrade: 87, email: "m.petrenko@example.com" },
  { id: 3, fullName: "Коваль Софія", group: "ІПЗ-11", specialty: "Інженерія програмного забезпечення", year: 1, averageGrade: 95, email: "s.koval@example.com" },
  { id: 4, fullName: "Мельник Андрій", group: "КН-21", specialty: "Комп'ютерні науки", year: 2, averageGrade: 78, email: "a.melnyk@example.com" },
  { id: 5, fullName: "Шевченко Дарина", group: "КБ-31", specialty: "Кібербезпека", year: 3, averageGrade: 89, email: "d.shevchenko@example.com" }
];

const teachers = [
  { id: 1, fullName: "Олена Бондар", department: "Комп'ютерних наук", position: "Доцент", degree: "Кандидат технічних наук", subject: "Вебпрограмування", email: "o.bondar@example.com" },
  { id: 2, fullName: "Сергій Ткачук", department: "Кібербезпеки", position: "Професор", degree: "Доктор технічних наук", subject: "Захист інформації", email: "s.tkachuk@example.com" },
  { id: 3, fullName: "Ірина Савчук", department: "Математики", position: "Старший викладач", degree: "Кандидат фізико-математичних наук", subject: "Дискретна математика", email: "i.savchuk@example.com" },
  { id: 4, fullName: "Андрій Романюк", department: "Комп'ютерних наук", position: "Доцент", degree: "Кандидат технічних наук", subject: "Бази даних", email: "a.romaniuk@example.com" },
  { id: 5, fullName: "Наталія Лисенко", department: "Кібербезпеки", position: "Асистент", degree: "Без наукового ступеня", subject: "Комп'ютерні мережі", email: "n.lysenko@example.com" }
];

const courses = [
  { id: 1, name: "Вебпрограмування", credits: 5, semester: 3, assessment: "Екзамен", teacher: "Олена Бондар", hours: 150 },
  { id: 2, name: "Захист інформації", credits: 4, semester: 5, assessment: "Екзамен", teacher: "Сергій Ткачук", hours: 120 },
  { id: 3, name: "Дискретна математика", credits: 4, semester: 1, assessment: "Залік", teacher: "Ірина Савчук", hours: 120 },
  { id: 4, name: "Бази даних", credits: 5, semester: 4, assessment: "Екзамен", teacher: "Андрій Романюк", hours: 150 },
  { id: 5, name: "Комп'ютерні мережі", credits: 4, semester: 5, assessment: "Залік", teacher: "Наталія Лисенко", hours: 120 }
];

const entities = {
  students: {
    data: students,
    columns: [
      { key: "id", label: "ID", editable: false }, { key: "fullName", label: "ПІБ" },
      { key: "group", label: "Група" }, { key: "specialty", label: "Спеціальність" },
      { key: "year", label: "Курс", type: "number" }, { key: "averageGrade", label: "Середній бал", type: "number" },
      { key: "email", label: "Електронна пошта" }
    ]
  },
  teachers: {
    data: teachers,
    columns: [
      { key: "id", label: "ID", editable: false }, { key: "fullName", label: "ПІБ" },
      { key: "department", label: "Кафедра" }, { key: "position", label: "Посада" },
      { key: "degree", label: "Науковий ступінь" }, { key: "subject", label: "Дисципліна", type: "select", optionsFrom: "courses", optionKey: "name" },
      { key: "email", label: "Електронна пошта" }
    ]
  },
  courses: {
    data: courses,
    columns: [
      { key: "id", label: "ID", editable: false }, { key: "name", label: "Назва дисципліни" },
      { key: "credits", label: "Кредити ЄКТС", type: "number" }, { key: "semester", label: "Семестр", type: "number" },
      { key: "assessment", label: "Форма контролю" }, { key: "teacher", label: "Викладач", type: "select", optionsFrom: "teachers", optionKey: "fullName" },
      { key: "hours", label: "Кількість годин", type: "number" }
    ]
  }
};

// Зберігання стану між відкриттями сторінки та синхронізація вкладок.
const STORAGE_KEY = "universityTablesLab4_v1";

function applySavedData(saved) {
  if (!saved || typeof saved !== "object") return;
  Object.keys(entities).forEach(entityName => {
    if (Array.isArray(saved[entityName])) {
      const target = entities[entityName].data;
      target.splice(0, target.length, ...saved[entityName]);
    }
  });
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      students: entities.students.data,
      teachers: entities.teachers.data,
      courses: entities.courses.data
    }));
  } catch (error) {
    showError("Не вдалося зберегти дані у браузері. Перевірте налаштування localStorage.");
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) applySavedData(JSON.parse(saved));
    else saveData();
  } catch (error) {
    showError("Збережені дані не вдалося прочитати. Будуть використані початкові дані.");
  }
}

// Подія storage спрацьовує в інших вкладках того самого сайту/джерела.
window.addEventListener("storage", event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  if (event.newValue) {
    try {
      applySavedData(JSON.parse(event.newValue));
      renderAll();
    } catch (error) {
      console.error("Не вдалося синхронізувати дані між вкладками:", error);
    }
  }
});

function showError(message) {
  window.alert(message);
}

function validateValue(entityName, key, value) {
  const column = entities[entityName].columns.find(item => item.key === key);
  if (column && column.type === "select") {
    const source = entities[column.optionsFrom].data;
    const option = source.find(record => String(record[column.optionKey]) === String(value));
    if (!option) {
      showError("Оберіть значення з наявного списку.");
      return null;
    }
    return option[column.optionKey];
  }
  const text = String(value).trim();
  if (!text) {
    showError("Значення не може бути порожнім.");
    return null;
  }
  if (column && column.type === "number") {
    const number = Number(text);
    if (!Number.isFinite(number) || number < 0) {
      showError("Введіть коректне невід’ємне число.");
      return null;
    }
    return number;
  }
  return text;
}

function startEditing(cell, entityName, item, column) {
  if (column.editable === false || cell.querySelector("input")) return;

  const oldValue = String(item[column.key]);
  const input = column.type === "select" ? document.createElement("select") : document.createElement("input");
  if (column.type === "select") {
    const source = entities[column.optionsFrom].data;
    source.forEach(record => {
      const option = document.createElement("option");
      option.value = record[column.optionKey];
      option.textContent = record[column.optionKey];
      input.append(option);
    });
    input.value = oldValue;
  } else {
    input.type = column.type === "number" ? "number" : "text";
    input.value = oldValue;
  }
  input.className = "cell-editor";
  input.setAttribute("aria-label", `Нове значення: ${column.label}`);
  cell.textContent = "";
  cell.append(input);
  input.focus();
  if (typeof input.select === "function") input.select();

  let finished = false;
  function finish(save) {
    if (finished) return;
    finished = true;
    if (save) {
      const newValue = validateValue(entityName, column.key, input.value);
      if (newValue !== null) {
        if (entityName === "teachers" && column.key === "fullName" && newValue !== oldValue) {
          // Оновлюємо посилання на викладача в дисциплінах, щоб зв’язок не порушився.
          courses.forEach(course => {
            if (course.teacher === oldValue) course.teacher = newValue;
          });
        }
        item[column.key] = newValue;
        saveData();
      }
    }
    renderAll();
  }

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", () => finish(true));
}

function deleteRecord(entityName, item) {
  if (entityName === "teachers") {
    const linkedCourses = courses.filter(course => course.teacher === item.fullName);
    if (linkedCourses.length > 0) {
      showError(`Неможливо видалити викладача «${item.fullName}»: він/вона використовується в таблиці «Дисципліни» (${linkedCourses.map(course => course.name).join(", ")}). Спочатку змініть викладача для цих дисциплін.`);
      return;
    }
  }

  const labels = { students: "студента", teachers: "викладача", courses: "дисципліну" };
  if (!window.confirm(`Видалити ${labels[entityName]} «${item.fullName || item.name}»?`)) return;
  const data = entities[entityName].data;
  const index = data.findIndex(record => record.id === item.id);
  if (index !== -1) data.splice(index, 1);
  saveData();
  renderAll();
}

function renderTable(entityName) {
  const entity = entities[entityName];
  const head = document.getElementById(`${entityName}-head`);
  const body = document.getElementById(`${entityName}-body`);
  const count = document.getElementById(`${entityName}-count`);

  head.replaceChildren();
  const headerRow = document.createElement("tr");
  entity.columns.forEach(column => {
    const th = document.createElement("th");
    th.textContent = column.label;
    headerRow.append(th);
  });
  const actionHeader = document.createElement("th");
  actionHeader.textContent = "Дії";
  headerRow.append(actionHeader);
  head.append(headerRow);

  body.replaceChildren();
  entity.data.forEach(item => {
    const row = document.createElement("tr");
    entity.columns.forEach(column => {
      const cell = document.createElement("td");
      cell.textContent = item[column.key];
      if (column.editable !== false) {
        cell.classList.add("editable-cell");
        cell.title = "Натисніть, щоб редагувати";
        cell.addEventListener("click", () => startEditing(cell, entityName, item, column));
      }
      row.append(cell);
    });

    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.title = "Видалити рядок";
    deleteButton.setAttribute("aria-label", `Видалити запис ID ${item.id}`);
    deleteButton.addEventListener("click", () => deleteRecord(entityName, item));
    actionCell.append(deleteButton);
    row.append(actionCell);
    body.append(row);
  });

  count.textContent = `${entity.data.length} записів`;
}

function renderAll() {
  Object.keys(entities).forEach(renderTable);
}

// Перемикання таблиць.
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".table-panel");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.target;
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    panels.forEach(panel => panel.classList.toggle("active", panel.id === targetId));
  });
});

loadData();
renderAll();
