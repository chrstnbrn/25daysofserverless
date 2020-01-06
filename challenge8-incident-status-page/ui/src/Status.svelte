<script>
  import CheckIcon from "./Icons/CheckIcon.svelte";
  import ErrorIcon from "./Icons/ErrorIcon.svelte";

  export let activeIncidents;
</script>

<style>

</style>

<div>
  {#if activeIncidents > 0}
    <h3 class="text-2xl text-red-500 text-medium">
      <ErrorIcon />
      {activeIncidents} active {activeIncidents === 1 ? 'incident' : 'incidents'}
    </h3>
  {:else}
    <h3 class="text-2xl text-green-500 text-medium">
      <CheckIcon />
      Everything is working
    </h3>
  {/if}
</div>
