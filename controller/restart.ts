import { serve, setQuit } from "../serve.ts";

export function restart(): Response {
  setTimeout(async () => {
    serve.close();
    console.debug(Deno.cwd());
    await Deno.run({ cmd: [`${Deno.cwd()}/serve`] }).status();
    Deno.exit(0);
  }, 5000);

  setQuit(true);
  console.debug('The system will restart');

  return new Response(
    JSON.stringify({
      success: true,
      message: "The system will quit in 5 seconds.",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
