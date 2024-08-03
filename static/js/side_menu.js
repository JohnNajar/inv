// rev 0.02

function loadSideMenuListeners() {
    const sections = {
        'add-category': document.getElementById('add-category'),
        'add-subcategory': document.getElementById('add-subcategory'),
        'add-single-item': document.getElementById('add-single-item'),
        'add-multiple-items': document.getElementById('add-multiple-items'),
        'modify-item': document.getElementById('modify-item'),
        'remove': document.getElementById('remove')  // Add the remove section
    };

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const targetId = item.id.split('-link')[0];
            if (sections[targetId]) {  // Check if the section exists
                for (const key in sections) {
                    if (sections[key]) {  // Check if the section exists before accessing its classList
                        sections[key].classList.add('d-none');
                    }
                }
                sections[targetId].classList.remove('d-none');
            }
        });
    });
}
