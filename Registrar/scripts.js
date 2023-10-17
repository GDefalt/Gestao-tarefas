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
    const registerForm = document.getElementById('enviar');
    registerForm.addEventListener('click', function (event) {
        event.preventDefault();
        const username = document.getElementById('logar').value;
        const password = document.getElementById('passw').value;

        // Verifica se os campos foram preenchidos
        if (!username || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Verifica se o nome de usuário já existe no localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            alert('Nome de usuário já existe. Escolha outro.');
            return;
        }

        // Registra o usuário no localStorage
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registro bem-sucedido. Você pode fazer login agora.');
        window.location.href = '../Logar/index.html';
    });
});
