import { Router } from "itty-router";

export interface Env {}

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Rayaan",
  },
  {
    id: 2,
    name: "Jack",
  },
];

const getId = (url: string): number | undefined => {
  const isValid = url.includes("?") && url.includes("=");
  if (!isValid) {
    return undefined;
  }
  return url.split("?")[1].split("=")[0] === "id"
    ? parseInt(url.split("?")[1].split("=")[1])
    : undefined;
};

const getUser = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};

const handleGetRoute = (request: Request) => {
  const id = getId(request.url);
  if (!id) {
    return new Response("No ID given");
  }
  const user = getUser(id);
  if (!user) {
    return new Response("Given ID is invalid");
  }
  const name = user.name ?? "name";
  return new Response(`Welcome ${name}`);
};

const router = Router();

router.get("/", handleGetRoute).all("*", () => new Response("Page not found"));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router
      .handle(request)
      .catch((err) => new Response("Something went wrong"));
  },
};
