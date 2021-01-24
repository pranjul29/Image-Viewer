import React, {Component} from 'react';
import './Profile.css';
import Header from '../../common/header/Header';
import img from '../../assets/ProfilePic.JPG';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import {Redirect} from 'react-router-dom';

class Profile extends Component {

    constructor(props) {
        super();
        const accessToken = sessionStorage.getItem("access-token")
        let loggedIn = true
        if (accessToken === null) {
            loggedIn = false
        }
        this.state = {
            counter: 0,
            likeCounter: "",
            username: "",
            modalSrc: "",
            postCaption: "",
            modalIsOpen: false,
            PostModalIsOpen: false,
            realName: "Pranjul Paharia",
            updatedName: "",
            newName: "",
            updatedNameRequired: "dispNone",
            comment: "",
            interimComment: props.commentsList,
            comments: ["", "", "", "", "", "", "", ""],
            liked: false,
            loggedIn
        }
    }

    openModel = () => {
        this.setState({modalIsOpen: true})
    }

    closeModal = () => {
        this.setState({modalIsOpen: false})
        this.setState({updatedNameRequired: "dispNone"})
    }

    updateRealName = () => {
        if (this.state.updatedName.trim().length === 0) {
            this.setState({updatedNameRequired: "dispBlock"})
        } else {
            this.setState({realName: this.state.updatedName, updatedNameRequired: "dispNone"})
            this.setState({updatedName: ""})
            this.closeModal();
        }
    }

    newNameHandler = (e) => {
        this.setState({updatedName: e.target.value})
    }

    openPostModel = (caption, url, user, likes, liked, counter) => {
        this.setState({PostModalIsOpen: true})
        this.setState({postCaption: caption})
        this.setState({modalSrc: url})
        this.setState({username: user})
        this.setState({likeCounter: likes})
        this.setState({liked: liked})
        this.setState({counter: counter})
    }

    closePostModal = () => {
        this.setState({PostModalIsOpen: false})
    }

    likeClickhandler = () => {
        this.state.liked ? this.setState({liked: false}) : this.setState({liked: true})
        this.props.updatelikeDetails(this.state.counter)
    }

    commentChangeHandler = (pos, e) => {
        let interim = this.state.comments
        interim[pos] = e.target.value
        this.setState({comments: interim})
    }

    addComment = (pos) => {
        if (this.state.comments[pos].trim() !== "") {
            this.props.addComments(pos, this.state.comments[pos])
        }
        let interim = this.state.comments
        interim[pos] = ""
        this.setState({comments: interim})
    }

