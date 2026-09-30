import "server-only";
import { cache } from "react";
import { getServer, listServers } from "./db";
export const fetchServer = cache(getServer);
export const fetchServers = listServers;
