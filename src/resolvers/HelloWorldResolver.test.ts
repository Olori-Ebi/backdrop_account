import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { gql } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloWorldResolver } from "./HelloWorldResolver";

describe("HelloWorldResolver", () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({
      resolvers: [HelloWorldResolver],
    });

    server = new ApolloServer({ schema });
  });

  it("returns hello message", async () => {
    const query = gql`
      query {
        hello
      }
    `;

    const response = await server.executeOperation({ query });

    expect(response.data).toEqual({ hello: "hi!" });
  });
});
