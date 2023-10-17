function mostrarSenha() {
    let inputPass = document.getElementById("passw")
    let btnShowPass = document.getElementById("btn-eye")
  
    if (inputPass.type === "password") {
      inputPass.setAttribute("type", "text")
      btnShowPass.classList.replace("bi-eye-fill", "bi-eye-slash-fill")
    } else {
      inputPass.setAttribute("type", "password")
      btnShowPass.classList.replace("bi-eye-slash-fill", "bi-eye-fill")
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('enviar');
    loginForm.addEventListener('click', function (event) {
        event.preventDefault();
        const username = document.getElementById('logar').value;
        const password = document.getElementById('passw').value;

        // Verifique se os campos foram preenchidos
        if (!username || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verifique se as credenciais correspondem às armazenadas no localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username] === password) {
            alert('Login bem-sucedido.');
            localStorage.setItem('loggedInUser', username);
            window.location.href = '../Tarefas/user.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    });
});
