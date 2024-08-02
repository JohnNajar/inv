// static/js/login.js
// rev 0.02

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggle-password-visibility').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const passwordIcon = document.getElementById('password-icon');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('bi-eye-slash');
            passwordIcon.classList.add('bi-eye');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('bi-eye');
            passwordIcon.classList.add('bi-eye-slash');
        }
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        const botPreventer = document.getElementById('bot-preventer');
        if (!botPreventer.checked) {
            event.preventDefault();
            alert('Please confirm you are not a robot.');
        }
    });
});
