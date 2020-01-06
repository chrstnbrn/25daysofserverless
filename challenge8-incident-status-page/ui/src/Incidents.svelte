<script>
  import Incident from "./Incident.svelte";

  export let incidents;
</script>

<ol>
  {#each incidents as incident (incident.id)}
    <li class="my-4">
      <Incident {incident} />
    </li>
  {/each}
</ol>
