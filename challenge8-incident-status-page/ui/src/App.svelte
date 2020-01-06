<script>
  import { onMount } from "svelte";
  import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

  import Tailwindcss from "./Tailwindcss.svelte";
  import IncidentStatusPage from "./IncidentStatusPage.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  const apiBaseUrl = "http://localhost:7071/api";
  const functionsKey = "";

  let incidents;
  let incidentsLoading = true;
  let incidentsLoadingError = false;

  onMount(async () => {
    try {
      incidents = await getIncidents();
    } catch (error) {
      console.error(error);
      incidentsLoadingError = true;
    } finally {
      incidentsLoading = false;
    }

    configureSignalR();
  });

  async function getIncidents() {
    return await fetchFromApi("incidents");
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
    const connectionInfo = await fetchFromApi("SignalRInfo");

    const options = {
      accessTokenFactory: () => connectionInfo.accessToken
    };

    return new HubConnectionBuilder()
      .withUrl(connectionInfo.url, options)
      .configureLogging(LogLevel.Information)
      .build();
  }

  async function fetchFromApi(path) {
    const url = `${apiBaseUrl}/${path}?code=${functionsKey}`;
    return fetch(url).then(res => res.json());
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
  {#if incidentsLoading}
    <p class="text-center">
      <LoadingSpinner />
    </p>
  {:else if incidentsLoadingError}
    <p class="text-center">Error loading incident status</p>
  {:else}
    <IncidentStatusPage {incidents} />
  {/if}
</main>
