// rev 0.01

function loadSideMenuListeners() {
    const sections = {
        'add-category': document.getElementById('add-category'),
        'add-subcategory': document.getElementById('add-subcategory'),
        'add-single-item': document.getElementById('add-single-item'),
        'add-multiple-items': document.getElementById('add-multiple-items'),
        'modify-item': document.getElementById('modify-item')
    };

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const targetId = item.id.split('-link')[0];
            for (const key in sections) {
                sections[key].classList.add('d-none');
            }
            sections[targetId].classList.remove('d-none');
        });
    });
}
