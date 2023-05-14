import React, { useState, useEffect } from 'react';
import styles from "./Filter.module.css";
import Select from "react-select";
import axios from "axios";
import useDebounce from '../../../../hooks/useDebounce';


function FilterMenu({ filterURL }) {
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedType, setSelectedType] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('https://api.anilibria.tv/v3.0/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get('https://api.anilibria.tv/v3.0/years');
                setYears(response.data);
            } catch (error) {
                console.error('Failed to fetch years:', error);
            }
        };

        fetchYears();
    }, []);

    const handleSearch = (selectedGenres, selectedYears, selectedType) => {
        let url = 'https://api.anilibria.tv/v3.0/title/search?';

        if (selectedGenres.length > 0) {
            const genreString = selectedGenres.map(genre => genre.value).join(',');
            url += `genres=${genreString}&`;
        } 

        if (selectedYears.length > 0) {
            const yearString = selectedYears.map(year => year.value).join(',');
            url += `year=${yearString}&`;
        }

        if (selectedType.length > 0) {
            const typeString = selectedType.map(type => type.value).join(',');
            url += `type=${typeString}&`;
        }

        filterURL(url);
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#262626',
            color: '#FFFFFF',
            border: state.isFocused ? '2px solid #1d1d1d' : '2px solid #1d1d1d',
            boxShadow: state.isFocused ? 'none' : 'none',
            '&:hover': {
                border: state.isFocused ? '2px solid #1d1d1d' : '2px solid #1d1d1d'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#1d1d1d' : '#262626',
            color: '#FFFFFF',
            '&:hover': {
                backgroundColor: '#1d1d1d'
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#1d1d1d',
        }),
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: data.color,
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#262626',
            marginTop: '2px',
            borderRadius: '4px'
        })
    };

    const debouncedFilter = useDebounce(({ genres, years, type }) => {
        console.log(genres, years, type)
        handleSearch(genres, years, type);
    }, 500);

    return (
        <div className={styles["selector-row"]}>
            <Select
                placeholder="Жанры"
                className={styles.selector}
                isMulti
                name="title-genre"
                classNamePrefix="select"
                styles={customStyles}
                isSearchable={false}
                closeMenuOnSelect={false}
                options={genres.map(genre => ({ value: genre, label: genre }))}
                onChange={selectedGenres => {
                    setSelectedGenres(selectedGenres);
                    debouncedFilter({
                        genres: selectedGenres,
                        years: selectedYears,
                        type: selectedType
                    });
                }}
            />
            <Select
                placeholder="Год выхода"
                className={styles.selector}
                isMulti
                name="title-year"
                classNamePrefix="select"
                styles={customStyles}
                isSearchable={false}
                closeMenuOnSelect={false}
                options={years.map(year => ({ value: year, label: year.toString() })).reverse()}
                onChange={selectedYears => {
                    setSelectedYears(selectedYears);
                    debouncedFilter({
                        genres: selectedGenres,
                        years: selectedYears,
                        type: selectedType
                    });
                }}
            />
            <Select
                placeholder="Тип"
                className={styles.selector}
                isMulti
                name="title-type"
                classNamePrefix="select"
                styles={customStyles}
                isSearchable={false}
                closeMenuOnSelect={false}
                options={[
                    { value: 0, label: "Фильм" },
                    { value: 1, label: "TV" },
                    { value: 2, label: "OVA" },
                    { value: 3, label: "ONA" },
                    { value: 4, label: "Спешил" },
                    { value: 5, label: "WEB" },
                ]}
                onChange={selectedType => {
                    setSelectedType(selectedType);
                    debouncedFilter({
                        genres: selectedGenres,
                        years: selectedYears,
                        type: selectedType
                    });
                }}
            />
        </div>
    );
}

export default FilterMenu;