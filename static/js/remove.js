// static/js/remove.js
// rev 0.06

function loadRemoveListeners() {
    const removeLink = document.getElementById('remove-link');
    const removeDialog = document.getElementById('remove-dialog');
    const backButton = document.getElementById('back-button');
    const removeForm = document.getElementById('remove-form');
    const removeMenu = document.getElementById('remove-menu');
    const removeCategoryLink = document.getElementById('remove-category-link');
    const removeSubcategoryLink = document.getElementById('remove-subcategory-link');
    const removeItemLink = document.getElementById('remove-item-link');
    const removeCategorySection = document.getElementById('remove-category');
    const removeSubcategorySection = document.getElementById('remove-subcategory');
    const removeItemSection = document.getElementById('remove-item');
    const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
    const confirmDeleteButton = document.getElementById('confirm-delete-button');
    const cancelDeleteButton = document.getElementById('cancel-delete-button');
    const removeConfirmButton = document.getElementById('remove-confirm-button');
    let selectedSection;

    if (removeLink) {
        removeLink.addEventListener('click', () => {
            removeMenu.classList.remove('d-none');
            removeForm.classList.add('d-none');
            removeDialog.showModal();
        });
    }

    if (removeCategoryLink) {
        removeCategoryLink.addEventListener('click', () => {
            selectedSection = 'category';
            showRemoveSection(removeCategorySection);
        });
    }

    if (removeSubcategoryLink) {
        removeSubcategoryLink.addEventListener('click', () => {
            selectedSection = 'subcategory';
            showRemoveSection(removeSubcategorySection);
        });
    }

    if (removeItemLink) {
        removeItemLink.addEventListener('click', () => {
            selectedSection = 'item';
            showRemoveSection(removeItemSection);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            if (removeMenu.classList.contains('d-none')) {
                hideAllSections();
                removeForm.classList.add('d-none');
                removeMenu.classList.remove('d-none');
            } else {
                removeDialog.close();
            }
        });
    }

    if (removeConfirmButton) {
        removeConfirmButton.addEventListener('click', () => {
            confirmDeleteDialog.showModal();
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            const selectedValue = document.querySelector(`#remove-${selectedSection}-select`).value;
            fetch(`/remove_${selectedSection}/${selectedValue}`, {
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
                confirmDeleteDialog.close();
                updateDropdowns(selectedSection);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            confirmDeleteDialog.close();
        });
    }

    function showRemoveSection(section) {
        hideAllSections();
        removeMenu.classList.add('d-none');
        removeForm.classList.remove('d-none');
        section.classList.remove('d-none');
    }

    function hideAllSections() {
        removeCategorySection.classList.add('d-none');
        removeSubcategorySection.classList.add('d-none');
        removeItemSection.classList.add('d-none');
    }

    function updateDropdowns(type) {
        if (type === 'category') {
            fetchCategories();
        } else if (type === 'subcategory') {
            fetchSubcategories();
        } else if (type === 'item') {
            fetchItems();
        }
    }

    function fetchCategories() {
        fetch('/get_categories')
            .then(response => response.json())
            .then(data => {
                const categorySelect = document.getElementById('remove-category-select');
                categorySelect.innerHTML = '';
                data.forEach(category => {
                    if (category.name !== 'General') {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    }
                });
            });
    }

    function fetchSubcategories() {
        const categoryId = document.querySelector(`#remove-category-select`).value;
        fetch(`/get_subcategories/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                const subcategorySelect = document.getElementById('remove-subcategory-select');
                subcategorySelect.innerHTML = '';
                data.forEach(subcategory => {
                    if (subcategory[1] !== 'General') {
                        const option = document.createElement('option');
                        option.value = subcategory[0];
                        option.textContent = subcategory[1];
                        subcategorySelect.appendChild(option);
                    }
                });
            });
    }

    function fetchItems() {
        const subcategoryId = document.querySelector(`#remove-subcategory-select`).value;
        fetch(`/get_items/${subcategoryId}`)
            .then(response => response.json())
            .then(data => {
                const itemSelect = document.getElementById('remove-item-select');
                itemSelect.innerHTML = '';
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[0];
                    option.textContent = item[1];
                    itemSelect.appendChild(option);
                });
            });
    }
}
