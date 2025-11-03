/**
 * Контактная форма - валидация и отправка
 */

/**
 * Показывает сообщение об успешной отправке
 * @param {HTMLFormElement} form - форма
 */
function showSuccessMessage(form) {
  const messageEl = document.createElement('div');
  messageEl.className = 'contact-form__success';
  messageEl.textContent = 'Thank you for your message! We\'ll get back to you soon.';
  messageEl.setAttribute('role', 'alert');
  messageEl.setAttribute('aria-live', 'polite');
  
  form.insertAdjacentElement('afterend', messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

/**
 * Показывает сообщение об ошибке
 * @param {HTMLFormElement} form - форма
 * @param {string} message - текст ошибки
 */
function showErrorMessage(form, message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'contact-form__error';
  messageEl.textContent = message;
  messageEl.setAttribute('role', 'alert');
  messageEl.setAttribute('aria-live', 'assertive');
  
  form.insertAdjacentElement('afterend', messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

/**
 * Валидация email
 * @param {string} email - email адрес
 * @returns {boolean} - валиден ли email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация имени
 * @param {string} name - имя
 * @returns {boolean} - валидно ли имя
 */
function isValidName(name) {
  return name.trim().length >= 2;
}

/**
 * Валидация сообщения
 * @param {string} message - сообщение
 * @returns {boolean} - валидно ли сообщение
 */
function isValidMessage(message) {
  return message.trim().length >= 10;
}

/**
 * Устанавливает ошибку для поля
 * @param {HTMLElement} input - поле ввода
 * @param {string} message - текст ошибки
 */
function setInputError(input, message) {
  input.classList.add('contact-form__input--error');
  input.setAttribute('aria-invalid', 'true');
  
  // Удаляем старое сообщение об ошибке если есть
  const existingError = input.parentElement.querySelector('.contact-form__field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Добавляем новое сообщение
  const errorEl = document.createElement('span');
  errorEl.className = 'contact-form__field-error';
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');
  input.parentElement.appendChild(errorEl);
}

/**
 * Очищает ошибку для поля
 * @param {HTMLElement} input - поле ввода
 */
function clearInputError(input) {
  input.classList.remove('contact-form__input--error');
  input.setAttribute('aria-invalid', 'false');
  
  const errorEl = input.parentElement.querySelector('.contact-form__field-error');
  if (errorEl) {
    errorEl.remove();
  }
}

/**
 * Инициализация контактной формы
 */
export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');

  if (!form) return;

  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const messageInput = form.querySelector('[name="message"]');
  const submitButton = form.querySelector('[type="submit"]');

  if (!nameInput || !emailInput || !messageInput || !submitButton) {
    console.warn('[Contact Form] Required form fields not found');
    return;
  }

  // Обработка отправки формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Очищаем предыдущие ошибки
    clearInputError(nameInput);
    clearInputError(emailInput);
    clearInputError(messageInput);

    // Получаем данные
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Валидация
    let isValid = true;

    if (!isValidName(data.name)) {
      setInputError(nameInput, 'Please enter your name (minimum 2 characters)');
      isValid = false;
    }

    if (!isValidEmail(data.email)) {
      setInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    if (!isValidMessage(data.message)) {
      setInputError(messageInput, 'Please enter a message (minimum 10 characters)');
      isValid = false;
    }

    if (!isValid) {
      // Фокус на первое поле с ошибкой
      const firstError = form.querySelector('.contact-form__input--error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Отключаем кнопку во время отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      // Здесь должна быть отправка на сервер
      // Пример:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Успешная отправка
      showSuccessMessage(form);
      form.reset();
      
      // Очищаем все ошибки
      clearInputError(nameInput);
      clearInputError(emailInput);
      clearInputError(messageInput);

    } catch (error) {
      showErrorMessage(form, 'Failed to send message. Please try again.');
      console.error('[Contact Form] Submission error:', error);
    } finally {
      // Включаем кнопку обратно
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });

  // Валидация в реальном времени
  nameInput.addEventListener('blur', () => {
    if (nameInput.value && !isValidName(nameInput.value)) {
      setInputError(nameInput, 'Please enter your name (minimum 2 characters)');
    } else {
      clearInputError(nameInput);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      setInputError(emailInput, 'Please enter a valid email address');
    } else {
      clearInputError(emailInput);
    }
  });

  messageInput.addEventListener('blur', () => {
    if (messageInput.value && !isValidMessage(messageInput.value)) {
      setInputError(messageInput, 'Please enter a message (minimum 10 characters)');
    } else {
      clearInputError(messageInput);
    }
  });

  // Очистка ошибок при вводе
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (input.classList.contains('contact-form__input--error')) {
        clearInputError(input);
      }
    });
  });
}
