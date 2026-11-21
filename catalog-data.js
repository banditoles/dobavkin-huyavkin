
const byId = id => document.getElementById(id);
const catalogKey = 'iphone-intake-codes-v1';
let savedCodes = {};
try { savedCodes = JSON.parse(localStorage.getItem(catalogKey)) || {}; } catch {}
const codes = new Map(Object.entries({'14p2561':'iPhone 14 Pro 256 Gb Фиолетовый', ...savedCodes}));
// Model code, category suffix, available capacities, and Russian color names.
const models = [
  ['x', 'X', '64 256', 'Белый|Чёрный'],
  ['xr', 'XR', '64 128 256', 'Чёрный|Белый|Синий|Жёлтый|Коралловый|Красный'],
  ['xs', 'XS', '64 256 512', 'Белый|Чёрный|Золотой'],
  ['xsm', 'XS Max', '64 256 512', 'Белый|Чёрный|Золотой'],
  ['11', '11', '64 128 256', 'Чёрный|Белый|Зелёный|Жёлтый|Фиолетовый|Красный'],
  ['11p', '11 Pro', '64 256 512', 'Белый|Чёрный|Золотой|Зелёный'],
  ['11pm', '11 Pro Max', '64 256 512', 'Белый|Чёрный|Золотой|Зелёный'],
  ['se2', 'SE (2-го поколения)', '64 128 256', 'Чёрный|Белый|Красный'],
  ['12m', '12 mini', '64 128 256', 'Чёрный|Белый|Красный|Зелёный|Синий|Фиолетовый'],
  ['12', '12', '64 128 256', 'Чёрный|Белый|Красный|Зелёный|Синий|Фиолетовый'],
  ['12p', '12 Pro', '128 256 512', 'Белый|Чёрный|Золотой|Синий'],
  ['12pm', '12 Pro Max', '128 256 512', 'Белый|Чёрный|Золотой|Синий'],
  ['13m', '13 mini', '128 256 512', 'Красный|Белый|Чёрный|Синий|Розовый|Зелёный'],
  ['13', '13', '128 256 512', 'Красный|Белый|Чёрный|Синий|Розовый|Зелёный'],
  ['13p', '13 Pro', '128 256 512 1t', 'Чёрный|Золотой|Белый|Голубой|Зелёный'],
  ['13pm', '13 Pro Max', '128 256 512 1t', 'Чёрный|Золотой|Белый|Голубой|Зелёный'],
  ['se3', 'SE (3-го поколения)', '64 128 256', 'Красный|Белый|Чёрный'],
  ['14', '14', '128 256 512', 'Чёрный|Белый|Красный|Синий|Фиолетовый|Жёлтый'],
  ['14pl', '14 Plus', '128 256 512', 'Чёрный|Белый|Красный|Синий|Фиолетовый|Жёлтый'],
  ['14p', '14 Pro', '128 256 512 1t', 'Белый|Золотой|Чёрный|Фиолетовый'],
  ['14pm', '14 Pro Max', '128 256 512 1t', 'Белый|Золотой|Чёрный|Фиолетовый'],
  ['15', '15', '128 256 512', 'Чёрный|Голубой|Зелёный|Жёлтый|Розовый'],
  ['15pl', '15 Plus', '128 256 512', 'Чёрный|Голубой|Зелёный|Жёлтый|Розовый'],
  ['15p', '15 Pro', '128 256 512 1t', 'Чёрный|Белый|Синий|Титан'],
  ['15pm', '15 Pro Max', '256 512 1t', 'Чёрный|Белый|Синий|Титан'],
  ['16', '16', '128 256 512', 'Чёрный|Белый|Розовый|Зелёный|Синий'],
  ['16pl', '16 Plus', '128 256 512', 'Чёрный|Белый|Розовый|Зелёный|Синий'],
  ['16p', '16 Pro', '128 256 512 1t', 'Чёрный|Белый|Титан|Десерт'],
  ['16pm', '16 Pro Max', '256 512 1t', 'Чёрный|Белый|Титан|Десерт'],
  ['16e', '16e', '128 256 512', 'Чёрный|Белый'],
  ['17', '17', '256 512', 'Чёрный|Белый|Голубой|Зелёный|Фиолетовый'],
  ['air', 'Air', '256 512 1t', 'Чёрный|Белый|Золотой|Голубой'],
  ['17p', '17 Pro', '256 512 1t', 'Белый|Оранжевый|Синий'],
  ['17pm', '17 Pro Max', '256 512 1t 2t', 'Белый|Оранжевый|Синий'],
  ['17e', '17e', '256 512', 'Чёрный|Белый|Розовый']
];

const colorCodes = new Map([
  ['Белый', 'w'], ['Чёрный', 'b'], ['Синий', 'b'], ['Голубой', 'gol'],
  ['Жёлтый', 'y'], ['Коралловый', 'k'], ['Красный', 'r'], ['Зелёный', 'gr'],
  ['Золотой', 'g'], ['Фиолетовый', 'f'], ['Розовый', 'p'], ['Титан', 't'],
  ['Десерт', 'g'], ['Оранжевый', 'o']
]);
const variantsByCode = new Map();
for (const [modelCode, name, capacities, palette] of models) {
  for (const capacity of capacities.split(' ')) {
    const size = capacity === '1t' ? '1024 Gb' : capacity === '2t' ? '2 Tb' : capacity + ' Gb';
    for (const color of palette.split('|')) {
      const colorCode = modelCode === '15' && capacity === '128' && color === 'Голубой' ? 'b' : colorCodes.get(color);
      const code = modelCode + capacity + colorCode;
      const variants = variantsByCode.get(code) || [];
      variants.push('iPhone ' + name + ' ' + size + ' ' + color);
      variantsByCode.set(code, variants);
    }
  }
}
function categoryOf(title) {
  const capacity = /\s+\d+\s*(?:GB|TB|ГБ|ТБ|G|T)(?=\s|$)/iu.exec(title);
  if (capacity) return title.slice(0, capacity.index);
  return /^iPhone\s+(?:\d+[ecrs]?|SE|Air|X[RS]?)(?:\s+(?:Pro Max|Pro|Plus|mini|Max|Air))?(?=\s|$)/i.exec(title)?.[0] || '';
}
const russianKeys = 'йцукенгшщзхъфывапролджэячсмитьбюё';
const latinKeys = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
function normalizeCode(value) {
  return value.trim().toLowerCase().replace(/[а-яё]/gu, letter => latinKeys[russianKeys.indexOf(letter)]);
}
function normalizeCapacityTitle(title) {
  return title.replace(/\s+1\s*(?:tb|тб|t)(?=\s|$)/iu, ' 1024 Gb');
}
function normalizeTitle(value) {
  return normalizeCapacityTitle(value).trim().toLowerCase().replaceAll('ё', 'е').replace(/\s+/g, ' ');
}

function getCatalogOptions() {
  const options = [];
  for (const [code, variants] of variantsByCode) {
    if (!codes.has(code)) {
      for (const title of variants) options.push({code, title, name: normalizeTitle(title)});
    }
  }
  for (const [code, savedTitle] of codes) {
    const title = normalizeCapacityTitle(savedTitle);
    options.push({code, title, name: normalizeTitle(title)});
  }
  return options;
}

