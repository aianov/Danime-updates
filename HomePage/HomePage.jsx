import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo" />
                </div>
                <nav className={styles.links}>
                    <Link to="/anime/list">Список</Link>
                    <Link to="/anime/schedule">Расписание</Link>
                    <Link to="/anime/random">Случайное</Link>
                </nav>
            </header>
            <div className={styles.hero}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Добро пожаловать в мир аниме</h1>
                    <p className={styles.subtitle}>Лучшие сериалы и фильмы аниме ждут вас</p>
                    <Link to="/anime/list" className={styles.watchButton}>Смотреть</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
