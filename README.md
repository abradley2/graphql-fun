The process of adding a Todo is sending a graphql request to the server, and the
server persists it to Redis.

To keep all the clients in sync, the server then pipes the graphql request back
to via websocket to each client apart from the one that sent it initially.

The server resolvers add it to Redis, the client resolvers add it to Redux.

I've been looking for a very nice pattern to keep a multi-client application in
sync in an organized way. I didn't like directly piping redux actions and diff
because that doesn't really give the client the ability to correct when things
are wrong.

What if your client goes alone but you still want them to make edits and
then try to get the server caught up when it reconnects.

Then when the client is disconnected we simply tell it to apply the
mutations to itself, and it already has a mechanism for that anyway
