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
        const messageWall = document.getElementById("output");
        messageWall.innerHTML = '';
        data.forEach(function (value, index) {
          const message = document.createElement("div");
          message.className = "message";
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
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  checkLogin() {
    const token = this.getToken();
    if (token != null) {
      this.token = token;
      display.removeLogin();
      messageSystem.fetchMessages();
    }

  },

  logout() {
    localStorage.removeItem("token");
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
        this.token = data.token;
        this.saveToken();
        display.removeLogin();
        messageSystem.fetchMessages();
      });

    // https://thecrew.cc/api/user/login.php POST
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
  }
};

const display = {
  initFields() {
    const formLogin = document.getElementById("loginForm");
    formLogin.addEventListener("submit", this.loginHandler);
    const formMessage = document.getElementById("messageForm");
    formMessage.addEventListener("submit", this.messageHandler);
  },

  loginHandler(e) {
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    userSystem.login(email, password);
  },

  messageHandler(e) {
    e.preventDefault();
    const message = document.getElementById("messageField").value;
    messageSystem.sendMessage(message);
  },

  removeLogin() {
    document.getElementById("loginWindow").style.display = "none";
  }
};


display.initFields();
userSystem.checkLogin();