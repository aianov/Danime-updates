import React from 'react';
import TitleList from "../TitleList/TitleList";
import styles from "./Favorites.module.css";
import notAuth from "../../images/notAutorization.png";
import {Link} from "react-router-dom";

const Favorites = () => {
    return (
        localStorage.getItem('userKey') !== null ?
            <TitleList /> :
            <div className={styles.container}>
                <img src={notAuth} alt="not authorized" />
                <div className={styles.text}>
                    <h2 className={styles.heading}>Вы не авторизованы</h2>
                    <p className={styles.text}>Авторизация позволяет сохранять данные и предоставлять персонализированный контент.</p>
                </div>
                <Link to="/account">
                    <button className={styles.button}>
                        Авторизоваться
                    </button>
                </Link>
            </div>

    );
};

export default Favorites;
