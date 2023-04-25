import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.184.0/http/server.ts";
import { format } from "https://deno.land/std@0.184.0/datetime/format.ts";
import { deploy } from "./controller/deploy.ts";
import { restart } from "./controller/restart.ts";

serve(handler, { port: 8999 });
// const decoder = new TextDecoder();

// for await (const req of server) {
//   // Check if the request is for the /api/deploy endpoint
//   if (req.url === "/api/deploy" && req.method === "POST") {
//     try {
//       // Read the request body as a string and parse the JSON payload
//       const body = decoder.decode(await Deno.readAll(req.body));
//       const { url, version } = JSON.parse(body);

//       // Run a Docker command to pull the specified image
//       const pullProcess = Deno.run({
//         cmd: ["docker", "pull", `${url}:${version}`],
//       });
//       defer(() => pullProcess.close()); // ensure process is properly closed
//       await pullProcess.status();

//       // Run a Docker command to create a new container
//       const createProcess = Deno.run({
//         cmd: [
//           "docker",
//           "create",
//           "--name",
//           "my-container",
//           `${url}:${version}`,
//         ],
//       });
//       defer(() => createProcess.close()); // ensure process is properly closed
//       await createProcess.status();

//       // Run a Docker command to start the container
//       const startProcess = Deno.run({
//         cmd: ["docker", "start", "my-container"],
//       });
//       defer(() => startProcess.close()); // ensure process is properly closed
//       await startProcess.status();

//       // Run a Docker command to remove old images
//       const cleanProcess = Deno.run({
//         cmd: ["docker", "image", "prune", "-a", "-f"],
//       });
//       defer(() => cleanProcess.close()); // ensure process is properly closed
//       await cleanProcess.status();

//       // Send a response back to the client
//       req.respond({ body: "OK" });
//     } catch (error) {
//       console.error(error);
//       req.respond({ status: 500, body: "Internal server error" });
//     }
//   } else if (req.url === "/api/restart" && req.method === "POST") {
//     req.respond({ body: "Restarting..." });
//     Deno.exit(); // Exit the current process
//     await run(["deno", "run", "--allow-net", "app.ts", "restart"]); // Start a new process
//   } else {
//     req.respond({ status: 404, body: "Not found" });
//   }
// }

const routes: Record<string, Handler> = {
  "/api/host/deploy": deploy,
  "/api/host/restart": restart,
};

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

  return await routes[urlObj.pathname](req, conn);
}
