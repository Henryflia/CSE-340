const form = document.querySelector("#updateForm");

form.addEventListener("change", function () {
  const updateBtn = form.querySelector("input[type='submit']");
  if (updateBtn) {
    updateBtn.removeAttribute("disabled");
  }
});