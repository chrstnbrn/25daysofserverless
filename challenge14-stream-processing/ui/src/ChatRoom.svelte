<script>
  import { createEventDispatcher } from "svelte";

  export let messages;
  export let username;

  const dispatch = createEventDispatcher();

  const handleSubmit = event => {
    const message = event.target.message.value;
    dispatch("sendMessage", message);

    event.target.reset();
  };
</script>

<div class="flex flex-col h-full">
  <ol class="flex-auto overflow-y-auto h-1 px-4">
    {#each messages as message}
      <li
        class="flex flex-col my-2"
        class:items-end={message.sender === username}>
        <span class="text-sm font-bold my-1 px-4">{message.sender}</span>
        <span
          class="inline px-4 py-2 rounded max-w-3xl break-words {message.sender === username ? 'bg-blue-200' : 'bg-gray-200'}">
          {message.text}
        </span>
      </li>
    {/each}
  </ol>
  <form class="flex mt-4" on:submit|preventDefault={handleSubmit}>
    <input
      type="text"
      id="message"
      placeholder="Send a message"
      class="bg-white focus:outline-none focus:shadow-outline border
      border-gray-400 rounded-lg mr-2 py-2 px-4 appearance-none leading-normal
      flex-1"
      required />
    <button
      type="submit"
      class="bg-blue-600 text-white focus:outline-none focus:shadow-outline
      rounded-lg py-2 px-4">
      Send
    </button>
  </form>
</div>
