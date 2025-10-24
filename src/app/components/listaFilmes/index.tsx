'use client';

import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import { FilmeType } from '@/app/types';
import CardFilmes from '../CardFilmes';

export default function ListaFilmes() {
    const [filmes, setFilmes] = useState<FilmeType[]>([]);

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
            setFilmes(response.data.results);
        })
    }


    return (
        <ul className="lista-filmes">
            {filmes.map((filme) =>
                <CardFilmes
                    key={filme.id}
                    filme={filme}
                />
            )}
        </ul>
    )
}