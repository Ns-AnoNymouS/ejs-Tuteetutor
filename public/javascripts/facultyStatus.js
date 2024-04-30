document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener("click", (event) => {
        var id = event.target.dataset.id;
        fetch(`/facultyStatus/${id}`, { method: 'DELETE' }).then((response) => {
            location.reload();
        });
    });
})