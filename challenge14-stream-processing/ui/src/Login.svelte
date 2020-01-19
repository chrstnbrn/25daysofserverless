<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleSubmit = event => {
    const username = event.target.username.value;
    dispatch("login", { username });
  };
</script>

<form on:submit|preventDefault={handleSubmit} class="flex justify-center pt-12">
  <label>
    Username
    <input
      type="text"
      id="username"
      class="bg-white focus:outline-none focus:shadow-outline border
      border-gray-400 rounded-lg ml-2 mr-4 py-2 px-4 appearance-none
      leading-normal"
      required />
  </label>
  <button
    type="submit"
    class="bg-blue-600 text-white focus:outline-none focus:shadow-outline
    rounded-lg py-2 px-4">
    Login
  </button>
</form>
