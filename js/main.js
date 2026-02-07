let scrollManager;

class ScrollManager {
    constructor() {
        this.container = document.getElementById('main-container');
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        this.scrollToDownBtn = document.getElementById('scrollToDown');
        this.modules = document.querySelectorAll('.module');
        this.isScrolling = false;
        this.scrollDelay = 500; // Задержка между прокрутками в мс
        this.lastScrollTime = 0;
        this.options = {
			verticalScroll: false, // или значение по умолчанию
			animationDuration: 500
		};
		this.isAnimating = false;
        this.init();
    }
    
    init() {
        // Проверка существования элементов
        if (!this.container) {
            console.error('Элемент main-container не найден');
            return;
        }
        
        this.setupEventListeners();
    }
    
    // Прокрутка к конкретному модулю
    scrollToModule(index) {
        if (this.isScrolling) return;
        
        if (index >= 0 && index < this.modules.length) {
            this.isScrolling = true;
            this.modules[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Сброс флага прокрутки через время
            setTimeout(() => {
                this.isScrolling = false;
            }, 500);
			
		this.toggleScrollButtons(index);
        }
    }
    
    // Прокрутка к следующему модулю
    scrollToNext() {
        if (this.isScrolling) return;
        
        const currentIndex = this.getCurrentModuleIndex();
        if (currentIndex < this.modules.length - 1) {
            this.scrollToModule(currentIndex + 1);
        }
    }
    
    // Прокрутка к предыдущему модулю
    scrollToPrev() {	
        if (this.isScrolling) return;
        
        const currentIndex = this.getCurrentModuleIndex();
        if (currentIndex > 0) {
            this.scrollToModule(currentIndex - 1);
        }
    }
    
    // Получение индекса текущего модуля
	getCurrentModuleIndex() {
		if (!this.container || this.modules.length === 0) return 0;
		
		// Для скролла на уровне window
		const windowScroll = window.scrollY || document.documentElement.scrollTop;
		const windowHeight = window.innerHeight;
		const windowCenter = windowScroll + windowHeight / 2;
		
		let currentIndex = 0;
		let closestDistance = Infinity;
		
		this.modules.forEach((module, index) => {
			// Получаем абсолютную позицию элемента относительно документа
			const moduleRect = module.getBoundingClientRect();
			const absoluteModuleTop = windowScroll + moduleRect.top;
			const moduleHeight = moduleRect.height;
			const moduleCenter = absoluteModuleTop + moduleHeight / 2;
			
			const distance = Math.abs(moduleCenter - windowCenter);
			
			if (distance < closestDistance) {
				closestDistance = distance;
				currentIndex = index;
			}
		});
		
		return currentIndex;
	}
    
    // Показ/скрытие кнопок прокрутки
    toggleScrollButtons(indexModule) {
      
        // Кнопка "Вверх"
        if (indexModule > 0) {
            this.scrollToTopBtn.classList.add('show');
        } else {
            this.scrollToTopBtn.classList.remove('show');
        }

        // Кнопка "Вниз" - исправленная версия
        if (indexModule < this.modules.length - 1) {
            this.scrollToDownBtn.style.display = '';
        } else {
            this.scrollToDownBtn.style.display = 'none';
        }
    }
        
    // Настройка обработчиков событий
    setupEventListeners() {
		
		//Настройка кнопки "Вверх"
		this.scrollToTopBtn.addEventListener('click', () => {
			this.scrollToModule(0);
		});
		
        //Настройка кнопки "Вниз"
		this.scrollToDownBtn.addEventListener('click', () => {
			this.scrollToNext();
		});
        
        // Прокрутка контейнера
        this.container.addEventListener('scroll', () => {
            this.toggleScrollButtons();
        });
        
        // Колесо мыши с задержкой
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
			
            const currentTime = Date.now();
            if (currentTime - this.lastScrollTime < this.scrollDelay || this.isScrolling) {
                return;
            }

            this.lastScrollTime = currentTime;
            
            if (e.deltaY > 0) {
                this.scrollToNext();
            } else {
                this.scrollToPrev();
            }
        }, { passive: false });
        
