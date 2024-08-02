// rev 0.01

function loadAmountUpdateListeners() {
    document.querySelectorAll('.amount-input').forEach(input => {
        input.addEventListener('blur', (event) => {
            const itemId = event.target.getAttribute('data-item-id');
            const newAmount = event.target.value.trim();

            let evaluatedAmount = newAmount;
            try {
                if (/^[0-9+\-*/().\s]+$/.test(newAmount)) {
                    evaluatedAmount = Function('"use strict";return (' + newAmount + ')')();
                    if (isNaN(evaluatedAmount)) {
                        throw new Error('Invalid expression');
                    }
                }
            } catch (error) {
                console.error('Error evaluating expression:', error);
                alert('Invalid expression. Please enter a valid value.');
                return;
            }

            event.target.value = evaluatedAmount;

            fetch(`/update_amount/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `amount=${evaluatedAmount}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const tableRow = event.target.closest('tr');
                tableRow.classList.add('bg-success');
                setTimeout(() => {
                    tableRow.classList.remove('bg-success');
                }, 500);
                console.log('Amount updated successfully');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                const tableRow = event.target.closest('tr');
                tableRow.classList.add('bg-danger');
                setTimeout(() => {
                    tableRow.classList.remove('bg-danger');
                }, 500);
            });
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const nextInput = input.closest('tr').nextElementSibling?.querySelector('.amount-input');
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
}
