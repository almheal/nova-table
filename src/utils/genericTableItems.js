// Генерация дат начиная с текущего дня
const generateDates = (incrementDays) => {
  const SECONDS_IN_ONE_DAY = 86400;

  // Из текущего дня вычитаем 1 день * incrementDays
  const date = new Date(
    (Date.now() / 1000 - SECONDS_IN_ONE_DAY * incrementDays) * 1000
  );

  // Формат даты yy-mm-dd
  return date.toISOString().split("T")[0];
};

// Генерация элементов таблицы
const generateTableItems = (countItems) => {
  const items = [];

  for (let i = 0; i < countItems; i++) {
    items.push({
      cells: {
        date: {
          value: generateDates(i),
        },
        title: {
          value: `Название-${i + 1}`,
        },
        count: {
          value: i + 1,
        },
        distance: {
          value: (i + 1) * 10,
        },
      },
    });
  }

  return items;
};

export default generateTableItems;