        // Управление клавиатурой
        document.addEventListener('keydown', (e) => {
            // Игнорируем, если фокус в поле ввода
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.scrollToNext();
                    break;
                    
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.scrollToPrev();
                    break;
                    
                case ' ':
                    // Пробел только если не в поле ввода
                    if (e.target === document.body) {
                        e.preventDefault();
                        if (!e.shiftKey) {
                            this.scrollToNext();
                        } else {
                            this.scrollToPrev();
                        }
                    }
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.scrollToModule(0);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.scrollToModule(this.modules.length - 1);
                    break;
                    
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    const num = parseInt(e.key);
                    if (num <= this.modules.length) {
                        e.preventDefault();
                        this.scrollToModule(num - 1);
                    }
                    break;
            }
        });
        
		// Swipe для мобильных устройств
			let touchStartY = 0;
			let touchEndY = 0;
			let touchStartTime = 0;
			let isTouchActive = false;

			this.container.addEventListener('touchstart', (e) => {
			  touchStartY = e.touches[0].clientY;
			  touchStartTime = Date.now();
			  isTouchActive = true;    
			  
			  // Блокируем скролл по умолчанию если включен vertical scroll
			  if (this.options.verticalScroll) {
				e.preventDefault();
			  }
			}, { passive: false });

			this.container.addEventListener('touchmove', (e) => {
			  if (!isTouchActive) return;  
			  
			  // Блокируем вертикальный скролл при горизонтальном свайпе
			  const touchY = e.touches[0].clientY;
			  const diffY = Math.abs(touchY - touchStartY);
			  
			  // Если свайп в основном вертикальный - блокируем, чтобы не было конфликта
			  if (diffY > 10 && this.options.verticalScroll) {
				e.preventDefault();
			  }
			}, { passive: false });

			this.container.addEventListener('touchend', (e) => {
			  if (!isTouchActive) return;
			  
			  touchEndY = e.changedTouches[0].clientY;
			  const touchEndTime = Date.now();
			  
			  this.handleSwipe(touchStartY, touchEndY, touchEndTime - touchStartTime);
			  isTouchActive = false;
			}, { passive: true });

			// Также отслеживаем отмену касания
			this.container.addEventListener('touchcancel', () => {
			  isTouchActive = false;
			});
	}
			
	// Обработка свайпов
	handleSwipe(startY, endY, duration) {
		if (this.isScrolling || this.isAnimating) return;
		
		const swipeThreshold = 30; // Минимальное расстояние свайпа
		const speedThreshold = 0.2; // Минимальная скорость свайпа (пикселей/мс)
		const diff = startY - endY;
		const speed = Math.abs(diff) / duration;
		
		// Проверяем и расстояние, и скорость свайпа
		if (Math.abs(diff) > swipeThreshold && speed > speedThreshold) {
			// Блокируем дополнительные свайпы на время анимации
			this.isAnimating = true;
			
			requestAnimationFrame(() => {
				if (diff > 0) {
					// Свайп вверх - следующий модуль
					this.scrollToNext();
				} else {
					// Свайп вниз - предыдущий модуль
					this.scrollToPrev();
				}
				
				// Снимаем блокировку после анимации
				setTimeout(() => {
					this.isAnimating = false;
				}, Math.max(300, this.options.animationDuration || 500));
			});
		}
	}
    
    // Обновление списка модулей
    refreshModules() {
        this.modules = document.querySelectorAll('.module');
        console.log(`ScrollManager: обновлены модули, найдено ${this.modules.length}`);
    }
}

// Скрытие индикатора загрузки страницы
function hidePreloader() {
	const loader = document.getElementById('neo-loader');
	
	setTimeout(() => {
		loader.style.opacity = '0';
		loader.style.transform = 'scale(1.2)';
		
		setTimeout(() => {
			loader.style.display = 'none';
			//loader.parentNode.removeChild(loader);
			//loader.remove();
		}, 800);
	}, 1500);
}
    


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	
	// Резервный таймер на скрытие иникатора загрузки
	setTimeout(hidePreloader, 10000);
		
    scrollManager = new ScrollManager();
	scrollManager.refreshModules();
      
});


//Когда страница загрузилась листаем в начало сайта и скрываем индикатор загрузки
window.addEventListener('load', () => {
	scrollManager.scrollToModule(5);
	hidePreloader();
});
	