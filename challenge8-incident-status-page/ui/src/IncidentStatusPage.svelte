<script>
  import Status from "./Status.svelte";
  import Incidents from "./Incidents.svelte";

  export let incidents = [];

  $: activeIncidents = incidents.filter(i => i.status !== "closed");
  $: resolvedIncidents = incidents.filter(i => i.status === "closed");
</script>

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
