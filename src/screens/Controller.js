import React, {Component} from 'react';
import Login from './login/Login';
import Home from './home/Home';
import Profile from './profile/Profile';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class Controller extends Component {
    constructor() {
        super();
        this.state = {
            baseUrl: "https://graph.instagram.com/me/media?fields=id,caption&access_token=",
            postUrl: {
                url1: "https://graph.instagram.com/",
                url2: "?fields=id,media_type,media_url,username,timestamp&access_token="
            },
            /* Please do not modify the access token */
            accessToken: "IGQVJYODNqcUIzMTBuWDgzX1JNRE9tcHdqcUszLVo2TVlPXzNLeHZAkZAHNZAR25YT2xhZAlZACdzVCNGRqdmQ1Y2NzWGIwZA1hEcUt3RmRnRzNWUWRaWGpzaW1jWlprcG1ucC1UY2tUTy1qS2hUbmUzcUE1eHZA6eHg0dXBRRzVz",
            username: "",
            usernameSet: false,
            posts: [],
            filteredPosts: [],
            showFilteredPosts: false,
            tempList: [],
            likeList: [...Array(8)].map(() => Math.floor(Math.random() * 20)),
            likeDetails: new Array(8).fill(false),
            follows: Math.floor(Math.random() * 20),
            followedBy: Math.floor(Math.random() * 20),
            // commentsList: this.commentGenerator(100),
            commentsList: this.commentGenerator(100),
            tagsList: this.tagGenerator(100)
        }
        // if (window.performance) {
        //     if (performance.navigation.type === 1) {
        //         //alert("This page is reloaded");
        //         //this.forceUpdate()
        //         this.redirectToAPage();
        //
        //     }
        // }
    }

    // redirectToAPage() {
    //
    //     //alert(window.location.pathname);
    //     if(window.location.pathname === "/profile"){
    //         return(
    //             <Redirect to="/profile"/>
    //         );
    //     }
    //     if(window.location.pathname === "/home"){
    //         return(
    //             <Redirect to="/home"/>
    //         );
    //     }
    // }

    makeComment(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    commentGenerator(numberOfPost) {
        let tempCommentList = {}
        for (let i = 0; i < numberOfPost; i++) {
            let tempArray = [...Array(1 + Math.floor(Math.random() * 5))].map(() => this.makeComment(1 + Math.floor(Math.random() * 20)));
            tempCommentList["input" + i] = tempArray;
        }
        return tempCommentList;
    }

    tagGenerator(numberOfPost) {
        let tempTagList = {}
        for (let i = 0; i < numberOfPost; i++) {
            let tempArray = [...Array(1 + Math.floor(Math.random() * 5))].map(() =>"#" + this.makeComment(1 + Math.floor(Math.random() * 20)));
            tempTagList["input" + i] = tempArray;
        }
        return tempTagList;
    }

    componentDidMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let tempPostDetails = JSON.parse(this.responseText).data;
                let counter = 1;
                let tempTags = {}
                tempPostDetails.forEach(Post => {
                    let tags = [];
                    let caption = "";
                    let caption_split = Post.caption.split(" ");
                    caption_split.forEach(a => {
                        if (a.includes("#")) {
                            tags.push(a)
                        } else {
                            caption = caption + a + " ";
                        }
                    })
                    Post.caption = caption;
                    tempTags["tag" + counter] = tags;
                    counter++;
                })
                let tempCommentList = that.commentGenerator(tempPostDetails.length)
                that.setState({
                    posts: tempPostDetails,
                    tagsList: tempTags,
                    commentsList: tempCommentList
                });
            }
        });
        xhr.open("GET", this.state.baseUrl + this.state.accessToken);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    fetchPostDetails = (id) => {
        let postData = null;
        let xhrPost = new XMLHttpRequest();
        let tempPostDetails = this.state.tempList
        xhrPost.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                tempPostDetails.push(JSON.parse(this.responseText))
            }
        })
        xhrPost.open("GET", this.state.postUrl.url1 + id + this.state.postUrl.url2 + this.state.accessToken);
        xhrPost.setRequestHeader("Cache-Control", "no-cache");
        xhrPost.send(postData);
        return tempPostDetails
    }

    filterCaptionsBySearch = (str) => {
        this.setState({filteredPosts: this.state.posts})
        str.trim().length > 0 ? this.setState({showFilteredPosts: true}) : this.setState({showFilteredPosts: false})
        let temp = this.state.posts;
        let filtered = temp.filter(post => {
            return post.caption.toLowerCase().includes(str.trim().toLowerCase())
        })
        this.setState({filteredPosts: filtered})
    }

    updatedLikeDetails = (id) => {
        let temp = this.state.likeDetails
        temp[id] ? temp[id] = false : temp[id] = true
        this.setState({likeDetails: temp})
        this.setState({usernameSet: true})
    }

    // setUsername = (name) => {
    //     this.setState({username: name})
    //     this.setState({usernameSet: true})
    // }

    addNewComments = (num, comment) => {
        let temp = this.state.commentsList
        temp[Object.keys(temp)[num]].push(comment)
        this.setState({commentsList: temp})
    }

    // thisIsATest = () => {
    //
    // }
    render() {
        console.log(this.state.commentsList)
        let postDetails = []
        this.state.posts.forEach(post => {
            postDetails = this.fetchPostDetails(post.id)

        })

        return (
            <Router>
                <div>

                    <Route exact path='/'>
                        <Login accessToken={this.state.accessToken}/>
                    </Route>
                    <Route exact path={'/home'}>
                        <Home loggedIn={this.state.loggedIn}
                              tagsList={this.state.tagsList}
                              commentsList={this.state.commentsList}
                              addNewComments={this.addNewComments}
                              likeDetails={this.state.likeDetails}
                              updatedLikeDetails={this.updatedLikeDetails}
                              showFilteredPosts={this.state.showFilteredPosts}
                              filteredPosts={this.state.filteredPosts}
                              posts={this.state.posts}
                              filterCaptionsBySearch={this.filterCaptionsBySearch}
                              postDetails={postDetails}
                              likeList={this.state.likeList}/>
                    </Route>
                    <Route exact path={'/profile'}>
                        <Profile loggedIn={this.state.loggedIn}
                                 tagsList={this.state.tagsList}
                                 commentsList={this.state.commentsList}
                                 addNewComments={this.addNewComments}
                                 likeDetails={this.state.likeDetails}
                                 updatedLikeDetails={this.updatedLikeDetails}
                                 posts={this.state.posts}
                                 postDetails={postDetails}
                                 likeList={this.state.likeList}
                                 followedBy={this.state.followedBy}
                                 follows={this.state.follows}/>
                    </Route>
                </div>
            </Router>
        )
    }
}

export default Controller;