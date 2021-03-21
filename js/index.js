"use strict";

const messageSystem = {
  startFetching() {},

  sendMessage(msg) {
    const message = {
      message: msg
    };

    fetch("https://thecrew.cc/api/message/create.php?token=" + userSystem.token, {
        method: 'POST',
        body: JSON.stringify(message)
      })
      .then(response => response.json)
      .then(data => {
        this.fetchMessages();
      });
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
  },

  fetchMessages() {
    fetch("https://thecrew.cc/api/message/read.php?token=" + userSystem.token, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        const messageWall = document.getElementById("output");
        messageWall.innerHTML = '';
        data.forEach(function (value, index) {
          const message = document.createElement("div");
          message.className = "message";
          if (value.handle == userSystem.handle) {
            message.classList.add("me");
          }
          message.innerHTML = `<span class="by">${value.handle} </span>
          <span class="on">${value.created_at} </span>
          <p>${value.message}</p>`;
          messageWall.appendChild(message);
        });

      });
    // https://thecrew.cc/api/message/read.php?token=__TOKEN__ GET
  }
};

const userSystem = {
  token: "",
  handle: "",
  email: "",
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  saveHandle() {
    localStorage.setItem("handle", this.handle);
  },

  saveEmail() {
    localStorage.setItem("email", this.email);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getHandle() {
    return localStorage.getItem("handle");
  },

  getEmail() {
    return localStorage.getItem("email");
  },

  checkLogin() {
    const token = this.getToken();
    const handle = this.getHandle();
    const email = this.getEmail();
    if (token != null) {
      this.token = token;
      this.handle = handle;
      this.email = email;
      display.removeLogin();
      messageSystem.fetchMessages();
    }

  },

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  },

  login(email, password) {

    const user = {
      "email": email,
      "password": password
    };

    fetch("https://thecrew.cc/api/user/login.php", {
        method: 'POST',
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => {
        if (data.token != undefined) {
          this.token = data.token;
          this.handle = data.handle;
          this.email = user.email;
          this.saveToken();
          this.saveHandle();
          this.saveEmail();
          display.removeLogin();
          messageSystem.fetchMessages();
        } else {
          alert("Wrong credentials!");
        }
      });

    // https://thecrew.cc/api/user/login.php POST
  },

  updateUser(password, handle,newPsw = password) {
    
    const user = {
      "email": this.email,
      "password": password
    };

    const changes = {
      "handle": handle,
      "password": newPsw
    };

    fetch("https://thecrew.cc/api/user/login.php", {
        method: 'POST',
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => data.token)
      .then(token => {
        if (token == userSystem.token) {
          fetch("https://thecrew.cc/api/user/update.php?token=" + this.token, {
            method: 'POST',
            body: JSON.stringify(changes)
          })
          .then(response => response.json())
          .then(data => console.log(data));
          this.handle = handle;
          this.saveHandle();
        }
      });
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
  }
};

const display = {
  initFields() {
    const formLogin = document.getElementById("loginForm");
    formLogin.addEventListener("submit", this.loginHandler);
    const formMessage = document.getElementById("messageForm");
    formMessage.addEventListener("submit", this.messageHandler);
    const logoutButton = document.getElementById("logoutBtn");
    logoutButton.addEventListener("click", this.logoutHandler);
    const changeUserBtn = document.getElementById("changeBtn");
    changeUserBtn.addEventListener("click", this.showUsernameWindow);
    const formUsername = document.getElementById("userChangeForm");
    formUsername.addEventListener("submit", this.changeUsername);
    const changePswBtn = document.getElementById("changePasBtn");
    changePswBtn.addEventListener("click", this.showPasswordWindow);
    const formPsw = document.getElementById("pswChangeForm");
    formPsw.addEventListener("submit", this.changePassword);

  },

  loginHandler(e) {
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    userSystem.login(email, password);
  },

  messageHandler(e) {
    e.preventDefault();
    const messageField = document.getElementById("messageField");
    const message = messageField.value;
    messageSystem.sendMessage(message);
    messageField.value = "";
  },

  logoutHandler(e) {
    userSystem.logout();
  },

  removeLogin() {
    document.getElementById("loginWindow").style.display = "none";
  },

  showUsernameWindow() {
    document.getElementById("userChangeWindow").style.display = "block";
  },

  changeUsername(e) {
    e.preventDefault();
    const userField = document.getElementById("newHandle");
    const newUsername = userField.value;
    const passwordField = document.getElementById("passwordChangeHandle");
    const password = passwordField.value;
    userSystem.updateUser(password, newUsername);
    userField.value = "";
    passwordField.value = "";
    document.getElementById("userChangeWindow").style.display = "none";
  },

  showPasswordWindow(){
    document.getElementById("pswChangeWindow").style.display = "block";
  },

  changePassword(e){
    e.preventDefault();
    const oldPswField = document.getElementById("oldPsw");
    const oldPsw = oldPswField.value;
    const newPswField = document.getElementById("newPsw");
    const newPsw = newPswField.value;
    userSystem.updateUser(oldPsw, userSystem.handle,newPsw);
    document.getElementById("pswChangeWindow").style.display = "none";
  }
};


display.initFields();
userSystem.checkLogin();
setInterval(function () {
  if (userSystem.getToken() != null) {
    messageSystem.fetchMessages();
  }
}, 2000);