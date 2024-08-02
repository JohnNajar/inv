// rev 0.03

function loadUserListeners() {
    const modifyUserDialog = document.getElementById('modify-user-dialog');
    const addUserDialog = document.getElementById('add-user-dialog');
    const deleteUserDialog = document.getElementById('delete-user-dialog');

    document.querySelectorAll('.modify-user-btn').forEach(button => {
        button.addEventListener('click', event => {
            const userId = button.getAttribute('data-user-id');
            fetch(`/get_user/${userId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('modify-username').value = data.username;
                    document.getElementById('modify-password').value = data.password;
                    document.getElementById('modify-role').value = data.role;
                    document.getElementById('modify-user-id').value = data.id;
                    modifyUserDialog.showModal();
                });
        });
    });

    const addUserButton = document.getElementById('add-user-btn');
    if (addUserButton) {
        addUserButton.addEventListener('click', () => {
            addUserDialog.showModal();
        });
    }

    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', event => {
            const userId = button.getAttribute('data-user-id');
            document.getElementById('delete-user-id').value = userId;
            deleteUserDialog.showModal();
        });
    });

    const modifyPasswordToggle = document.getElementById('toggle-modify-password-visibility');
    if (modifyPasswordToggle) {
        modifyPasswordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('modify-password');
            const passwordIcon = document.getElementById('modify-password-icon');
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
    }

    const addPasswordToggle = document.getElementById('toggle-add-password-visibility');
    if (addPasswordToggle) {
        addPasswordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('add-password');
            const passwordIcon = document.getElementById('add-password-icon');
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
    }
}
