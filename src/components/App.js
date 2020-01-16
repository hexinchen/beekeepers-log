import React from "react";
import Header from "./Header";
import ColoniesWrapper from "./Colonies/ColoniesWrapper";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";
import { useAuth0 } from "./Auth/react-auth0-spa";

const createApolloClient = authToken => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: "wss://beekeepers-logg.herokuapp.com/v1/graphql",
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
          }
        }
      }
    }),
    cache: new InMemoryCache()
  });
};

const App = ({ idToken }) => {
  const { loading, logout } = useAuth0();
  if (loading || !idToken) {
    return <div>Loading...</div>;
  }
  const client = createApolloClient(idToken);
  console.log(client);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        <div className="row container-fluid p-left-right-0 m-left-right-0">
          <div className="row p-left-right-0 m-left-right-0">
            <div className="sliderMenu p-30">
              <ColoniesWrapper />
            </div>     
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
