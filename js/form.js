
modal = document.getElementById('modal');
openBtn = document.getElementById('openBtn');

// Открытие модального окна
openBtn.addEventListener('click', function() {
    modal.classList.add('show');
});

// Закрытие при клике вне окна
modal.addEventListener('click', function(e) {
    if (e.target === this) {
        modal.classList.remove('show');
    }
});

// Закрытие при клике на крестик
document.getElementById('btnClose').addEventListener('click', function() {
  modal.classList.remove('show');
});

// Обработка и отправка формы
document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Здесь код отправки формы
    alert('Форма отправлена!');
    modal.classList.remove('show');
});