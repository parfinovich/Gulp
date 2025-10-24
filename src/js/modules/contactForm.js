// Contact Form functionality
export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    console.log('Form submitted:', data);

    // Здесь можно добавить отправку данных на сервер
    // Пример:
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });
    //   
    //   if (response.ok) {
    //     alert('Message sent successfully!');
    //     form.reset();
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Failed to send message. Please try again.');
    // }

    // Временная заглушка - показываем уведомление
    alert('Thank you for your message! We\'ll get back to you soon.');
    form.reset();
  });

  // Валидация в реальном времени
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.validity.valueMissing) {
        input.style.borderColor = '#ef4444';
      } else if (input.validity.typeMismatch) {
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = '';
      }
    });

    input.addEventListener('input', () => {
      if (input.style.borderColor === 'rgb(239, 68, 68)') {
        input.style.borderColor = '';
      }
    });
  });
}
