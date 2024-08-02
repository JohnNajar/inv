// rev 0.01
function loadAddSubcategoryListener() {
    document.getElementById('add-subcategory-form').addEventListener('submit', function(event) {
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