    render() {

        let interim = 0
        let interimsrc
        let interimUsername
        let likeNumber
        let counter = 0
        let likeStatus
        let profileUsername

        if (this.props.postDetails.length > 0) {
            profileUsername = this.props.postDetails[0].username
        }

        return (
            <div>
                {this.state.loggedIn === false ?
                    <Redirect to="/"/>
                    :
                    <div>
                        <Header displayUserProfileIcon={true}/>
                        <div className="ProfilePage">
                            <div className="UserProfileContainer">
                                <div className="OuterDiv">
                                    <div className="InnerDiv">
                                        <div>
                                            <img className="UserProfilePhoto" src={img}
                                                 alt="profile" /*onClick={this.openPostModel.bind(this, "interimorary Test Post", img, "testUser", Math.floor(Math.random() * 20), false, 2 )}*/ />
                                        </div>
                                        <div className="UserAccountDetails">
                                            <div>
                                                <Typography variant="h4">{profileUsername}</Typography>
                                            </div>
                                            <div className="SocialInfo">
                                                <div className="social">
                                                    <Typography
                                                        variant="h6">Post: {this.props.posts.length}</Typography>
                                                </div>
                                                <div className="social">
                                                    <Typography variant="h6">Follows: {this.props.follows}</Typography>
                                                </div>
                                                <div className="social">
                                                    <Typography variant="h6">Followed
                                                        By: {this.props.followedBy}</Typography>
                                                </div>
                                            </div>
                                            <div className="UserDetails">
                                                <div className="UserName">
                                                    <Typography variant="h5">{this.state.realName}</Typography>
                                                </div>
                                                <div className="EditName">
                                                    <Fab color="secondary" aria-label="edit" onClick={this.openModel}>
                                                        <EditIcon/>
                                                    </Fab>
                                                    <Modal
                                                        className="ProfileModal"
                                                        open={this.state.modalIsOpen}
                                                        onClose={this.closeModal}
                                                        closeAfterTransition
                                                        BackdropComponent={Backdrop}
                                                        BackdropProps={{
                                                            timeout: 500,
                                                        }}
                                                    >
                                                        <div className="ModalDiv">
                                                            <div>
                                                                <Typography variant="h6">Edit</Typography>
                                                            </div>
                                                            <br/>
                                                            <div>
                                                                <FormControl required>
                                                                    <InputLabel>Full Name</InputLabel>
                                                                    <Input id="newName" type="text"
                                                                           onChange={this.newNameHandler}/>
                                                                    <FormHelperText
                                                                        className={this.state.updatedNameRequired}>
                                                                        <span
                                                                            className="red unselectable">required</span>
                                                                    </FormHelperText>
                                                                </FormControl>
                                                            </div>
                                                            <br/><br/>
                                                            <div>
                                                                <Button variant="contained" color="primary"
                                                                        onClick={this.updateRealName}>
                                                                    UPDATE
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ProfileGallery">
                                    <div className="Grid">
                                        <GridList cellHeight={240} className={"postLists"} cols={3}>
                                            {this.props.posts.map(post => {
                                                likeNumber = this.props.likeList[counter]
                                                likeStatus = this.props.likeDetails[counter]
                                                counter++
                                                this.props.postDetails.forEach(thispost => {
                                                    if (post.id === thispost.id) {
                                                        interimsrc = thispost.media_url
                                                        interimUsername = thispost.username
                                                    }
                                                })
                                                return <GridListTile key={post.id} className="GridTile">
                                                    <img src={interimsrc} alt={post.caption}
                                                         onClick={this.openPostModel.bind(this, post.caption, interimsrc, interimUsername, likeNumber, likeStatus, counter - 1)}/>
                                                </GridListTile>
                                            })}
                                        </GridList>
                                        <Modal
                                            className="ProfileModal"
                                            open={this.state.PostModalIsOpen}
                                            onClose={this.closePostModal}
                                            closeAfterTransition
                                            BackdropComponent={Backdrop}
                                            BackdropProps={{
                                                timeout: 500,
                                            }}
                                        >
                                            <div className="ModalDiv">
                                                <div className="ProfilePageModal">
                                                    <div className="leftDivSection">
                                                        <img className="postImage" src={this.state.modalSrc}
                                                             alt="alternate"/>
                                                    </div>
                                                    <div className="rightDivSection">
                                                        <div className="ModalUserDetails">
                                                            <img className="ProfilePhotoModal" src={img}
                                                                 alt="profilePic"/>
                                                            <Typography className="UserNameModal"
                                                                        variant="h6">{this.state.username}</Typography>
                                                        </div>
                                                        <hr/>
                                                        <Typography variant="h5">{this.state.postCaption}</Typography>
                                                        <div className="TagsSection">
                                                            {
                                                                this.props.tagsList[Object.keys(this.props.tagsList)[this.state.counter]].map(tag => {
                                                                    interim++
                                                                    return <span
                                                                        key={"tag" + interim}>{tag}&nbsp;</span>
                                                                })
                                                            }
                                                        </div>
                                                        <div className="Comments">
                                                            <div>
                                                                <div id="comments">
                                                                    <div className="ExistingComments">
                                                                        {
                                                                            this.props.commentsList[Object.keys(this.props.commentsList)[this.state.counter]].map(comment => {
                                                                                interim++
                                                                                return <div key={interim}>
                                                                                    <span
                                                                                        className="bold">{this.state.username}:</span>
                                                                                    <span>{comment}</span>
                                                                                </div>
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="NewCommentSection">
                                                                    <div>
                                                                        {
                                                                            this.state.liked ? <div
                                                                                    className="likeSectionInProfilePage">
                                                                                    <Favorite id={2} style={{color: "red"}}
                                                                                              className="likeButton"
                                                                                              onClick={this.likeClickhandler}/><span>{this.state.likeCounter + 1} likes</span>
                                                                                </div> :
                                                                                <div
                                                                                    className="likeSectionInProfilePage">
                                                                                    <FavoriteBorderIcon id={2}
                                                                                                        className="likeButton"
                                                                                                        onClick={this.likeClickhandler}/><span>{this.state.likeCounter} likes</span>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                    <div className="ProfilePageAddComment">
                                                                        <FormControl className="addCommentInput">
                                                                            <InputLabel htmlFor={"input" + counter}>Add
                                                                                a comment</InputLabel>
                                                                            <Input id={"input" + counter} type="text"
                                                                                   value={this.state.comments[this.state.counter]}
                                                                                   onChange={this.commentChangeHandler.bind(this, this.state.counter)}/>
                                                                        </FormControl>
                                                                        <Button className="addCommentButton"
                                                                                variant="contained" color="primary"
                                                                                onClick={this.addComment.bind(this, this.state.counter)}>
                                                                            ADD
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>} </div>
        )
    }
}

export default Profile;