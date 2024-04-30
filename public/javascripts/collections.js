const selectAllCheckbox = document.getElementById('selectAll');
    const selectRowCheckboxes = document.querySelectorAll('.selectRow');

    selectAllCheckbox.addEventListener('change', function() {
        selectRowCheckboxes.forEach(function(checkbox) {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });