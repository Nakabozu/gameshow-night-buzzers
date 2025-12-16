<script>
  import { name, page, players, socket } from "$lib/store";
  let buzzed = false;

  const onSelectPlayer = (selectedPlayer) => {
    socket.emit("client_selects_player", selectedPlayer, () => {
      $name = selectedPlayer;
      $page = "buzzer";
    });
  };

  const onBack = () => {
    $name = "";
    $page = "names";
  };

  socket.on("connect", () => {
    console.log("YOU CONNECTED TO THE FRONTEND! :D");
  });

  socket.on("welcome", (initialPlayers) => {
    $players = initialPlayers;
  });

  socket.on("client_unbuzzes_all", () => {
    console.log("ALL UNBUZZED");
    buzzed = false;
  });

  socket.on("server_updates_players", (playerState) => {
    if (playerState?.length === undefined || playerState?.length <= 0) {
      $page === "names";
      return;
    }
    $players = playerState;
    console.log("Server updated players", playerState);
    if ($page !== "buzzer") return;
    const indexOfPlayer = playerState.findIndex((p) => p.name === $name);
    if (indexOfPlayer >= 0) {
      console.log("Your state was updated to: ", playerState[indexOfPlayer]);
      buzzed = playerState?.[indexOfPlayer]?.buzz > 0;
    } else {
      console.log(`\x1b[31mWhat the heck? You weren't in the list...\x1b[00m`);
    }
  });

  socket.on("server_clears_players", () => {
    console.log("GAME RESET!");
    $page = "names";
  });

  const onBuzz = () => {
    socket.emit("client_buzzes_in", $name, () => {
      buzzed = true;
    });
  };
</script>

<main>
  {#if $page === "names"}
    {#if $players?.length === undefined && $players?.length <= 0}
      <h1>Hold tight while things are set up</h1>
    {:else}
      <h1>Select Your Name</h1>
    {/if}
    {#each $players as player}
      {#if player?.socketId}
        <button class="btn-taken">
          {player?.name} is TAKEN
        </button>
      {:else}
        <button
          on:click={() => {
            onSelectPlayer(player?.name);
          }}
        >
          BECOME {player?.name}
        </button>
      {/if}
    {/each}
  {:else if $page === "buzzer"}
    <article>
      <h1>{$name}'s Buzzer</h1>
      <button on:click={onBuzz} class={buzzed ? "bzr-buzzed" : "bzr-ready"}>
        BUZZ
      </button>
    </article>
  {:else}
    <div>Wat... how'd you do this?</div>
  {/if}
</main>

<style>
  main {
    margin: 0px;
    padding: 0px;
    width: 100vw;
    height: 100vh;
    background: #110909;
    color: cornsilk;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
  h1 {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    padding: 0px;
    margin: 0px;
  }
  button {
    width: 50%;
    padding: 8px 0px;
    border: 2px solid cornsilk;
    background-color: #0a0a08;
    color: cornsilk;
    border-radius: 4px;
  }
  [class|="bzr"] {
    width: 80%;
    height: 80%;
    color: cornsilk;
  }
  .bzr-buzzed {
    background: red;
  }
  .bzr-ready {
    background: blue;
  }
  .btn-taken {
    background-color: red;
    color: white;
  }
</style>
