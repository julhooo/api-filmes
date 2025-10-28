'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '@/app/components/CardFilmes';
import './index.scss';
import Header from '../components/Header';
import Selecionados from '../components/SelecionadosContainer';

export default function Popular() {

    const [filmes, setFilmes] = useState<FilmeType[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selecionados, setSelecionados] = useState<FilmeType[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('filmesSelecionados');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const getFilmesPopulares = async (pagina: number = 1) => {
        setLoading(true);
        try {
            const url = 'https://api.themoviedb.org/3/trending/movie/day';
            const params = {
                api_key: '',
                language: 'pt-BR',
                page: pagina,
            };
            const response = await axios.get<{ results: FilmeType[] }>(url, { params });
            setFilmes(prev => pagina === 1 ? response.data.results : [...prev, ...response.data.results]);
        } catch (err) {
            console.error('Erro ao buscar filmes populares:', err);
        } finally {
            setLoading(false);
        }
    };

    const filmesUnicos = Array.from(new Map(filmes.map(f => [f.id, f])).values());

    const toggleSelecionado = (filme: FilmeType) => {
        if (selecionados.some(s => s.id === filme.id)) {
            setSelecionados(prev => prev.filter(s => s.id !== filme.id));
        } else {
            if (selecionados.length === 5) {
                console.log('Limite de filmes atingido!');
                return;
            }
            setSelecionados(prev => [...prev, filme]);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    useEffect(() => {
        getFilmesPopulares(page);
    }, [page]);

    useEffect(() => {
        localStorage.setItem('filmesSelecionados', JSON.stringify(selecionados));
    }, [selecionados]);

    return (
        <div>
            <Header />
            <Selecionados
                selecionados={selecionados}
                toggleSelecionado={toggleSelecionado}
                limparSelecionados={() => setSelecionados([])}
            />

            <ul className="lista-filmes">
                {filmesUnicos.map(filme => (
                    <CardFilmes
                        key={filme.id}
                        filme={filme}
                        selecionado={selecionados.some(s => s.id === filme.id)}
                        onToggle={() => toggleSelecionado(filme)}
                    />
                ))}
            </ul>

            {loading && <p>Carregando...</p>}

        </div>
    );
}