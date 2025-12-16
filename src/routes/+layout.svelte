<script>
  import favicon from "$lib/assets/favicon.svg";
  import { socket } from "$lib/store";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
