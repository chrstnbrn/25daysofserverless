<script>
  import { onMount } from "svelte";

  import Tailwindcss from "./Tailwindcss.svelte";
  import Status from "./Status.svelte";
  import Incidents from "./Incidents.svelte";

  let activeIncidents = [];
  let resolvedIncidents = [];

  onMount(async () => {
    const incidents = await fetch("http://localhost:7071/api/incidents").then(
      res => res.json()
    );
    activeIncidents = incidents.filter(i => i.status !== "closed");
    resolvedIncidents = incidents.filter(i => i.status === "closed");
  });
</script>

<Tailwindcss />

<header class="container text-center p-4 mx-auto">
  <h1 class="text-4xl text-gray-800">Incident Status Page</h1>
  <h2 class="text-2xl text-gray-600 font-light">
    Santa's Reindeer Guidance & Delivery System
  </h2>
</header>
<main class="container pt-12 p-4 mx-auto">
  <div class="mb-16">
    <Status activeIncidents={activeIncidents.length} />
  </div>
  <div class="mb-16">
    <Incidents incidents={activeIncidents} />
  </div>
  <div class="mb-16">
    <h3 class="text-2xl font-light mb-4">Incident History</h3>
    <Incidents incidents={resolvedIncidents} />
  </div>
</main>
