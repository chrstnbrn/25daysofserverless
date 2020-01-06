<script>
  export let incident;
</script>

<section
  class="rounded p-6 border-4 {incident.status === 'closed' ? 'bg-gray-200 border-gray-400' : 'bg-red-100 border-red-400'}">
  <p class="text-sm text-gray-600 font-light mb-2">
    {new Date(incident.createdDate).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    })}
  </p>
  <h1 class="flex items-center text-xl font-medium mb-2">
    {incident.name}
    <span
      class="ml-4 px-2 py-1 text-sm text-white rounded uppercase"
      class:bg-red-500={incident.status === 'open'}
      class:bg-orange-500={incident.status === 'ongoing'}
      class:bg-gray-500={incident.status === 'closed'}>
      {incident.status}
    </span>
  </h1>

  <p>{incident.description}</p>
</section>
