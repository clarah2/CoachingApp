import {
    FormControl,
    Grid,
    Typography,
    withStyles,
    MenuItem,
    Select,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TableSortLabel,
} from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import ForwardIcon from '@material-ui/icons/Forward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FolderIcon from '@material-ui/icons/Folder';
import CHALKLogoGIF from '../../assets/images/CHALKLogoGIF.gif';
import Firebase, { FirebaseContext } from '../Firebase';
import SaveImage from '../../assets/images/SaveImage.svg';
import SaveGrayImage from '../../assets/images/SaveGrayImage.svg';
import styled from 'styled-components';

const TableRow = styled.tr`
background-color: white;
:nth-child(odd) {
  background-color: rgb(234, 234, 234);
}
&:hover {
  background-color: rgb(9, 136, 236, .4);
  cursor: pointer;
}

`

const StyledSelect = withStyles({
  root: {
    padding: '11px 14px',
    width: '25.5vw',
    // maxWidth: '425px'
  },
  disabled: {
    opacity: 0.3
  }
})(Select);

interface Props {
  changePage(pageName: string): void
  userRole: string
  location: string
  coachData: Array<Object>
  teacherData: Array<Object>
  sitesList: Array<Object>
  updateCoachData(data): void
  updateTeacherData(data): void
  programData: Array<Object>
  updateSendToSitesData(data): void
  siteData: Array<Object>
  updateSiteData(data): void
  updateProgramData(data): void

}

interface State {
    view: number
    saved: boolean
    currentSites: Array<Object>
    sortType: string
    editCoachFirstName: string
    editCoachLastName: string
    editCoachEmail: string
    editCoachSiteName: string
    editCoachProgramName: string
    editCoachId: string
    editCoachSiteId: string
    editCoachProgramId: string
    successModalOpen: boolean
    success: boolean
    saveModalOpen: boolean
    pendingView: number
    awaitingConfirmationRef: { resolve: (discard: boolean) => void  } | null
    addSiteName: string
    addProgramId: string
    addSiteLeaderList: Array<Object>
    addSiteLeader: string
    originalSiteLeaders: Array<Object>
    archiveModalOpen: boolean
    archiveList: Array<Object>
    firstLoad: boolean

}

