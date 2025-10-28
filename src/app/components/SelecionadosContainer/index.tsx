'use client';

import './index.scss';
import { FilmeType } from '@/app/types/movie';

type SelecionadosProps = {
    selecionados: FilmeType[];
    toggleSelecionado: (filme: FilmeType) => void;
    limparSelecionados: () => void;
};

export default function Selecionados({ selecionados, toggleSelecionado, limparSelecionados }: SelecionadosProps) {
    if (selecionados.length === 0) return null;

    const handleAdicionarWatchlist = () => {
        const watchlist: FilmeType[] = JSON.parse(localStorage.getItem('filmesWatchlist') || '[]');
        const novos = selecionados.filter(f => !watchlist.some(w => w.id === f.id));
        localStorage.setItem('filmesWatchlist', JSON.stringify([...watchlist, ...novos]));
        limparSelecionados();
    };

    return (
        <div className="selecionados-container">
            {selecionados.map(filme => (
                <div
                    key={filme.id}
                    className="selecionado-poster"
                    onClick={() => toggleSelecionado(filme)}
                    title="Clique para remover"
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w200${filme.poster_path}`}
                        alt={filme.title}
                    />
                </div>
            ))}
            <button className="botao-watchlist" onClick={handleAdicionarWatchlist}>
                Adicionar à Watchlist
            </button>
        </div>
    );
}