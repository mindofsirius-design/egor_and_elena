// Функция для отправки данных формы
async function submitFormData(formData) {
    // URL вашего веб-приложения Apps Script
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmVvfUIbcOZntVzI-XJCpVuRinETXcubwMl2h8hKxKPxKpm8Beh1zNqwNyPNmvLuFnUA/exec';
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Важно для работы с Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Так как мы используем no-cors, мы не можем проверить статус ответа
        return { success: true, message: 'Данные успешно отправлены!' };
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return { 
            success: false, 
            message: 'Произошла ошибка при отправке. Попробуйте еще раз.' 
        };
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {

    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}


modal = document.getElementById('modal');

// Открытие модального окна
document.getElementById('openBtn').addEventListener('click', function() {
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




// Обработчик отправки формы
document.getElementById('attendanceForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Сбор данных формы
    const formData = {
        name: document.getElementById('name').value,
        attend: document.querySelector('input[name="attend"]:checked')?.value || '',
        companion: document.querySelector('input[name="companion"]:checked')?.value || '',
        transfer: document.querySelector('input[name="transfer"]:checked')?.value || '',
        additionalInfo: document.getElementById('additionalInfo').value,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Показываем индикатор загрузки
    const submitBtn = document.getElementById('btnSend');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Отправляем данные
    const result = await submitFormData(formData);
    
    // Возвращаем кнопку в исходное состояние
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Показываем результат
    if (result.success) {
        showNotification('✅ ' + result.message, 'success');
        // Очищаем форму через 2 секунды
        setTimeout(() => {
            document.getElementById('attendanceForm').reset();
        }, 2000);
    } else {
        showNotification('❌ ' + result.message, 'error');
    }
});



