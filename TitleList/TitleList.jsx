import React, { useEffect, useState } from "react";
import styles from "./TitleList.module.css";
import loadingStyles from "../TakeRandomAnime/TakeRandomAnime.module.css";
import axios from "axios";
import NewHeader from "../Headers/NewHeader/NewHeader";
import { Link } from "react-router-dom";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";
import './CardSkeleton.css'

function TitleList() {
    const [titleList, setTitleList] = useState(null);
    const [limit, setLimit] = useState(20);
    const [url, setURL] = useState(`https://api.anilibria.tv/v3/title/updates?`);
    const [loading, setLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false)
    const [favourites, setFavourites] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Устанавливаем состояние загрузки
                let apiUrl = url;
                if (favourites) {
                    setLimit(-1);
                    apiUrl = `https://api.anilibria.tv/v3/user/favorites?session=${localStorage.getItem(
                        "userKey"
                    )}`;
                }
                const { data } = await axios.get(
                    `${apiUrl}&filter=id,code,names,genres&limit=${limit}`
                );
                setTitleList(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Сбрасываем состояние загрузки
            }
        };

        fetchData();
    }, [url, limit, favourites]);

    // Добавляем обработчик события scroll
    useEffect(() => {

        // Функция, которая будет загружать дополнительные элементы
        const loadMore = () => {
            // Если уже идет загрузка, то ничего не делаем
            if (loading || favourites) return;

            // Если мы почти достигли конца страницы, то увеличиваем лимит на 20 и обновляем состояние
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                setLimit((limit) => limit + 20);
            }
        };


        window.addEventListener('scroll', loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [favourites, loading]);


    if (!titleList) {
        return <div className={loadingStyles["loading-container"]}><h2>Loading...</h2></div>;
    }

    const searching = (searchText) => {
        if (searchText.length > 0) {
            setURL(`https://api.anilibria.tv/v3/title/search?search=${searchText}&`);
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
            return;
        }
        if (favourites) {
            const savedUserKey = localStorage.getItem('userKey');
            setURL(`https://api.anilibria.tv/v3/user/favorites?session=${savedUserKey}?`);
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
            return;
        }
        setURL(`https://api.anilibria.tv/v3/title/updates?`);
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }
    const filter = (filterUrl) => {
        if (filterUrl !== 'https://api.anilibria.tv/v3.0/title/search?') {
            setLimit(20);
            setURL(filterUrl);
        }
        else if (url !== 'https://api.anilibria.tv/v3/title/updates?') {
            setURL(`https://api.anilibria.tv/v3/title/updates?`);
        }
    }
    return (
        <div>
            <NewHeader searchText={searching} isTitle={!!favourites} onFilter={filter} setIsLoading={setIsLoading} setFavourites={setFavourites} />
            <div className={styles["title-list"]}>
                {favourites ?
                    titleList.list.map((title) => {
                        const path = `/anime/${title.code}`;
                        return (
                            <Link
                                to={path}
                                className={styles.title}
                                key={title.code}
                                data-description={title.description}
                            >
                                <div className={styles["title-name"]}>{title.names.ru}</div>
                                <div className={styles.genres}>{title.genres.join(", ")}</div>
                            </Link>
                        );
                    }).slice(0, limit)
                    :
                    titleList.list.slice().slice(0, limit).map((title) => {
                        const path = `/anime/${title.code}`;
                        return (isLoading ?
                            <div className='anime-skeleton'>
                                <div className="animeposter-skeleton">
                                    <Skeleton className="animeposter-skeleton" />
                                </div>
                                <div className="anime-text1-skeleton">
                                    <Skeleton />
                                </div>
                                <div className="anime-text2-skeleton">
                                    <Skeleton />
                                </div>
                            </div>
                            :
                            <Link
                                to={path}
                                className={styles.title}
                                key={title.code}
                                data-description={title.description}
                            >
                                <img
                                    className={styles.poster}
                                    src={`https://api.litelibria.com/posters/${title.id}.webp`}
                                    alt="poster"
                                />
                                <div className={styles["title-name"]}>{title.names.ru}</div>
                                <div className={styles.genres}>{title.genres.join(", ")}</div>
                            </Link>)
                    })
                }
            </div>
        </div>
    );

}

export default TitleList;