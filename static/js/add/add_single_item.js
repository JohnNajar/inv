// rev 0.01
function loadAddSingleItemListener() {
    document.getElementById('add-single-item-form').addEventListener('submit', function(event) {
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

