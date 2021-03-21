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
        console.log(data);
        const messageWall = document.getElementById("output");
        messageWall.innerHTML = '';
        data.forEach(function (value, index) {
          const message = document.createElement("div");
          message.className = "message";
          if(value.handle == userSystem.handle){
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
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  saveHandle(){
    localStorage.setItem("handle", this.handle);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getHandle(){
    return localStorage.getItem("handle");
  },

  checkLogin() {
    const token = this.getToken();
    const handle = this.getHandle();
    console.log(token);
    if (token != null) {
      this.token = token;
      this.handle = handle;
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
        if(data.token != undefined){
          this.token = data.token;
          this.handle = data.handle;
          this.saveToken();
          this.saveHandle();
          display.removeLogin();
          messageSystem.fetchMessages();
        } else {
          alert("Wrong credentials!");
        }
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
    const logoutButton = document.getElementById("logoutBtn");
    logoutButton.addEventListener("click", this.logoutHandler);
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

  logoutHandler(e) {
    userSystem.logout();
  },

  removeLogin() {
    document.getElementById("loginWindow").style.display = "none";
  }
};


display.initFields();
userSystem.checkLogin();