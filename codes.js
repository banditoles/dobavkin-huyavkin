const status = byId('catalogStatus');

function saveCodes(nextCodes, message) {
  try {
    localStorage.setItem(catalogKey, JSON.stringify(Object.fromEntries(nextCodes)));
  } catch {
    status.textContent = 'Не удалось сохранить изменения. Проверьте доступ к хранилищу браузера.';
    return false;
  }
  codes.clear();
  for (const [code, title] of nextCodes) codes.set(code, title);
  status.textContent = message;
  renderCatalog();
  return true;
}

function validEntry(code, title) {
  if (!/^[a-z0-9_-]+$/.test(code) || !categoryOf(title)) {
    status.textContent = 'Введите код без пробелов и название с моделью iPhone или объёмом памяти.';
    return false;
  }
  return true;
}

function renderCatalog() {
  const fragment = document.createDocumentFragment();
  const options = getCatalogOptions().sort((a, b) =>
    a.code.localeCompare(b.code, 'ru', {numeric: true}) || a.title.localeCompare(b.title, 'ru')
  );
  for (const option of options) {
    const row = document.createElement('tr');
    const codeCell = document.createElement('td');
    const codeInput = document.createElement('input');
    codeInput.className = 'code-input';
    codeInput.value = option.code;
    codeInput.maxLength = 40;
    codeInput.setAttribute('aria-label', 'Код для ' + option.title);
    codeCell.append(codeInput);

    const titleCell = document.createElement('td');
    const titleInput = document.createElement('input');
    titleInput.className = 'title-input';
    titleInput.value = option.title;
    titleInput.maxLength = 200;
    titleInput.setAttribute('aria-label', 'Название для кода ' + option.code);
    titleCell.append(titleInput);

    const actionCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'actions';
    const save = document.createElement('button');
    save.type = 'button';
    save.textContent = 'Сохранить';
    save.onclick = () => {
      const code = normalizeCode(codeInput.value);
      const title = normalizeCapacityTitle(titleInput.value.trim());
      if (!validEntry(code, title)) return;
      if (code !== option.code && (codes.has(code) || variantsByCode.has(code))) {
        status.textContent = 'Код «' + code + '» уже существует.';
        return;
      }
      const nextCodes = new Map(codes);
      if (code !== option.code) nextCodes.delete(option.code);
      nextCodes.set(code, title);
      saveCodes(nextCodes, 'Код «' + code + '» сохранён.');
    };
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'secondary';
    const builtIn = variantsByCode.has(option.code);
    reset.textContent = builtIn ? 'Сбросить' : 'Удалить';
    reset.disabled = !codes.has(option.code);
    reset.onclick = () => {
      const nextCodes = new Map(codes);
      nextCodes.delete(option.code);
      saveCodes(nextCodes, builtIn ? 'Восстановлено встроенное значение кода.' : 'Код удалён.');
    };
    actions.append(save, reset);
    actionCell.append(actions);
    row.append(codeCell, titleCell, actionCell);
    fragment.append(row);
  }
  byId('catalogRows').replaceChildren(fragment);
  byId('catalogCount').textContent = options.length + ' вариантов';
}

byId('catalog').onsubmit = event => {
  event.preventDefault();
  const code = normalizeCode(byId('alias').value);
  const title = normalizeCapacityTitle(byId('title').value.trim());
  if (!validEntry(code, title)) return;
  if (codes.has(code) || variantsByCode.has(code)) {
    status.textContent = 'Код уже существует. Измените его в таблице.';
    return;
  }
  const nextCodes = new Map(codes);
  nextCodes.set(code, title);
  if (saveCodes(nextCodes, 'Код «' + code + '» добавлен.')) event.target.reset();
};

window.addEventListener('storage', event => {
  if (event.key === catalogKey || event.key === null) location.reload();
});
renderCatalog();