class Sites extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

      this.state = {
      view: 1,
      saved: true,
      currentSites: [],
      sortType: "",
      editCoachFirstName: "",
      editCoachLastName: "",
      editCoachEmail: "",
      editCoachSiteName: "",
      editCoachProgramName: "",
      editCoachId: "",
      editCoachSiteId: "",
      editCoachProgramId: "",
      successModalOpen: false,
      success: true,
      saveModalOpen: false,
      pendingView: 1,
      awaitingConfirmationRef: null,
      addSiteName: "",
      addProgramId: "",
      addSiteLeaderList: [],
      addSiteLeader: "",
      originalSiteLeaders: [],
      archiveModalOpen: false,
      archiveList: [],
      firstLoad: true

    }

  }

  componentDidMount = async () => {
    // Set list of leaders user can select as a leader of a site
    const siteLeaders = await this.context.getSiteLeaders()
    const programLeaders = await this.context.getProgramLeaders()
    const allLeaders = siteLeaders.concat(programLeaders)

    this.setState({originalSiteLeaders: allLeaders});
  }

  handlePageChange = (pageNumber: number) => {
    this.setState({pendingView: pageNumber})
    switch (pageNumber) {
      default : case 1:
        if (!this.state.saved) {
          this.onSaveModalOpen();
          break;
        } else {
          this.setState({view: pageNumber});
          this.props.changePage("Sites");
          break;
        }
      case 2:
        if (!this.state.saved) {
          this.onSaveModalOpen();
          break;
        } else {
          this.setState({view: pageNumber});
          this.props.changePage("SitesAdd");
          break;
        }
      case 3:
        if (!this.state.saved) {
          this.onSaveModalOpen();
          break;
        } else {
          this.setState({view: pageNumber});
          this.props.changePage("SitesEdit");
          break;
        }
    }
  }

  sortCoaches = (sortType) => {
    var coaches = this.props.sitesList;

    if (this.state.firstLoad === true && sortType === "siteName") {
      this.setState({firstLoad: false, sortType: 'siteNameReverse'})
      sortType = 'siteNameReverse'
    } else if(this.state.firstLoad === true && sortType !== "siteName") {
      this.setState({firstLoad: false, sortType: sortType})
    } else {
      this.setState({sortType: sortType});
    }


    // Sort the teachers list
    switch (sortType) {
      case "lastName":
        coaches.sort((a,b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0));
        break;
      case "lastNameReverse":
        coaches.sort((a,b) => (b.lastName > a.lastName) ? 1 : ((a.lastName > b.lastName) ? -1 : 0));
        break;
      case "firstName":
        coaches.sort((a,b) => (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0));
        break;
      case "firstNameReverse":
        coaches.sort((a,b) => (b.firstName > a.firstName) ? 1 : ((a.firstName > b.firstName) ? -1 : 0));
        break;
      case "siteName":
        coaches.sort((a,b) => (a.siteName > b.siteName) ? 1 : ((b.siteName > a.siteName) ? -1 : 0));
        break;
      case "siteNameReverse":
        coaches.sort((a,b) => (b.siteName > a.siteName) ? 1 : ((a.siteName > b.siteName) ? -1 : 0));
        break;

      default:
        break;
    }

    this.setState({currentSites: coaches});

  }

  validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * @brief This function gets checks all state variables associated with edit for correct input and then uses them to call the firebase instance method editUserName
   * On success the function will update the firestore and state
   * On failure the function will throw an error and display an alert message
   * 
   * @param {Object} firebase - instance of firebase
   * @returns 
   */
  editCoach = async (firebase:Firebase) => {
      firebase
      const {
        editCoachId,
        editCoachFirstName,
        editCoachLastName,
        editCoachEmail
      } = this.state

      this.setState({success: true})

      if (!editCoachFirstName || editCoachFirstName === ""){
        alert("First Name is required");
        return
      }

      if (!editCoachLastName || editCoachLastName === ""){
        alert("Last name is required");
        return;
      }

      if (editCoachEmail !== "" && !this.validateEmail(editCoachEmail)) {
        alert("No email or valid email is required");
        return;
      }

      if (await firebase.emailExists(editCoachEmail, editCoachId)) {
        alert("This email already exists for another user")
        return;
      }

      await firebase.editUserName(editCoachId, editCoachFirstName, editCoachLastName, editCoachEmail, "coach", false).
        catch(e => {
          console.log(e)
          alert('Unable to edit Coach. Please try again')
          this.setState({success: false})
        }).finally(() => {
            let update = this.props.coachData;
            let coachData = update.find(o => o.id === editCoachId);
            let coachDataIndex = update.indexOf(coachData);
            update[coachDataIndex].firstName = editCoachFirstName;
            update[coachDataIndex].lastName = editCoachLastName;
            update[coachDataIndex].email = editCoachEmail;

            this.props.updateCoachData(update)

            update = this.props.teacherData;
            coachData = update.filter(o => {return o.coachId === editCoachId});
            coachData.map(value => {
              coachDataIndex = update.indexOf(value);
              update[coachDataIndex].coachFirstName = editCoachFirstName;
              update[coachDataIndex].coachLastName = editCoachLastName;
            })
            this.props.updateTeacherData(update)

            update = this.props.sitesList;
            coachData = update.filter(o => {return o.id === editCoachId})
            coachData.map(value => {
              coachDataIndex = update.indexOf(value)
              update[coachDataIndex].firstName = editCoachFirstName;
              update[coachDataIndex].lastName = editCoachLastName;
              update[coachDataIndex].email = editCoachEmail;
            })


            this.setState({ // Hold off setting new state until success has been determined
              editCoachId: "",
              editCoachFirstName: "",
              editCoachLastName: "",
              editCoachEmail: "",
              editCoachSiteName: "",
              editCoachProgramName: "",
              editCoachSiteId: "",
              editCoachProgramId: "",
              successModalOpen: this.state.success ? true : false,
              saved: true
            });
        });
  }

  handleInputChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (name === 'firstName') {
      this.setState({
        editCoachFirstName: event.target.value,
        saved: false,
      })
    }
    if (name === 'lastName') {
      this.setState({
        editCoachLastName: event.target.value,
        saved: false,
      })
    }
    if (name === 'email') {
      this.setState({
        editCoachEmail: event.target.value,
        saved: false,
      })
    }
    if (name === 'site') {
      this.setState({
        addSiteName: event.target.value,
        saved: false,
      })
    }
  }

  handleEditClick = (value) => {
    console.log(value)
    if (value.id !== "") {
    this.setState({
      editCoachId: value.id,
      editCoachFirstName: value.firstName,
      editCoachLastName: value.lastName,
      editCoachEmail: value.email,
      editCoachSiteName: value.siteName,
      editCoachSiteId: value.siteId,
      editCoachProgramName: value.programName,
      editCoachProgramId: value.programId
    })
    this.handlePageChange(3)
    } else {
      alert("This site has no coach to edit.");
    }
  }

  onSaveModalOpen =  (): Promise<boolean> => {
    this.setState({saveModalOpen: true})
    return new Promise<boolean>((resolve: (discard: boolean) => void, reject): void => {
      this.setState({awaitingConfirmationRef: {resolve}})
    })
  }

  onSaveModalDiscard = (): void => {
    if(this.state.awaitingConfirmationRef) {
      this.state.awaitingConfirmationRef.resolve(true)
    }
      let view = this.state.pendingView;
      this.setState({
        saveModalOpen: false,
        view: view,
        saved: true,
        awaitingConfirmationRef: null,
        editCoachFirstName: "",
        editCoachLastName: "",
        editCoachEmail: "",
        editCoachSiteName: "",
        editCoachProgramName: "",
        editCoachId: "",
        editCoachSiteId: "",
        editCoachProgramId: "",
      })
  }

  onSaveModalClose = (): void => {
    if(this.state.awaitingConfirmationRef) {
      this.state.awaitingConfirmationRef.resolve(false)
    }
      this.setState({
          saveModalOpen: false,
        awaitingConfirmationRef: null
      })
  }

  successModalClose = (): void => {
    if(this.state.awaitingConfirmationRef) {
      this.state.awaitingConfirmationRef.resolve(false)
    }
      this.setState({
          awaitingConfirmationRef: null,
          successModalOpen: false,
          saved: true,
          editCoachFirstName: "",
          editCoachLastName: "",
          editCoachEmail: "",
          editCoachSiteName: "",
          editCoachProgramName: "",
          editCoachId: "",
          editCoachSiteId: "",
          editCoachProgramId: "",
      })
    this.handlePageChange(1)
  }

  /**
   * @brief This function populates the site leader dropdown in the create a site area with valid site leaders
   * 
   * @param event - html event
   */
  handlePopulateSiteLeaders = (event) => {
    this.setState({addProgramId: event.target.value, saved: false})
    let leaders = this.state.originalSiteLeaders
    let program = this.props.programData.find(o => o.id === event.target.value)
    // leaders = leaders.filter(leader => {return leader.sites.some(site => program.sites.includes(site))})
    this.setState({addSiteLeaderList: leaders})
  }

  /**
   * @brief The function creates a new site in the system by taking in the necessary information from the state.
   * The function checks if the site name, program, and site leader is provided.
   * If not, it alerts the user.
   * Otherwise, it creates a new site in the system, assigns the program to the site leader and assigns the site to the site leader
   * The new site is also added to the 'sitesList' and 'siteData' state for further use.
   * 
   * @param {Object} firebase - an instance of firebase
   * @returns 
   */
  async createSite(firebase:Firebase){

    let {
      addSiteName,
      addProgramId,
      addSiteLeader
    } = this.state;

    this.setState({success: true})
    let siteId = "";


    if (!addSiteName || addSiteName === ""){
        alert("Site name is required");
        return;
    }

    if (!addProgramId || addProgramId === ""){
      alert("Program is required");
      return;
    }

    if (!addSiteLeader || addSiteLeader === ""){
      alert("Site Leader is required");
      return;
    }

    let editName = ""
    let trimName = addSiteName.trim()
    let splitName = trimName.split(' ')
    splitName = splitName.filter(word => {return word !== ""})
    for (let wordIndex in splitName) {
      let word = splitName[wordIndex]
      editName += word + ' '
    }
    editName = editName.substring(0, editName.length - 1)
    addSiteName = editName

    let siteInfo = {
      siteName: addSiteName,
      selectedProgram: addProgramId
    }

    let proceed = true;

    for (let i = 0; i < this.props.sitesList.length; i++) {
      if (this.props.sitesList[i].siteName.toLowerCase() === addSiteName.toLowerCase()) {
        proceed = false;
        i = this.props.sitesList.length;
      }
    }

    if (!proceed) {
      alert("Site name already exists")
      return;
    }

    await firebase.createSite(siteInfo)
        .then((data) => {
          console.log("Site Created");
          siteId = data.id

            // Add new program to users
            firebase.assignProgramToUser({userId: addSiteLeader, programId: addProgramId}).then((res) => {
              console.log("Program " + addProgramId + "added to user " + addSiteLeader);
            }).catch(e => console.error("error => ", e));

            firebase.assignSiteToUser({userId: addSiteLeader, siteId: data.id}).then((res) => {
              console.log("Sites added to user " + addSiteLeader);
            }).catch(e => console.error("error => ", e));

            firebase.assignUserToSiteOrProgram({siteId: data.id, userId: addSiteLeader}).then((res) => {
                console.log(addSiteLeader + " Users added to site " + data.id);
              }).catch(e => console.error("error => site : " + data.id, e));


        }).catch(e => {
            this.setState({success: false})
            console.log(e)
            alert('Unable to create Site. Please try again')
        }).finally(() => {

            let update = this.props.sitesList
            update.push({
              siteName: addSiteName,
              siteId: siteId,
              programName: "",
              programId: addProgramId,
              firstName: "",
              lastName: "",
              id: "",
              archived: false,
              email: ""
            })

            this.props.updateSendToSitesData(update)

            update = this.props.siteData
            update.push({
              name: addSiteName,
              id: siteId,
              siteLeaderId: "",
              coaches: ""
            })

            this.props.updateSiteData(update)

            update = this.props.programData
            let programData = update.find(o => o.id === addProgramId);
            let programIndex = update.indexOf(programData);

            update[programIndex].sites.push(siteId)
            this.props.updateProgramData(update)

            this.setState({ // Hold off setting new state until success has been determined
              addSiteName: "",
              addProgramId: "",
              addSiteLeader: "",
              addSiteLeaderList: [],
              successModalOpen: this.state.success ? true : false,
              saved: true
            });
        });
  }

  archiveModalOpen =  (): Promise<boolean> => {
    this.setState({archiveModalOpen: true})
    return new Promise<boolean>((resolve: (discard: boolean) => void, reject): void => {
      this.setState({awaitingConfirmationRef: {resolve}})
    })
  }

  archiveModalDiscard = (): void => {
    if(this.state.awaitingConfirmationRef) {
      this.state.awaitingConfirmationRef.resolve(true)
    }
      this.setState({
        archiveModalOpen: false,
        awaitingConfirmationRef: null,
      })
  }

  /**
   * 
   * @brief function for archiving a coach by updating coachData and teacherData in the component's props
   * This function takes an instance of firebase as an input. It retrieves the editCoachId, editCoachFirstName, editCoachLastName, editCoachProgramName, editCoachProgramId, and editCoachEmail from the component's state.
   * The function then creates two arrays, userSites and archiveSites, and populates them with the coach's site information.
   * The function then calls the archiveCoach method from the firebase instance, passing in the editCoachId, editCoachFirstName, editCoachLastName, editCoachProgramName, editCoachProgramId, editCoachEmail, userSites, and archiveSites as arguments.
   * If the call is successful, the function updates the coachData and teacherData in the component's props, and sets the state of several other properties.
   * If the call is not successful, it will throw an error and display an alert message, and set the state of success to false.
   * 
   * @param {Object} firebase - an instance of firebase
   */
  async archiveCoach(firebase:Firebase) {
    firebase
    const {
      editCoachId,
      editCoachFirstName,
      editCoachLastName,
      editCoachProgramName,
      editCoachProgramId,
      editCoachEmail,

    } = this.state

    let userSites = []
    let archiveSites = []
    let search = this.props.coachData
    let coach = search.filter(o => {return o.id === editCoachId})[0]
    for (let i = 0; i < coach.siteList.length; i++) {
      userSites.push(coach.siteList[i].siteId)
      archiveSites.push({
        siteId: coach.siteList[i].siteId,
        siteName: coach.siteList[i].siteName
      })
    }
    archiveSites.sort((a, b) => a.site.toLowerCase().localeCompare(b.site.toLowerCase()))


    firebase.archiveCoach(editCoachId, editCoachFirstName, editCoachLastName, editCoachProgramName, editCoachProgramId, editCoachEmail, userSites, archiveSites)
    .catch(e => {
      this.setState({success: false})
      console.log(e)
      alert('Unable to archive coach please try again')
  }).finally(() => {

      // let update = this.state.teachersList;
      let update = this.props.coachData;
      let coachData = update.find(o => o.id === editCoachId);
      let coachIndex = update.indexOf(coachData);
      update[coachIndex].archived = true;
      update.splice(coachIndex, 1);

      this.props.updateCoachData(update)

      update = this.props.teacherData
      let teacherData = update.filter(o => {return o.coachId === editCoachId})
      teacherData.map(o => {
        let teacherIndex = update.indexOf(o)
        update[teacherIndex].coachId = ""
        update[teacherIndex].coachFirstName = ""
        update[teacherIndex].coachLastName = ""
      })

      this.props.updateTeacherData(update)

      update = this.props.sitesList;
      let coaches = update.filter(item => {return item.id === editCoachId})
      coaches.map(o => {
        coachIndex = update.indexOf(o)
        update.splice(coachIndex, 1)
      })

      this.props.updateSendToSitesData(update)


      this.setState({ // Hold off setting new state until success has been determined
        editCoachEmail: "",
        editCoachFirstName: "",
        editCoachLastName: "",
        editCoachSiteName: "",
        editCoachProgramName: "",
        editCoachId: "",
        editCoachSiteId: "",
        editCoachProgramId: "",
        successModalOpen: this.state.success ? true : false,
        archiveModalOpen: false,
        saved: true
      });
  });
  }

  render() {

    return (<>
    <Dialog open={this.state.archiveModalOpen}>
      <DialogTitle style={{ fontFamily: 'Arimo' }}>
          Are you sure you would like to move this user to archives?
      </DialogTitle>
      <DialogActions>
        <Button onClick={this.archiveModalDiscard}>
            No, go back
        </Button>
        <FirebaseContext.Consumer>
          {(firebase: Firebase) => (
            <Button onClick={(_) => {this.archiveCoach(firebase)}}>
                Yes, I am sure
            </Button>
          )}
        </FirebaseContext.Consumer>
      </DialogActions>
    </Dialog>
    <Dialog open={this.state.successModalOpen}>
      <DialogTitle style={{ fontFamily: 'Arimo' }}>
          The action was completed successfully.
      </DialogTitle>
      <DialogActions>
        <Button onClick={this.successModalClose}>
            Ok
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={this.state.saveModalOpen}>
      <DialogTitle style={{ fontFamily: 'Arimo' }}>
          You have unsaved changes to your entry.
          Would you like to discard the entry?
      </DialogTitle>
      <DialogActions>
          <Button onClick={this.onSaveModalClose}>
              No, keep editing
          </Button>
          <Button onClick={this.onSaveModalDiscard}>
              Yes, discard changes
          </Button>
      </DialogActions>
    </Dialog>
  {/* {this.props.sitesList.length > 0 ? (<> */}
    <Grid container direction='row'>
  {this.state.view === 1 ? (<>
    <Grid item xs={3}>
      <Grid container direction='column' style={{ marginLeft:'30px'}}>
        <Grid item xs={6}>
          <Grid container direction='row' style={{cursor: 'default'}} onClick={() => {this.handlePageChange(2)}}>
              <Grid item>
                  <AddIcon style={{fill: 'green', fontSize:'40', marginTop:'15px'}}/>
              </Grid>
              <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{marginTop:'20px' }}
                    >
                      Add
                  </Typography>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </>) : (this.state.view === 2 ? (<>
    <Grid item xs={3}>
      <Grid container direction='column' style={{ marginLeft:'30px'}}>
        <Grid item xs={6}>
          <Grid container direction='row' style={{cursor: 'default'}} onClick={() => {this.handlePageChange(1)}}>
              <Grid item>
                  <ArrowBackIcon style={{fill: 'green', fontSize:'40', marginTop:'15px'}}/>
              </Grid>
              <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{marginTop:'20px' }}
                    >
                      Back
                  </Typography>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </>) : (this.state.view === 3 ? (<>
    <Grid item xs={3}>
      <Grid container direction='column' style={{ marginLeft:'30px'}}>
        <Grid item xs={6}>
            <Grid container direction='row' style={{cursor: 'default'}} onClick={(_) => {this.setState({archiveModalOpen: true})}}>
                <Grid item>
                    <FolderIcon style={{fill: 'Khaki', fontSize:'40', marginTop:'15px'}}/>
                </Grid>
                <Grid item>
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{marginTop:'20px' }}
                      >
                        Archive
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction='row' style={{cursor: 'default'}} onClick={() => {this.handlePageChange(1)}}>
              <Grid item>
                  <ArrowBackIcon style={{fill: 'green', fontSize:'40', marginTop:'15px'}}/>
              </Grid>
              <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{marginTop:'20px' }}
                    >
                      Back
                  </Typography>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </>) : (null)))}
  {this.state.view === 1 ? (<>
    {this.props.sitesList.length > 0 ? (<>
    <Grid container direction='row' justifyContent='center' alignItems='center'>
      <Grid
      item
      xs={8}
      style={{
        width: '100%',
        height: '38vh',
        // border: '2px solid #0988ec',
        // borderRadius: '0.5em',
        // marginTop:'180px'
      }}
      >
      <table style={{borderCollapse: 'collapse', width: '100%' }}>
        <thead style={{borderBottom:'2px solid #0988ec'}}>
          <tr>
            <th
              colSpan={1}
              onClick={
                () =>{
                  if(this.state.sortType == "siteName")
                  {
                    this.sortCoaches("siteNameReverse")
                  }
                  else
                  {
                    this.sortCoaches("siteName")
                  }
                }
              }
            >
            <TableSortLabel
              direction = {this.state.firstLoad ? 'desc' : (this.state.sortType === "siteName" ? 'desc' : 'asc')}
              active = {this.state.firstLoad ? true : (['siteName', 'siteNameReverse'].includes(this.state.sortType) ? true : false)}
              >
                <Typography variant="h6">
                  <strong>Site</strong>
                </Typography>
            </TableSortLabel>
            </th>
            <th colSpan={2}>
                <Typography variant="h6">
                  <strong>Instructional Coaches</strong>
                </Typography>
            </th>
          </tr>
          <tr>
            <th></th>
            <th
              onClick={
                () =>{
                  if(this.state.sortType == "lastName")
                  {
                    this.sortCoaches("lastNameReverse")
                  }
                  else
                  {
                    this.sortCoaches("lastName")
                  }
                }
              }
            >
              <TableSortLabel
                direction = {this.state.sortType === "lastName" ? 'desc' : 'asc'}
                active = {['lastName', 'lastNameReverse'].includes(this.state.sortType) ? true : false}
                >
                <Typography variant="h6">
                  Last Name
                </Typography>
              </TableSortLabel>
            </th>
            <th
              onClick={
                () =>{
                  if(this.state.sortType == "firstName")
                  {
                    this.sortCoaches("firstNameReverse")
                  }
                  else
                  {
                    this.sortCoaches("firstName")
                  }
                }
              }
            >
              <TableSortLabel
                direction = {this.state.sortType === "firstName" ? 'desc' : 'asc'}
                active = {['firstName', 'firstNameReverse'].includes(this.state.sortType) ? true : false}
                >
                <Typography variant="h6">
                  First Name
                </Typography>
              </TableSortLabel>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.sitesList.map((site) => {
            return (<>
            <TableRow key={site.id} onClick={() => {this.handleEditClick(site)}}>
              <td style={{textAlign:'left'}}>
                <Typography variant="h6"  >
                  {site.siteName}
                </Typography>
              </td>
              <td style={{textAlign:'left'}}>
                <Typography variant="h6"  >
                  {site.lastName}
                </Typography>
              </td>
              <td style={{textAlign:'left'}}>
                <Typography variant="h6"  >
                  {site.firstName}
                </Typography>
              </td>
            </TableRow>
            </>)
          })}
        </tbody>
      </table>
      </Grid>
    </Grid>
    </>) :  (<>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{height: "100%", marginTop:'8vh'}}
      >
        <img src={CHALKLogoGIF} alt="Loading" width="40%" />
      </Grid>
    </>)}
    </>) : (this.state.view === 2 ? (<>
    <Grid item xs={1} style={{marginTop: '45px'}}>
      <Grid container direction='column' justifyContent='center' alignItems='flex-start' spacing={3}>
        <Grid item>
          <Typography variant="h6" style={{marginTop:'5px'}}>
            Name
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" style={{marginTop:'8px'}}>
            Program
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" style={{marginTop:'7px'}}>
            Leaders
          </Typography>
        </Grid>
      </Grid>
      </Grid>

      <Grid item xs={5} style={{marginTop: '45px'}}>
      <Grid container direction='column' justifyContent='center' alignItems='center' spacing={3}>
        <Grid item>
          <TextField
            size="small"
            style={{width:'29.5vw', maxWidth: '470px'}}
            id="site-name"
            label="Site Name"
            type="text"
            value={this.state.addSiteName}
            variant="outlined"
            onChange={this.handleInputChange('site')}
          />
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <StyledSelect
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.addProgramId}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => this.handlePopulateSiteLeaders(event)}
              name="siteProgram"
            >
              {this.props.programData.map((program, index) => {
                return (
                  <MenuItem key={index} value={program.id}>
                    {program.name}
                  </MenuItem>
                )
              })}
            </StyledSelect>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <StyledSelect
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.addSiteLeader}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => this.setState({addSiteLeader: event.target.value})}
              name="siteLeaders"
              disabled={this.state.addProgramId !== "" ? false : true}
            >
              {this.state.addSiteLeaderList.map((leader, index) => {
                return (
                  <MenuItem value={leader.id} key={index}>
                      {`${leader.lastName}, ${leader.firstName}`}
                  </MenuItem>
                )
              })}
            </StyledSelect>
          </FormControl>
        </Grid>
      </Grid>
      </Grid>

      <Grid container direction='row' justifyContent='center' alignItems='center' style={{marginTop:'45px'}}>
      <Grid item xs={1}/>
        <Grid item xs={1}>
          <FirebaseContext.Consumer>
            {(firebase: Firebase) => (
              <Button
              onClick={(_)=>{this.createSite(firebase)}}
              >
                {this.state.saved ? (
                  <img
                    alt="Save"
                    src={SaveGrayImage}
                    style={{
                      width: '80%',
                      minWidth:'70px'
                    }}
                  />
                ) : (
                  <img
                    alt="Save"
                    src={SaveImage}
                    style={{
                      width: '80%',
                      minWidth:'70px'
                    }}
                  />
                )}
              </Button>
            )}
          </FirebaseContext.Consumer>
        </Grid>
      </Grid>
    </>) : (this.state.view === 3 ? (<>
      <Grid item xs={1} style={{marginTop: '45px'}}>
        <Grid container direction='column' justifyContent='center' alignItems='flex-start' spacing={3}>
          <Grid item>
            <Typography variant="h6" style={{marginTop:'15px'}}>
              Coach
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{marginTop:'20px'}}>
              Email
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{marginTop:'25px'}}>
              Site
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{marginTop:'25px'}}>
              Program
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={5} style={{marginTop: '45px'}}>
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={3}>
          <Grid item>
            <Grid container direction='row' justifyContent='center' spacing={3}>
              <Grid item xs={6}>
                <TextField
                id="teacher-firstName"
                label="First Name"
                type="text"
                value={this.state.editCoachFirstName}
                InputProps={{
                  readOnly: false
                }}
                variant="outlined"
                onChange={this.handleInputChange('firstName')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                id="teacher-lastName"
                label="Last Name"
                type="text"
                value={this.state.editCoachLastName}
                InputProps={{
                  readOnly: false
                }}
                variant="outlined"
                onChange={this.handleInputChange('lastName')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              style={{width:'42vw', maxWidth: '470px'}}
              id="teacher-email"
              label="Email"
              type="text"
              value={this.state.editCoachEmail}
              InputProps={{
                readOnly: false
              }}
              variant="outlined"
              onChange={this.handleInputChange('email')}
            />
          </Grid>
          <Grid item>
            <TextField
              style={{width:'42vw', maxWidth: '470px'}}
              id="teacher-Coach"
              type="text"
              value={this.state.editCoachSiteName}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
              />
          </Grid>
          <Grid item>
            <TextField
              style={{width:'42vw', maxWidth: '470px'}}
              id="teacher-Site"
              type="text"
              value={this.state.editCoachProgramName}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction='row' justifyContent='center' alignItems='center' style={{marginTop:'45px'}}>
        <Grid item xs={1}/>
          <Grid item xs={1}>
            <FirebaseContext.Consumer>
              {(firebase: Firebase) => (
                <Button
                onClick={(_)=>{this.editCoach(firebase)}}
                >
                  {this.state.saved ? (
                    <img
                      alt="Save"
                      src={SaveGrayImage}
                      style={{
                        width: '80%',
                        minWidth:'70px'
                      }}
                    />
                  ) : (
                    <img
                      alt="Save"
                      src={SaveImage}
                      style={{
                        width: '80%',
                        minWidth:'70px'
                      }}
                    />
                  )}
                </Button>
              )}
            </FirebaseContext.Consumer>
          </Grid>
        </Grid>
    </>) : (<></>)))}
    </Grid>
</>)

  }
}

Sites.contextType = FirebaseContext
export default Sites
