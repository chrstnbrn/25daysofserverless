<script>
  import CheckIcon from "./Icons/CheckIcon.svelte";
  import ErrorIcon from "./Icons/ErrorIcon.svelte";

  export let activeIncidents;
</script>

{#if activeIncidents > 0}
  <h3 class="text-4xl text-red-500 text-center text-medium">
    <ErrorIcon />
    {activeIncidents} active {activeIncidents === 1 ? 'incident' : 'incidents'}
  </h3>
{:else}
  <h3 class="text-4xl text-green-500 text-center text-medium">
    <CheckIcon />
    Everything is working
  </h3>
{/if}
