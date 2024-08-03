// static/js/add/add_subcategory.js
// rev 0.02

function loadAddSubcategoryListener() {
    const addSubcategoryForm = document.getElementById('add-subcategory-form');
    if (addSubcategoryForm) {
        addSubcategoryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/add_subcategory', {
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
