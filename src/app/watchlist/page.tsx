'use client';

import { useEffect, useState } from 'react';
import { FilmeType } from '@/app/types/movie';
import CardFilmes from '@/app/components/CardFilmes';
import Header from '../components/Header';
import Rodape from '../components/Rodape';

export default function WatchlistPage() {

    // Update da watchlist, salvando em localstorage para não se perder mesmo com a navegação de páginas
    const [watchlist, setWatchlist] = useState<FilmeType[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('filmesWatchlist');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('filmesWatchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    // Quando o usuário clicar no filme significa que já assistiu, então remove da lista
    const removeFromWatchlist = (filme: FilmeType) => {
        setWatchlist(prev => prev.filter(f => f.id !== filme.id));
    };

    return (
        <div>
            <Header />
            <ul className="lista-filmes">
                {watchlist.map(filme => (
                    <CardFilmes
                        key={filme.id}
                        filme={filme}
                        selecionado={true}
                        onToggle={() => removeFromWatchlist(filme)}
                    />
                ))}
            </ul>
            
            <Rodape />
        </div>
    );
}