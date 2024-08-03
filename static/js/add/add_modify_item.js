// static/js/add/add_modify_item.js
// rev 0.04

function loadModifyItemListeners() {
    const modifyItemForm = document.getElementById('modify-item-form');
    if (modifyItemForm) {
        modifyItemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(modifyItemForm);
            const categoryId = document.getElementById('modify-category').value;
            const subcategoryId = document.getElementById('modify-subcategory').value;
            const modifyItemSelect = document.getElementById('modify-item-select');

            fetch('/modify_item', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    modifyItemSelect.classList.add('bg-success');
                    setTimeout(() => {
                        modifyItemSelect.classList.remove('bg-success');
                    }, 1000);
                    document.getElementById('modify-category').value = categoryId;
                    document.getElementById('modify-subcategory').value = subcategoryId;
                    const selectedOption = modifyItemSelect.options[modifyItemSelect.selectedIndex];
                    selectedOption.text = formData.get('itemName');
                    const newCategory = document.getElementById('new-category');
                    const newSubcategory = document.getElementById('new-subcategory');
                    newCategory.value = '';
                    newSubcategory.value = '';
                }
            });
        });
    }
}
