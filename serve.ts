import {
  ConnInfo,
  Handler,
  Server,
} from "https://deno.land/std@0.184.0/http/server.ts";
import { format } from "https://deno.land/std@0.184.0/datetime/format.ts";
import { deploy } from "./controller/deploy.ts";
import { restart } from "./controller/restart.ts";

export const serve = new Server({ port: 8099, handler });

const routes: Record<string, Handler> = {
  "/api/host/deploy": deploy,
  "/api/host/restart": restart,
};

let quit = false;

export function setQuit(flag: boolean) {
  quit = flag;
}

async function handler(req: Request, conn: ConnInfo): Promise<Response> {
  const urlObj = new URL(req.url);

  if (!routes[urlObj.pathname]) {
    const heath = {
      time: format(new Date(), "yyyy-MM-dd HH:mm"),
      message: "welcome",
      success: true,
    };
    return new Response(JSON.stringify(heath), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (quit) throw new Deno.errors.Http("The system will quit.");

  return await routes[urlObj.pathname](req, conn);
}

console.debug("service running :8099");
console.debug("service running nice!!!");
serve.listenAndServe();
