import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { GET_RECENT_COLLECTIONS } from "./Collections";
import Collections from "./Collections";
import _ from "lodash";
import moment from "moment";
import Alert from '@material-ui/lab/Alert';
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  Fab,
  Fade,
  Grid,
  InputAdornment,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';

const ColonyBlock = ({ colony }) => {
  let nextCollectionDate;
  const initialOverproduction = colony.lastCollectionDate ? (colony.beeAmount / colony.hiveNumber) * (moment().diff(moment(colony.lastCollectionDate), 'days')) * 0.26 : 0;
  const [overproduction, setOverproduction] = useState(Number(initialOverproduction.toFixed(2)));
  const [showCollectionModal, toggleShowCollectionModal] = useState(false);
  const [honeyAmount, setAmount] = useState(0);
  const [collectionDate, setCollectionDate] = useState(moment().format("YYYY-MM-DD"));
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  let overproductionPerc = Number((overproduction / 150 * 100).toFixed(2));
  if (colony.lastCollectionDate) {
    nextCollectionDate = moment(colony.lastCollectionDate).add(6, 'days').format("MMMM DD, YYYY")
  }

  const ADD_COLLECTION = gql`
    mutation insert_article($objects: [collections_insert_input!]! ) {
      insert_collections(objects: $objects) {
        returning {
          id
          collectionDate
          colonyId
          gram
        }
      }
    }
  `;

  const UPDATE_COLONY = gql`
    mutation update_colonies($id: Int, $changes: colonies_set_input) {
      update_colonies(where: {id: {_eq: $id}}, _set: $changes) {
        affected_rows
        returning {
          id
          beeAmount
          hiveNumber
          lastCollectionDate
        }
      }  
    }
  `;

  const openModal = e => {
    // e.preventDefault();
    // e.stopPropagation();
    toggleShowCollectionModal(true);
  };

  const closeModal = e => {
    toggleShowCollectionModal(false);
    setAmount(0);
    setCollectionDate(moment().format("YYYY-MM-DD"));
  };

  const saveNewCollection = e => {
    if (honeyAmount <= 0) {
      setShowAlert(true);
      setAlertMessage("Honey amount should be positive!");
      return;
    }
    if (honeyAmount > overproduction) {
      setShowAlert(true);
      setAlertMessage("You can't collect more than existing overproduction!");
      return;
    }

    if (moment(collectionDate).isBefore(moment(colony.lastCollectionDate))) {
      setShowAlert(true);
      setAlertMessage(`Collection date cannot be earlier than the latest collection date(${colony.lastCollectionDate})`);
      return;
    }

    if (moment(collectionDate).isAfter(moment())) {
      setShowAlert(true);
      setAlertMessage("Collection date cannot be in the future!");
      return;
    }

    if (_.isEmpty(honeyAmount) || _.isEmpty(collectionDate)) {
      setShowAlert(true);
      setAlertMessage("Honey Amount and Collection Date cannot be null!");
      return;
    }
    const object = {
      id: moment().valueOf(),
      collectionDate: collectionDate,
      gram: honeyAmount,
      colonyId: colony.id

    };
    Promise.all([
      addCollection({
        variables: { objects: [object] },
        update: updateCache
      }),
      updateColony({
        variables: { id: colony.id, changes: { lastCollectionDate: collectionDate } }
      })
    ]).then(() => {
      setOverproduction(overproduction - honeyAmount);
      setShowSuccessMessage(true);
      setSuccessMessage("This collection information has been saved!");
      closeModal();
    });
  };

  const addHive = e => {
    updateColony({
      variables: { id: colony.id, changes: { hiveNumber: colony.hiveNumber + 1 } }
    }).then(() => {
      setOverproduction(Number(((colony.beeAmount / (colony.hiveNumber + 1)) * (moment().diff(moment(colony.lastCollectionDate), 'days')) * 0.26).toFixed(2)));
      setShowSuccessMessage(true);
      setSuccessMessage("An additional hive has been built!");
    });

  };

  const closeAlert = e => {
    setShowAlert(false);
  };

  const closeSuccessMessage = e => {
    setShowSuccessMessage(false);
  };

  const updateCache = (cache, { data }) => {
    const existingCollections = cache.readQuery({
      query: GET_RECENT_COLLECTIONS,
      variables: { colonyId: colony.id }
    });
    const newCollection = data.insert_collections.returning[0];
    cache.writeQuery({
      query: GET_RECENT_COLLECTIONS,
      variables: { colonyId: colony.id },
      data: { collections: [newCollection, ...existingCollections.collections.slice(0, 2)] }
    });
  };

  const [addCollection] = useMutation(ADD_COLLECTION);
  const [updateColony] = useMutation(UPDATE_COLONY);

  return (
    <div>
      <Card className="colonyBlock">
        <CardContent>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
              <div className="collectionBtn">
                <HomeIcon color="primary" />
                <span className="colonyId">Id: </span>
                <span className="colonyId">{colony.id}</span>
              </div>
              <Button className="collectionBtn" variant="contained" disabled={overproduction === 0 || moment().isBefore(moment(nextCollectionDate))} color="primary" onClick={openModal}>
                Record Collection
              </Button>
            </Grid>

            <Grid
              className="collectionBtn"
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <span className="addIconLabel">Add additional hive</span>
              <Fab color="secondary" aria-label="add" disabled={overproduction <= 150} onClick={addHive}>
                <AddIcon />
              </Fab>
            </Grid>
            <div className="colonyItem">
              <span className="colonyLabel">Estimated Amount of Bees: </span>
              <span>{colony.beeAmount}</span>
            </div>
            <div className="colonyItem">
              <span className="colonyLabel">Hive Number: </span>
              <span>{colony.hiveNumber}</span>
            </div>
            <div className="colonyItem">
              <span className="colonyLabel">Last Collection Date: </span>
              <span>{colony.lastCollectionDate && moment(colony.lastCollectionDate).format("MMMM DD, YYYY")}</span>
            </div>
            <div className="colonyItem">
              <span className="colonyLabel">Next Collection Date: </span>
              <span>{nextCollectionDate}</span>
            </div>
            <div className="colonyItem">
              <span className="colonyLabel">Status: </span>
              <span>Needs collection {moment().isAfter(moment(nextCollectionDate)) ? <CheckIcon style={{ 'color': 'green' }} /> : <ClearIcon style={{ 'color': 'red' }} />}
                Needs additional hives {overproduction > 150 ? <CheckIcon style={{ 'color': 'green' }} /> : <ClearIcon style={{ 'color': 'red' }} />}</span>
            </div>
            <div className="colonyItem">
              <span className="colonyLabel">Overproduction: </span>
              <span>{overproduction}g ({overproductionPerc}%)</span>
            </div>
            <LinearProgress className="progressBar" variant="determinate" value={overproduction >= 150 ? 100 : overproduction / 150 * 100} color="secondary" />
            <Grid
              className="limitation"
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-start"
            >
              <Typography variant="body2" color="textSecondary" component="p">
                limit: 150g
            </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar open={showSuccessMessage} autoHideDuration={3000} onClose={closeSuccessMessage}>
        <Alert onClose={closeSuccessMessage} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="collectionModal"
        open={showCollectionModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showCollectionModal}>
          <div className="collectionPaper">
            {
              showAlert &&
              <Alert className="alert" variant="filled" onClose={closeAlert} severity="error">{alertMessage}
              </Alert>
            }
            <h2 id="transition-modal-title">New Collection Information</h2>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              <TextField
                className="amountTextField"
                label="Amount of Honey"
                id="standard-start-adornment"
                variant="outlined"
                type="number"
                value={honeyAmount}
                onChange={e => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Gram</InputAdornment>,
                }}
              />
              <TextField
                id="collectionDate"
                className="collectionDateTextField"
                label="Collection Date"
                type="date"
                value={collectionDate}
                onChange={e => setCollectionDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Typography className="recentCollections">Recent 3 collections:</Typography>
              <Collections colonyId={colony.id} />
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-start"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={closeModal}
                >
                  Cancel
                  </Button>
                <Button
                  className="saveButton"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={saveNewCollection}
                >
                  Save
                  </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ColonyBlock;
