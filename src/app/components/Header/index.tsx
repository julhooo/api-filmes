'use client';

import { useRouter } from 'next/navigation';
import './index.scss';

export default function Header() {
    // Para mexer com as rotas
    const router = useRouter();

    // Quando clicar no título da página -> retorna a home
    const handleBackClick = () => {
        router.push('/');
    };

    // Ir para watchlist
    const handleWatchlistClick = () => {
        router.push('/watchlist');
    };

    return (
        <header className="header">
            <h1 className="titulo" onClick={handleBackClick}>
                suaWatchList*
            </h1>

            <button
                className="botao-watchlist-header"
                onClick={handleWatchlistClick}
            >
                Watchlist
            </button>
        </header>
    );
}