// ======== Utils ========

// Throttle para reduzir chamadas em scroll
function throttle(fn, delay = 100) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn(...args);
        }
    };
}

// ======== Inicialização ========

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initContactForm();
    initScrollTop();

    console.log('Portfolio loaded successfully!');
});

// ======== Navegação ========

function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');

    // Toggle do menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Scroll otimizado
    window.addEventListener(
        'scroll',
        throttle(() => {
            const scrollY = window.scrollY;

            // Efeito no header
            header.classList.toggle('scrolled', scrollY > 100);

            // Destacar link ativo
            let current = '';
            sections.forEach(section => {
                if (scrollY >= section.offsetTop - 200) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${current}`
                );
            });
        }, 120)
    );
}

// ======== Animação das Skills ========

function initAnimations() {
    const bars = document.querySelectorAll('.skill__level');

    if (!bars.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width =
                        entry.target.getAttribute('data-level') + '%';
                }
            });
        },
        { threshold: 0.5 }
    );

    bars.forEach(bar => observer.observe(bar));
}

// ======== Formulário de Contato ========

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        showNotification(
            'Mensagem enviada com sucesso! Entrarei em contato em breve.',
            'success'
        );

        form.reset();
    });
}

// ======== Scroll Top ========

function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener(
        'scroll',
        throttle(() => {
            btn.classList.toggle('show', window.scrollY > 500);
        }, 120)
    );

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ======== Sistema de Notificações ========

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__message">${message}</span>
        <button class="notification__close">&times;</button>
    `;

    // Injeta estilos somente 1 vez
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: #fff;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                transform: translateX(400px);
                transition: transform .3s ease;
            }
            .notification.show { transform: translateX(0); }
            .notification--success { border-left: 4px solid #48bb78; }
            .notification--error { border-left: 4px solid #f56565; }
            .notification--info { border-left: 4px solid #4299e1; }
            .notification__close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #718096;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 20);

    // Auto-remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Clique para fechar
    notification
        .querySelector('.notification__close')
        .addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
}
