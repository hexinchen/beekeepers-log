import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import _ from "lodash";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import InvertColorsIcon from '@material-ui/icons/InvertColors';

const GET_RECENT_COLLECTIONS = gql`
    query ($colonyId: Int!) {
      collections(where: { colonyId: { _eq: $colonyId } }, order_by: {collectionDate: desc}, limit: 3) {
        id
        collectionDate
        gram
        colonyId
      }
    }
  `;

const Collections = props => {
    const { collections } = props;
    return (
        _.isEmpty(collections) ? <span>There is no collection.</span>
            :
            <List>
                {
                    _.map(collections, collection => {
                        return <ListItem>
                            <ListItemIcon>
                                <InvertColorsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={`Collected ${collection.gram} g on ${collection.collectionDate}`}
                            />
                        </ListItem>
                    })
                }

            </List>
    );
}

const CollectionsQuery = (props) => {
    const { loading, error, data } = useQuery(GET_RECENT_COLLECTIONS, {
        variables: { colonyId: props.colonyId },
    });
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        console.error(error);
        return <div>Error!</div>;
    }
    return <Collections collections={data.collections} />;
};
export default CollectionsQuery;
export { GET_RECENT_COLLECTIONS };