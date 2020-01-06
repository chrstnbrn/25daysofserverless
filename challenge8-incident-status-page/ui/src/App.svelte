<script>
  import Tailwindcss from "./Tailwindcss.svelte";
  import Status from "./Status.svelte";
  import ActiveIncidents from "./ActiveIncidents.svelte";
  import ResolvedIncidents from "./ResolvedIncidents.svelte";

  const activeIncidents = 2;
</script>

<style>

</style>

<Tailwindcss />

<header class="text-center p-4 mx-auto">
  <h1 class="text-5xl text-gray-800">Incident Status Page</h1>
  <h2 class="text-3xl text-gray-600 font-light">
    Santa's Reindeer Guidance & Delivery System
  </h2>
</header>
<main class="text-center p-4 mx-auto">
  <section class="mb-3">
    <Status {activeIncidents} />
  </section>
  <section class="mb-3">
    <ActiveIncidents />
  </section>
  <section>
    <ResolvedIncidents />
  </section>
</main>
