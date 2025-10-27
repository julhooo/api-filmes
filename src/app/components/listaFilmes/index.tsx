'use client';

import { useEffect, useState, useRef} from 'react';
import './index.scss';
import axios from 'axios';
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '../CardFilmes';
import { SlMagnifier } from "react-icons/sl";


export default function ListaFilmes() {
    const [filmes, setFilmes] = useState<FilmeType[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selecionados, setSelecionados] = useState<number[]>([]);
    const [query, setQuery] = useState('');
    const filmesUnicos = Array.from(new Map(filmes.map(f => [f.id, f])).values());

    useEffect(() =>{
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

    const toggleSelecionado = (filmeId: number) => {
        if (selecionados.includes(filmeId)) {
            setSelecionados(prev => prev.filter(id => id !== filmeId));
        } else {
        if (selecionados.length == 5) {
            console.log('Limite de filmes atingido!');
            return;
        }
        setSelecionados(prev => [...prev, filmeId]);
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
            {selecionados.length > 0 && (
                <div className="selecionados-container">
                {selecionados.map(id => {
                        const filme = filmes.find(f => f.id === id);
                        if (!filme) return null;
                        return (
                            <div 
                                key={filme.id} 
                                className="selecionado-poster" 
                                onClick={() => toggleSelecionado(filme.id)}
                                title="Clique para remover"
                            >
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${filme.poster_path}`} 
                                    alt={filme.title} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="barra-busca">
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
                    selecionado={selecionados.includes(filme.id)}
                    onToggle={()=> toggleSelecionado(filme.id)}
                />
            ))}
            </ul>
            {loading && <p> ... </p>}
        </div>
    );
}