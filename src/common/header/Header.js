import './Header.css';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import ProfilePic from '../../assets/ProfilePic.JPG';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

const Header = (props) => {

    return (
        <div className="appHeader unselectable">
            <div className="innerHeader" to="/home">
                {window.location.pathname === "/profile" ?
                    <Link to={"/home"} className="logo" style={{ textDecoration: "none" }}>
                        Image Viewer
                    </Link> :
                    <div className="logo">
                        Image Viewer
                    </div>
                }
            </div>
        </div>
    )
}

export default Header;