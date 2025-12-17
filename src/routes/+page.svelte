<script>
    import { name, page, players, socket } from "$lib/store";
    let buzz = 0;

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
        buzz = 0;
    });

    socket.on("server_updates_players", (playerState) => {
        // Always do this
        $players = playerState;
        console.log("Server updated players", playerState);
        // Redirect to home page if the players were reset
        if (playerState?.length === undefined || playerState?.length <= 0) {
            $page = "names";
            return;
        }
        // If we're on the names page, we don't care
        if ($page !== "buzzer") return;
        // If we're on the buzzer page, we may need to update the user's buzzer
        const indexOfPlayer = playerState.findIndex((p) => p.name === $name);
        if (indexOfPlayer >= 0) {
            console.log(
                "Your state was updated to: ",
                playerState[indexOfPlayer],
            );
            buzz = playerState?.[indexOfPlayer]?.buzz;
        } else {
            console.log(
                `\x1b[31mWhat the heck? You weren't in the list...\x1b[00m`,
            );
        }
    });

    socket.on("server_clears_players", () => {
        console.log("GAME RESET!");
        $page = "names";
    });

    const onBuzz = () => {
        socket.emit("client_buzzes_in", $name, () => {
            console.log("\x1b[32mYou buzzed in!\x1b[00m");
        });
    };
</script>

<main>
    {#if $page === "names"}
        {#if $players?.length === undefined || $players?.length <= 0}
            <h1>Hold tight while things are set up</h1>
        {:else}
            <h1>Select Your Name</h1>
        {/if}
        <div class="players-container">
            {#each $players as player}
                {#if player?.socketId}
                    <button class="btn-taken">
                        Someone else is already {player?.name}
                    </button>
                {:else}
                    <button
                        style="cursor: pointer;"
                        on:click={() => {
                            onSelectPlayer(player?.name);
                        }}
                    >
                        I'm {player?.name}
                    </button>
                {/if}
            {/each}
        </div>
    {:else if $page === "buzzer"}
        <!-- 
        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
        //                                                      //
        //                     BUZZER PAGE                      //
        //                                                      //
        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
        -->
        <article>
            <h1>{$name}'s Buzzer</h1>
            <button
                on:click={onBuzz}
                class={buzz && buzz > 0 ? "bzr-buzzed" : "bzr-ready"}
            >
                {buzz && buzz > 0 ? `You're number ${buzz}` : "BUZZ IN!"}
            </button>
        </article>
    {:else}
        <div>Wat... how'd you do this?</div>
    {/if}
</main>

<style>
    * {
        text-wrap: balance;
    }
    main {
        /* Sizing */
        margin: 0px;
        padding: 0px;
        width: 100vw;
        height: 100vh;
        gap: 20px;
        /* Layout */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    h1 {
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        font-size: min(100px, 10vw);
        padding: 0px;
        margin: 20px 0px 0px 0px;
        width: 100%;
        text-align: center;
    }
    button {
        width: 50%;
        min-width: 250px;
        padding: 8px 0px;
        border: 2px solid cornsilk;
        background-color: #1a1a18;
        color: cornsilk;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: min(6vw, 40px);
    }
    article {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .players-container {
        width: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 20px;
        align-items: center;
        justify-content: flex-start;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 20px 0px;
    }

    [class|="bzr"] {
        color: cornsilk;
        border-radius: 100%;
        width: min(50vh, 50vw);
        height: min(50vh, 50vw);
        min-width: min(50vh, 50vw);
        min-height: min(50vh, 50vw);
        margin-top: 50px;
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
        cursor: not-allowed;
    }
</style>
