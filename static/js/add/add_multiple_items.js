// static/js/add/add_multiple_items.js
// rev 0.02

function loadAddMultipleItemsListener() {
    const addMultipleItemsForm = document.getElementById('add-multiple-items-form');
    if (addMultipleItemsForm) {
        addMultipleItemsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/add_multiple_items_by_names', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    this.reset();
                }
            });
        });
    }
}
