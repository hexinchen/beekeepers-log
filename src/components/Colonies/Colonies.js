import React, { Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ColonyBlock from "./ColonyBlock";
import { Grid } from "@material-ui/core";
import _ from "lodash";

const GET_COLONIES = gql`
  query{
    colonies(order_by: {id: asc}){
      beeAmount
      hiveNumber
      id
      lastCollectionDate
    }
  }
`;

const Colonies = props => {
  const { colonies } = props;
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      > 
      {
        _.map(colonies, colony => {
          return <ColonyBlock colony={colony} />
        })
      }
      </Grid>
    </Fragment>
      );
    };
    
const ColoniesQuery = () => {
  const {loading, error, data } = useQuery(GET_COLONIES);  
  if (loading) {
    return <div>Loading...</div>;
    }
  if (error) {
        console.error(error);
      return <div>Error!</div>;
    }
  return <Colonies colonies={data.colonies} />;
    };
    export default ColoniesQuery;
export {GET_COLONIES};
      
