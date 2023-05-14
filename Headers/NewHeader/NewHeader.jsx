import React, {useState, useEffect} from 'react';
import styles from "./NewHeader.module.css";
import logo from "../../../images/logo.svg";
import searchIco from "../../../images/searchIco.svg";
import {Link, useNavigate } from "react-router-dom";
import FilterMenu from "./FilterMenu/FilterMenu";
import useDebounce from '../../../hooks/useDebounce'

function NewHeader({searchText, isTitle, onFilter, setIsLoading, setFavourites}) {
    const [text, setText] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const [filterClicked, setFilterClicked] = useState(false);
    const [menuClicked, setMenuClicked] = useState(false);

    const debouncedSearch = useDebounce(searchText, 500)

    const handleKeyPress = (e) => {
        setIsLoading(true)
        setText(e.target.value);
        debouncedSearch(e.target.value)
    };

    const toggleMenu = () => {
        if (filterClicked === true) {
            toggleFilter()
            setFilterClicked(false)
        }
        setMenuClicked(!menuClicked)
        setMenuOpen(!menuOpen);
    };

    const toggleFilter = () => {
        if (menuClicked === true) {
            toggleMenu()
            setMenuClicked(false)
        }
        setFilterOpen(!filterOpen);
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const visible = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const filterHandler = (url) => {
        onFilter(url);
    };
    return (
        <div>
            <header className={`${styles.header} ${visible ? styles.visible : styles.hidden}`}>
                <div className={styles["search-box"]}>
                    <div className={styles.logo}>
                        <img src={logo} onClick={goBack} alt="logo" />
                    </div>
                    <div className={styles["header-main"]}>
                        <img className={styles["search-ico"]} src={searchIco} alt="search-ico" />
                        <input
                            className={styles["search-input"]}
                            type="text"
                            name="search-input"
                            placeholder="Найти аниме"
                            value={text}
                            onChange={handleKeyPress}
                            maxLength={40}
                        />
                        {!isTitle && (
                        <button className={styles["filter-btn"]} onClick={() => {
                            setFilterClicked(!filterClicked)
                            toggleFilter()
                        }}>Фильтры</button>
                        )}
                        <div className={styles["burger-ico"]}>
                            <input
                                id={styles["menu__toggle"]}
                                type="checkbox"
                                onChange={() => {
                                    setMenuClicked(!menuClicked)
                                    toggleMenu()
                                }}
                            />
                            <label className={styles["menu__btn"]} htmlFor={styles["menu__toggle"]}>
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                {filterOpen && (
                    <FilterMenu filterURL={filterHandler}/>
                )}
            </header>
            {menuOpen && (
                <div className={styles.menu}>
                    <Link to="/anime/list" className={styles["menu-item"]}>
                        СПИСОК
                    </Link>
                    <Link to="/anime/schedule" className={styles["menu-item"]}>
                        РАСПИСАНИЕ
                    </Link>
                    <Link to="/anime/favorites" onClick={() => localStorage.getItem('userKey') === null ? '' : setFavourites(true)} className={styles["menu-item"]}>
                        ИЗБРАННОЕ
                    </Link>
                    <Link to="/anime/random" className={styles["menu-item"]}>
                        СЛУЧАЙНОЕ
                    </Link>
                    <Link to="/support" className={styles["menu-item"]}>
                        ПОДДЕРЖКА
                    </Link>
                    <Link to="/account" className={styles["menu-item"]}>
                        ЛИЧНЫЙ КАБИНЕТ
                    </Link>
                </div>
            )}
        </div>
    );
}

export default NewHeader;