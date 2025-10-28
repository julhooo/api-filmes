import { FilmeType } from '@/app/types/movie';
import './index.scss';

export interface Props {
    filme: FilmeType
    selecionado: boolean
    onToggle: (movie: FilmeType) => void;
}

export default function CardFilmes(props: Props) {
    const filme = props.filme;

    const handleClick = () => {
        props.onToggle(filme);
    };

    return (
        <li className={`card-filme ${props.selecionado ? 'selecionado' : ''}`} onClick={handleClick}>
            <div className='filme-poster'>
                <img
                    src={`https://image.tmdb.org/t/p/original${filme.poster_path}`}
                    alt={filme.title}
                />
            </div>
            <div className='filme-info'>
                <p className='filme-nome'>
                    {filme.title}
                </p>
            </div>
        </li>
    )
}