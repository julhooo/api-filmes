'use client';

import { useRouter } from 'next/navigation';
import './index.scss';

export default function Header() {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

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