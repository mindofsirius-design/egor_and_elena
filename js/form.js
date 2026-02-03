// Открытие модального окна
document.getElementById('openBtn').addEventListener('click', function() {
    document.getElementById('modal').classList.add('show');
});

// Закрытие при клике вне окна
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Обработка формы
document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Здесь код отправки формы
    alert('Форма отправлена!');
    document.getElementById('modal').classList.remove('show');
});