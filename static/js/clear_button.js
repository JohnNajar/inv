// static/js/clear_button.js
// rev 0.03

function loadClearButtonListener() {
    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryName = document.querySelector('h1').innerText;
            if (confirm(`Are you sure you want to clear all amounts for ${categoryName}?`)) {
                fetch(`/clear_amounts/${categoryName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    document.querySelectorAll('.amount-input').forEach(input => {
                        input.value = 0;
                        input.closest('tr').classList.add('bg-success');
                        setTimeout(() => {
                            input.closest('tr').classList.remove('bg-success');
                        }, 500);
                    });
                    console.log('All amounts cleared successfully');
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            }
        });
    }
}
