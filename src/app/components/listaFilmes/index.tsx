'use client';

import { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '../CardFilmes';

export default function ListaFilmes() {
    const [filmes, setFilmes] = useState<FilmeType[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        getFilmes(page);
    }, [page]);

    const getFilmes = async (pagina: number) => {

        setLoading(true);
        await axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: '',
                language: 'pt-BR',
                page: pagina
            }
        }).then(response => {
            setFilmes((prev) => [...prev, ...response.data.results]);
        });

        setLoading(false);
    }
 
    useEffect(() =>{
        function handleScroll(){
            if(
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading
            ){
                setPage((prev) => prev + 1);
            }
        }

            window.addEventListener("scroll", handleScroll);
            return() => window.removeEventListener("scroll", handleScroll);
        }, [loading]);


    return (
        <ul className="lista-filmes">
            {filmes.map((filme) =>
                <CardFilmes
                    key={filme.id}
                    filme={filme}
                />
            )}
            {loading && <p> ... </p>}
        </ul>
    )
}