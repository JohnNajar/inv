// static/js/add/add_single_item.js
// rev 0.02

function loadAddSingleItemListener() {
    const addSingleItemForm = document.getElementById('add-single-item-form');
    if (addSingleItemForm) {
        addSingleItemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/add_item', {
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
