/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');
  const input = document.querySelector('#wsInput');
  const wsSent = document.querySelector('#wsSent');

  const showMessage = (message) => {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  };

  const onMessage = (data, flags) => {
    alert(data.data);
  };

  const handleResponse = (response) => {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  };

  login.onclick = () => {
    fetch('http://localhost:8080/login', { method: 'POST', credentials: 'same-origin', mode: 'no-cors' })
      .then(handleResponse)
      .then(showMessage)
      .catch((err) => showMessage(err.message));
  };

  logout.onclick = () => {
    fetch('http://localhost:8080/login', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch((err) => showMessage(err.message));
  };

  let ws;
  wsSent.onclick = () => {
    if (ws) {
      var content = input.value;
      ws.send(content);
    }else{
      alert('Not connect');
    }
  };
  wsButton.onclick = () => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    showMessage(`${location.host}`);
    // ws = new WebSocket(`ws://${location.host}`);
    ws = new WebSocket('ws://localhost:8080');
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => showMessage('WebSocket connection established');
    ws.onclose = () => showMessage('WebSocket connection closed');
    ws.onmessage = (event, flags) => onMessage(event, flags);
    // ws.on('message', function incoming(data, flags) {
    //   alert('nhan duoc data');
    //   alert(data);
    // });
    // ws.onmessage = function (event) {
    //     alert('nhan duoc data' + event.data);
    // };
  };
  
})();
