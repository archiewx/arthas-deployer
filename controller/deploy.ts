export async function deploy(req: Request): Promise<Response> {
  const body = await req.json();
  const { repository, push_data } = body;

  // docker-compose pull registry
  // docker-compose up -d

  await Deno.run({
    cmd: [
      "docker",
      "pull",
      `registry.${repository.region}.aliyuncs.com/${repository.namespace}/${repository.name}:${push_data.tag}`,
    ],
  }).status();

  await Deno.run({
    cmd: [
      "docker",
      "tag",
      `registry.${repository.region}.aliyuncs.com/${repository.namespace}/${repository.name}:${push_data.tag}`,
      `${repository.name}:latest`,
    ],
  }).status();

  await Deno.run({
    cmd: ["docker", ""],
  }).status();

  await Deno.run({
    cmd: ["docker-compose", "up", "-d", `${repository.name}`],
  }).status();

  const res = { success: true };
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
