import { html, render } from "lit-html";

const styles = `
  ul { padding: 0; }
`;
const template = (ctx) => html`
  <style>
    ${styles}
  </style>
  <div>Process Data</div>
  <input
    type="text"
    @keyup=${ctx.inputKeyupHandler}
    .value=${ctx.pidInputValue}
  />
  <button @click=${ctx.startPolling}>Start Polling</button>
  <button @click=${ctx.stopPolling}>Stop Polling</button>
  <ul>
    ${!!ctx.fileData.length
      ? ctx.fileData.map((data) => html`<li>${data}</li>`)
      : "No data"}
  </ul>
`;

export class FileData extends HTMLElement {
  static selector = "fjs-file-data";

  pidInputValue = "";
  fileData = [];

  socket = null;
  pollingInterval = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
    this.openFileDataSocket();

    this.render();
  }

  openFileDataSocket() {
    this.socket = io("http://localhost:8082");

    console.log(this.socket);

    this.socket.on("message", (msg) => this.handleMessage(msg));
  }

  handleMessage(msg) {
    this.fileData.push(msg);
    this.render();
  }
  clearMessages() {
    this.fileData = [];
    this.render();
  }

  inputKeyupHandler = (event) => {
    const target = event.target;
    this.pidInputValue = target.value;
  };

  // startPolling = () => {
  //   console.log("start polling");
  //   console.log(this.pidInputValue);
  //   this.pollingInterval = setInterval(async () => {
  //     const processList = await psList();
  //     const process = processList.find(p => p.pid === Number(this.pidInputValue));
  //     if (process) {
  //       this.socket.emit('message', `CPU: ${process.cpu}, Memory: ${process.memory}`);
  //     }
  //   }, 1000);
  // };

  // stopPolling = () => {
  //   console.log("stop polling");
  //   clearInterval(this.pollingInterval);
  // };


  startPolling = () => {
    console.log("start polling");
    console.log(this.pidInputValue);
    // Start polling logic here
    this.socket.emit("start-polling", this.pidInputValue);
  };

  stopPolling = () => {
    console.log("stop polling");
    // Stop polling logic here
    this.socket.emit("stop-polling");
  };

  render() {
    render(template(this), this.shadowRoot);
  }
}

customElements.define(FileData.selector, FileData)