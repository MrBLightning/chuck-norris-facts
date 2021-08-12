import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        justifyContent: "center",
        textAlign: "center",
        height: "300px",
        minWidth:'800px'
    },
    header: {
        position: "center top",
    },
    headerImg: {
        width: '100%',
        height: "200px",
    },
    whiteCircle: {
        position: "absolute",
        top:'70px',
        '@media screen and (min-width: 0px) and (max-width: 800px)': {
            left:'270px',
        },
        '@media screen and (min-width: 800px) and (max-width: 1100px)': {
            left:'38%',
        },
        '@media screen and (min-width: 1100px) and (max-width: 1400px)': {
            left:'40%',
        },
        '@media screen and (min-width: 1400px)': {
            left:'42%',
        },
        zIndex: 10,
        backgroundColor: "#ffffff",
        borderRadius: '50%',
        width: '250px',
        height: '250px',
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    },
    logoImg:{
        width:'300px',
        paddingTop:'40px',
        marginLeft:'-15px'
    },
}));

const Header = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.header}><img src="/header.jpg" alt="" className={classes.headerImg} />
            </div>
            <div className={classes.whiteCircle}>
                <img className={classes.logoImg} src='https://api.chucknorris.io/img/chucknorris_logo_coloured_small@2x.png' alt='chucknorris.io logo' />
            </div>
        </div>
    );
}

export default Header;