// rev 0.01
function loadCategorySelectionListeners() {
    const singleItemCategory = document.getElementById('single-item-category');
    if (singleItemCategory) {
        singleItemCategory.addEventListener('change', (event) => {
            const categoryId = event.target.value;
            const subcategoryContainer = document.getElementById('single-item-subcategory-container');
            const subcategorySelect = document.getElementById('single-item-subcategory');
            subcategoryContainer.classList.add('d-none');
            subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';

            if (categoryId) {
                fetch(`/get_subcategories/${categoryId}`)
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(subcategory => {
                            const option = document.createElement('option');
                            option.value = subcategory[0];
                            option.textContent = subcategory[1];
                            subcategorySelect.appendChild(option);
                        });
                        subcategoryContainer.classList.remove('d-none');
                    });
            }
        });
    }

    const multipleItemCategory = document.getElementById('multiple-item-category');
    if (multipleItemCategory) {
        multipleItemCategory.addEventListener('change', (event) => {
            const categoryId = event.target.value;
            const subcategoryContainer = document.getElementById('multiple-item-subcategory-container');
            const subcategorySelect = document.getElementById('multiple-item-subcategory');
            subcategoryContainer.classList.add('d-none');
            subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';

            if (categoryId) {
                fetch(`/get_subcategories/${categoryId}`)
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(subcategory => {
                            const option = document.createElement('option');
                            option.value = subcategory[0];
                            option.textContent = subcategory[1];
                            subcategorySelect.appendChild(option);
                        });
                        subcategoryContainer.classList.remove('d-none');
                    });
            }
        });
    }

    const modifyCategory = document.getElementById('modify-category');
    if (modifyCategory) {
        modifyCategory.addEventListener('change', (event) => {
            const categoryId = event.target.value;
            const subcategoryContainer = document.getElementById('subcategory-container');
            const itemContainer = document.getElementById('item-container');
            const modifyDetails = document.getElementById('modify-details');
            const updateButton = document.getElementById('update-button');

            subcategoryContainer.classList.add('d-none');
            itemContainer.classList.add('d-none');
            modifyDetails.classList.add('d-none');
            updateButton.classList.add('d-none');

            if (categoryId) {
                fetch(`/get_subcategories/${categoryId}`)
                    .then(response => response.json())
                    .then(data => {
                        const subcategorySelect = document.getElementById('modify-subcategory');
                        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                        data.forEach(subcategory => {
                            const option = document.createElement('option');
                            option.value = subcategory[0];
                            option.textContent = subcategory[1];
                            subcategorySelect.appendChild(option);
                        });
                        subcategoryContainer.classList.remove('d-none');
                    });
            }
        });
    }

    const modifySubcategory = document.getElementById('modify-subcategory');
    if (modifySubcategory) {
        modifySubcategory.addEventListener('change', (event) => {
            const subcategoryId = event.target.value;
            const itemContainer = document.getElementById('item-container');
            const modifyDetails = document.getElementById('modify-details');
            const updateButton = document.getElementById('update-button');

            itemContainer.classList.add('d-none');
            modifyDetails.classList.add('d-none');
            updateButton.classList.add('d-none');

            if (subcategoryId) {
                fetch(`/get_items/${subcategoryId}`)
                    .then(response => response.json())
                    .then(data => {
                        const itemSelect = document.getElementById('modify-item-select');
                        itemSelect.innerHTML = '<option value="">Select Item</option>';
                        data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item[0];
                            option.textContent = item[1];
                            itemSelect.appendChild(option);
                        });
                        itemContainer.classList.remove('d-none');
                    });
            }
        });
    }

    const modifyItemSelect = document.getElementById('modify-item-select');
    if (modifyItemSelect) {
        modifyItemSelect.addEventListener('change', (event) => {
            const itemId = event.target.value;
            const modifyDetails = document.getElementById('modify-details');
            const updateButton = document.getElementById('update-button');

            if (itemId) {
                modifyDetails.classList.remove('d-none');
                updateButton.classList.remove('d-none');
            } else {
                modifyDetails.classList.add('d-none');
                updateButton.classList.add('d-none');
            }
        });
    }

    const newCategory = document.getElementById('new-category');
    if (newCategory) {
        newCategory.addEventListener('change', (event) => {
            const newCategoryId = event.target.value;
            if (newCategoryId) {
                fetch(`/get_subcategories/${newCategoryId}`)
                    .then(response => response.json())
                    .then(data => {
                        const newSubcategorySelect = document.getElementById('new-subcategory');
                        newSubcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                        data.forEach(subcategory => {
                            const option = document.createElement('option');
                            option.value = subcategory[0];
                            option.textContent = subcategory[1];
                            newSubcategorySelect.appendChild(option);
                        });
                    });
            }
        });
    }
}

