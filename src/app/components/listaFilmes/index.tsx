'use client';

import { useEffect, useState, useRef } from 'react';
import './index.scss';
// Consumo da API 
import axios from 'axios';
// Tipando o objeto filme para não dar erro no typescript
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '../CardFilmes';
import { SlMagnifier } from "react-icons/sl";
import { useRouter } from 'next/navigation';
import Header from '../Header';
// Mostra os filmes selecionados
import Selecionados from '../SelecionadosContainer';

export default function ListaFilmes() {

    // Atualizar os filmes apresentados
    const [filmes, setFilmes] = useState<FilmeType[]>([]);
    // A API divide o retorno dos filmes através de páginas
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    // Pesquisa de filme pelo título
    const [query, setQuery] = useState('');
    // A API estava retornando o mesmo filme, aqui verifica os ids, não permitindo duplicatas
    const filmesUnicos = Array.from(new Map(filmes.map(f => [f.id, f])).values());
    const router = useRouter();
    // Necessário para não perder os filmes selecionados ao navegar pelas páginas, utiliza localstorage
    const [selecionados, setSelecionados] = useState<FilmeType[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('filmesSelecionados');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Sempre que a página ou a pesquisa mudarem, faz get de filmes
    useEffect(() => {
        getFilmes(page, query);
    }, [page, query]);

    const getFilmes = async (pagina: number, pesquisa = '') => {
        try {
            setLoading(true);
            // Vê se o usuário digitou algo, se sim, puxa a url de pesquisa, se não, vai para a url padrão
            const url = pesquisa ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie';
            // O await espera os resultados chegarem para continuar
            const response = await axios.get<{ results: FilmeType[] }>(url, {
                params: {
                    api_key: '',
                    language: 'pt-BR',
                    page: pagina,
                    // Pode ou não ter pesquisa
                    query: pesquisa || undefined,
                },
            });
            setFilmes(prev => {
                // Se a página for a primeira, substitui os filmes apresentados, se não, apenas adciona filmes ao rolamento,
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

    // Combinado com a linha 29 para guardar os selecionados
    useEffect(() => {
        localStorage.setItem('filmesSelecionados', JSON.stringify(selecionados));
    }, [selecionados]);

    // Se o usuário chegou ao fim da página, aumenta em 1, puxando o get da linha 38
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


    // Verifica se o filme clicado já estava selecionado, se sim, tira a seleção.
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

    // Quando o usuário coloca pesquisa e pressiona ENTER 
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setPage(1);
            getFilmes(1, query);
        }
    }

    // Apertou o 'X' na barra de pesquisa -> retorna para página inicial e limpa barra de pesquisa
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
            
            {/* Chama a função card para cara filme, junto ao seu id*/}
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