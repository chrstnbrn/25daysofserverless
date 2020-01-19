<script>
  import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

  import Tailwindcss from "./Tailwindcss.svelte";
  import ChatRoom from "./ChatRoom.svelte";
  import Login from "./Login.svelte";

  const apiBaseUrl = "http://localhost:7071/api";
  const functionsKey = "";

  let messages = [];
  let username;

  function onLogin({ detail }) {
    username = detail.username;
    configureSignalR();
  }

  function onSendMessage({ detail: messageText }) {
    const newMessage = { sender: username, text: messageText };
    postMessage(newMessage);
  }

  async function configureSignalR() {
    try {
      const connection = await getConnection();

      connection.on(
        "newMessage",
        message => (messages = [...messages, message])
      );

      connection.onclose(() => console.log("disconnected"));

      console.log("connecting...");
      await connection.start();
      console.log("connected!");
    } catch (error) {
      console.error(error);
    }
  }

  async function getConnection() {
    const connectionInfo = await fetchFromApi("SignalRInfo");

    const options = {
      accessTokenFactory: () => connectionInfo.accessToken
    };

    return new HubConnectionBuilder()
      .withUrl(connectionInfo.url, options)
      .configureLogging(LogLevel.Information)
      .build();
  }

  async function postMessage(message) {
    const url = getApiUrl("messages");
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
  }

  async function fetchFromApi(path) {
    const url = getApiUrl(path);
    return fetch(url).then(res => res.json());
  }

  function getApiUrl(path) {
    return `${apiBaseUrl}/${path}?code=${functionsKey}`;
  }
</script>

<Tailwindcss />

<header class="container text-center p-4 mx-auto">
  <h1 class="text-4xl text-gray-800">Chat room</h1>
</header>
<main class="flex-1 container pb-8 px-4 mx-auto">
  {#if username}
    <ChatRoom {messages} {username} on:sendMessage={onSendMessage} />
  {:else}
    <Login on:login={onLogin} />
  {/if}
</main>
