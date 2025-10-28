'use client';

import { useEffect, useState, useRef } from 'react';
import './index.scss';
import axios from 'axios';
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '../CardFilmes';
import { SlMagnifier } from "react-icons/sl";
import { useRouter } from 'next/navigation';
import Header from '../Header';
import Selecionados from '../SelecionadosContainer';

export default function ListaFilmes() {

    const [filmes, setFilmes] = useState<FilmeType[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const filmesUnicos = Array.from(new Map(filmes.map(f => [f.id, f])).values());
    const router = useRouter();
    const [selecionados, setSelecionados] = useState<FilmeType[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('filmesSelecionados');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        getFilmes(page, query);
    }, [page, query]);

    const getFilmes = async (pagina: number, pesquisa = '') => {
        try {
            setLoading(true);
            const url = pesquisa ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie';
            const response = await axios.get<{ results: FilmeType[] }>(url, {
                params: {
                    api_key: '',
                    language: 'pt-BR',
                    page: pagina,
                    query: pesquisa || undefined,
                },
            });
            setFilmes(prev => {
                const novos = pagina === 1 ? response.data.results : [...prev, ...response.data.results];
                const unicos = Array.from(new Map(novos.map(f => [f.id, f])).values());
                return unicos;
            });
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem('filmesSelecionados', JSON.stringify(selecionados));
    }, [selecionados]);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading
            ) {
                setPage((prev) => prev + 1);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    useEffect(() => {
        localStorage.setItem('filmesSelecionados', JSON.stringify(selecionados));
    }, [selecionados]);

    const toggleSelecionado = (filme: FilmeType) => {
        if (selecionados.some(s => s.id === filme.id)) {
            setSelecionados(prev => prev.filter(s => s.id !== filme.id));
        } else {
            if (selecionados.length == 5) {
                console.log('Limite de filmes atingido!');
                return;
            }
            setSelecionados(prev => [...prev, filme]);
        }

    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setPage(1);
            getFilmes(1, query);
        }
    }

    const handleLimpar = () => {
        setQuery('');
        setPage(1);
        getFilmes(1, '');
    }

    return (
       <div>
            <Header />
            <Selecionados
                selecionados={selecionados}
                toggleSelecionado={toggleSelecionado}
                limparSelecionados={() => setSelecionados([])}
            />

            <div className="barra-busca">

                <button
                    className="botao-embreve"
                    onClick={() => {
                        router.push('/embreve')
                    }}
                >
                    Em breve
                </button>

                <button
                    className="botao-populares"
                    onClick={() => {
                        router.push('/populares')
                    }}
                >
                    Populares
                </button>

                <input
                    type="text"
                    placeholder="Buscar pelo título"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleEnter}
                />

                {query && (
                    <button className="botao-fechar" onClick={handleLimpar}>
                        X
                    </button>
                )}

                <button
                    className="botao-pesquisar"
                    onClick={() => { setPage(1); getFilmes(1, query); }}
                >
                    <SlMagnifier />
                </button>

            </div>

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

            {loading && <p> ... </p>}

        </div> 
    );
}