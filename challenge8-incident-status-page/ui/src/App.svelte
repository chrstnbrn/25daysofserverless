<script>
  import { onMount } from "svelte";
  import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

  import Tailwindcss from "./Tailwindcss.svelte";
  import IncidentStatusPage from "./IncidentStatusPage.svelte";

  const apiBaseUrl = "http://localhost:7071/api";

  let incidentsPromise;

  onMount(() => {
    incidentsPromise = getIncidents();
    configureSignalR();
  });

  async function getIncidents() {
    return await fetch(`${apiBaseUrl}/incidents`).then(res => res.json());
  }

  async function configureSignalR() {
    try {
      const connection = await getConnection();

      connection.on(
        "newIncident",
        incident => (incidents = [incident, ...incidents])
      );

      connection.on("updatedIncident", incident => {
        incidents = incidents.map(i => (i.id === incident.id ? incident : i));
      });

      connection.onclose(() => console.log("disconnected"));

      console.log("connecting...");
      await connection.start();
      console.log("connected!");
    } catch (error) {
      console.error(error);
    }
  }

  async function getConnection() {
    const connectionInfo = await fetch(`${apiBaseUrl}/SignalRInfo`).then(res =>
      res.json()
    );

    const options = {
      accessTokenFactory: () => connectionInfo.accessToken
    };

    return new HubConnectionBuilder()
      .withUrl(connectionInfo.url, options)
      .configureLogging(LogLevel.Information)
      .build();
  }
</script>

<Tailwindcss />

<header class="container text-center p-4 mx-auto">
  <h1 class="text-4xl text-gray-800">Incident Status Page</h1>
  <h2 class="text-2xl text-gray-600 font-light">
    Santa's Reindeer Guidance & Delivery System
  </h2>
</header>
<main class="container pt-12 p-4 mx-auto">
  {#await incidentsPromise}
    <p class="text-center">Loading...</p>
  {:then incidents}
    <IncidentStatusPage {incidents} />
  {:catch error}
    <p class="text-center">Error loading incident status</p>
  {/await}
</main>
