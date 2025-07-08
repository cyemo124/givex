(function () {
    'use strict';

    const forms = document.querySelectorAll('.validated-form');

    Array.from(forms).forEach(function (form) {
        const passwordInput = form.querySelector('#password');
        const confirmPasswordInput = form.querySelector('#confirmPassword');
        const mismatchFeedback = form.querySelector('#passwordMismatch');

        // Toggle visibility
        form.querySelectorAll('.toggle-password').forEach((button) => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target.type === 'password') {
                    target.type = 'text';
                    button.innerText = '🙈';
                } else {
                    target.type = 'password';
                    button.innerText = '👁️';
                }
            });
        });

        // Password match validation on input
        function checkPasswordMatch() {
            const match = passwordInput.value === confirmPasswordInput.value;
            confirmPasswordInput.setCustomValidity(match ? '' : 'Passwords do not match');
            mismatchFeedback.style.display = match ? 'none' : 'block';
        }

        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        passwordInput.addEventListener('input', checkPasswordMatch);

        form.addEventListener('submit', function (event) {
            checkPasswordMatch();

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();
