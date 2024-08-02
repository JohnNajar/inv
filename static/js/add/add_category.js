// rev 0.01
function loadAddCategoryListener() {
    document.getElementById('add-category-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/add_category', {
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
