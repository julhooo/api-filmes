'use client';

import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';

export default function ListaFilmes() {
    const [filmes, setFilmes] = useState([]);

    useEffect(() =>{
        getFilmes();
    }, []);

    const getFilmes = () => {
        axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: '',
                language: 'pt-BR'
            }
        }).then(response => {
            console.log(response);
        })
    }


    return (
        <ul className="lista-filmes">
            <li></li>
        </ul>
    )
}