import React, { Component } from 'react';
import Login from './login/Login';
import Home from './home/Home';
//import Profile from './profile/Profile';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
            accessToken: "IGQVJYZATZAfRXczakRQaG9aNUZACVnFnQzNKRGdhaTJCdGpud0JZAMVRLekpDZA3RtbkJFMm5SaDBhOW5ZAd2JPbFpLNWtOWGtLSWJ3TVp3X2Jyd3NlZA2RoNmxzSjRPMDVXd1ZARbHZAFY2lqSEVhSW5LN2JaVzVqUTlTLUhKbGFZA",
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
            commentsList: {
                input1: ["Taken during Christmas", "2 years ago"],
                input2: ["Such an old picture", "Lens flares?"],
                input3: ["Sweetest thing on the planet!", "Ruby"],
                input4: ["Taken 1 year ago", "Also taken during Christmas time"],
                input5: ["Rocky", "This fellow is a survivor"],
                input6: ["Yes Christmas time again", "and I like taking pictures of lights"],
                input7: ["Credits to Matty for the picture", "Taken at the Yelagiri Peak"],
                input8: ["Taken on my birthday", "Last year"]
            },
            tagsList: {
                input1: ["#Christmas", "#Candles"],
                input2: ["#Lights", "#LensFlares"],
                input3: ["#Lab", "#Ruby"],
                input4: ["#Christmas", "#Candles"],
                input5: ["#Rocky", "#Survivor"],
                input6: ["#Christmas", "#Lights"],
                input7: ["#Trek", "#Yelagiri"],
                input8: ["#Birthday", "#2019"]
            }
        }
    }

    componentDidMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ posts: JSON.parse(this.responseText).data });
            }
        });
        xhr.open("GET", this.state.baseUrl + this.state.accessToken);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    getPostDetailsById = (id) => {
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

    filterCaptions = (str) => {
        this.setState({ filteredPosts: this.state.posts })
        str.trim().length > 0 ? this.setState({ showFilteredPosts: true }) : this.setState({ showFilteredPosts: false })
        let temp = this.state.posts;
        let filtered = temp.filter(post => {
            return post.caption.toLowerCase().includes(str.trim().toLowerCase())
        })
        this.setState({ filteredPosts: filtered })
    }

    updatelikeDetails = (id) => {
        let temp = this.state.likeDetails
        temp[id] ? temp[id] = false : temp[id] = true
        this.setState({ likeDetails: temp })
        this.setState({ usernameSet: true })
    }

    setUsername = (name) => {
        this.setState({ username: name })
        this.setState({ usernameSet: true })
    }

    addComments = (num, comment) => {
        let temp = this.state.commentsList
        temp[Object.keys(temp)[num]].push(comment)
        this.setState({ commentsList: temp })
    }

    render() {

        let postDetails = []
        this.state.posts.forEach(post => {
            postDetails = this.getPostDetailsById(post.id)
        })

        return (
            <Router>
                <div>
                    <Route exact path='/'>
                        <Login accessToken={this.state.accessToken} />
                    </Route>
                    <Route exact path={'/home'}>
                        <Home loggedIn={this.state.loggedIn}
                              tagsList={this.state.tagsList}
                              commentsList={this.state.commentsList}
                              addComments={this.addComments}
                              likeDetails={this.state.likeDetails}
                              updatelikeDetails={this.updatelikeDetails}
                              showFilteredPosts={this.state.showFilteredPosts}
                              filteredPosts={this.state.filteredPosts}
                              posts={this.state.posts}
                              filterCaptions={this.filterCaptions}
                              postDetails={postDetails}
                              likeList={this.state.likeList} />
                    </Route>
                </div>
            </Router>
        )
    }
}

export default Controller;