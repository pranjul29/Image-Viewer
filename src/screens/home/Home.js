import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import img from '../../assets/ProfilePic.JPG';
import Avatar from '@material-ui/core/Avatar';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        const accessToken = sessionStorage.getItem("access-token")
        let loggedIn = true
        if(accessToken === null) {
            loggedIn = false
        }
        this.state = {
            liked: false,
            comment: "",
            comments: ["", "", "", "", "", "", "", ""],
            loggedIn
        }
    }

    likeClickhandler = (id) => {
        this.props.updatelikeDetails(id)
    }

    commentChangeHandler = (pos, e) => {
        let temp = this.state.comments
        temp[pos] = e.target.value
        this.setState({ comments: temp })
    }

    addComment = (pos) => {
        if (this.state.comments[pos].trim() !== "") {
            this.props.addComments(pos, this.state.comments[pos])
        }
        let temp = this.state.comments
        temp[pos] = ""
        this.setState({ comments: temp })
    }

    render() {

        console.log(this.props.posts)
        if (!this.state.loggedIn) {
            return <Redirect to="/" />
        }

        let temp = 0

        let tempusername = ""
        let tempSrc
        let tempTimeStamp
        let tempDate
        let tempMonth
        let tempYear
        let tempHour
        let tempMin
        let tempSec
        let likeNumber
        let counter = 0
        let commentsValue = 0
        let tagValue = 0
        let commentsList = this.props.commentsList
        let tagsList = this.props.tagsList

        let displayPosts

        this.props.showFilteredPosts ? displayPosts = this.props.filteredPosts : displayPosts = this.props.posts

        return (
            <div className="mainContainer">
                <Header dispalySearchBar={true}
                        displayUserProfileIcon={true}
                        filterCaptions={this.props.filterCaptions}
                />
                <div className="HomePage">
                    <div className="homeMain">
                        <div className="CardContainer">
                            {
                                displayPosts.map(post => {
                                    likeNumber = this.props.likeList[counter]
                                    counter++
                                    this.props.postDetails.forEach(thispost => {
                                        if (thispost.id === post.id) {
                                            tempusername = thispost.username
                                            tempSrc = thispost.media_url
                                            tempTimeStamp = new Date(thispost.timestamp)
                                            tempDate = tempTimeStamp.getDate()
                                            tempMonth = tempTimeStamp.getMonth() + 1
                                            tempYear = tempTimeStamp.getFullYear()
                                            tempHour = tempTimeStamp.getHours()
                                            tempMin = tempTimeStamp.getMinutes()
                                            tempSec = tempTimeStamp.getSeconds()
                                        }
                                    });
                                    return <Card key={post.id} id={post.id} className="cardStyle">
                                        <div>
                                            <CardHeader className="CardHead" avatar={
                                                <Avatar className="CardHeadAvatar" src={img} sizes="small" />
                                            }
                                                        title={tempusername}
                                                        subheader={tempDate + "/" + tempMonth + "/" + tempYear + " " + tempHour + ":" + tempMin + ":" + tempSec} />
                                        </div>
                                        <div className="CardContent">
                                            <CardContent>
                                                <div className="CardContentImage">
                                                    <img className="image" src={tempSrc} alt={post.caption} />
                                                </div>
                                                < hr />
                                                <div className="ImageDetails">
                                                    <div className="Caption"><Typography variant="h5">{post.caption}</Typography></div>
                                                    <div className="Tags" {...tagValue++}>
                                                        {
                                                            this.props.tagsList[Object.keys(tagsList)[tagValue - 1]].map(tag => {
                                                                temp++
                                                                return <span key={"tag"+temp}>{tag}&nbsp;</span>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        this.props.likeDetails[counter - 1] ? <div className="PostLikeSection"><Favorite id={2} style={{ color: "red" }} className="likeButton" onClick={this.likeClickhandler.bind(this, counter - 1)} /><span>{likeNumber + 1} likes</span></div> :
                                                            <div className="PostLikeSection"><FavoriteBorderIcon id={2} className="PostLikeButton" onClick={this.likeClickhandler.bind(this, counter - 1)} /><span>{likeNumber} likes</span></div>
                                                    }
                                                </div>
                                                <div className="PostCommentSection">
                                                    {
                                                        <div {...commentsValue++}>
                                                            <div id="comments" className="Comments">
                                                                <div className="CommentSection">
                                                                    {
                                                                        this.props.commentsList[Object.keys(commentsList)[commentsValue - 1]].map(comment => {
                                                                            temp++
                                                                            return <div key={post.id + temp}>
                                                                                <span className="bold">{tempusername}:</span>
                                                                                <span>{comment}</span>
                                                                            </div>
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="NewComment">
                                                                <FormControl className="commentInput" >
                                                                    <InputLabel htmlFor={"input" + commentsValue}>Add a comment</InputLabel>
                                                                    <Input id={"input" + commentsValue} type="text" value={this.state.comments[commentsValue - 1]} onChange={this.commentChangeHandler.bind(this, commentsValue - 1)} />
                                                                </FormControl>
                                                                <Button className="AddNewComment" variant="contained" color="primary" onClick={this.addComment.bind(this, commentsValue - 1)}>
                                                                    ADD
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;