import { readAll } from "https://deno.land/std@0.184.0/streams/read_all.ts";
export async function deploy(req: Request): Promise<Response> {
  const body = await req.json();

  const subProcess = Deno.run({ cmd: [] })

  await subProcess.status()

  const res = { success: true };
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
