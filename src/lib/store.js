import { writable } from "svelte/store";
import { io } from "socket.io-client";
import { PUBLIC_SOCKET_PORT, PUBLIC_SOCKET_SERVER } from "$env/static/public";

/* ****************************************************************** *
 * WEBSOCKET USED BY BACKEND TO LISTEN FOR CHANGES TO USER'S EMOTIONS *
 * ****************************************************************** */
export const socket = io(`${PUBLIC_SOCKET_SERVER}${PUBLIC_SOCKET_PORT}`);

// #region CONSTANTS
export const bT = "\x1b[30m";
export const rT = "\x1b[31m";
export const gT = "\x1b[32m";
export const yT = "\x1b[33m";
export const buT = "\x1b[34m";
export const mT = "\x1b[35m";
export const cT = "\x1b[36m";
export const wT = "\x1b[37m";
export const bB = "\x1b[40m";
export const rB = "\x1b[41m";
export const gB = "\x1b[42m";
export const yB = "\x1b[43m";
export const buB = "\x1b[44m";
export const mB = "\x1b[45m";
export const cB = "\x1b[46m";
export const wB = "\x1b[47m";
export const ansiR = "\x1b[00m";

/** @type {{name: string, buzz: number, isClaimed: boolean }[]} */
export const players = writable([]);
/**
 * @type {import("svelte/store").Writable<'gameid' | 'names' | 'buzzer'>}
 *
 * The page that's open.
 *
 * - `jeopardy` shows the Jeopardy board.
 * - `question` shows the a question from the board
 * - `answer` shows the answer to the question
 */
export const page = writable("gameid");
/** @type {import("svelte/store").Writable<string>} */
export const name = writable("");
