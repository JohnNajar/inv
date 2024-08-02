// static/js/add/add_modify_item.js
// rev 0.03

function loadModifyItemListeners() {
    const modifyItemForm = document.getElementById('modify-item-form');
    modifyItemForm.addEventListener('submit', function (event) {
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
                    // Flash the item select dropdown in green
                    modifyItemSelect.classList.add('bg-success');
                    setTimeout(() => {
                        modifyItemSelect.classList.remove('bg-success');
                    }, 1000);

                    // Keep the category and subcategory selections the same
                    document.getElementById('modify-category').value = categoryId;
                    document.getElementById('modify-subcategory').value = subcategoryId;

                    // Update the item name in the select dropdown
                    const selectedOption = modifyItemSelect.options[modifyItemSelect.selectedIndex];
                    selectedOption.text = formData.get('itemName');

                    // Show the modification details without refreshing
                    const newCategory = document.getElementById('new-category');
                    const newSubcategory = document.getElementById('new-subcategory');
                    newCategory.value = '';
                    newSubcategory.value = '';
                }
            });
    });
}
