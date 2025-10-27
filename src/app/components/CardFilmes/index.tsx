import { FilmeType } from '@/app/types/movie';
import './index.scss';

export interface Props{
    filme: FilmeType
    selecionado: boolean
    onToggle: (movieid: number) => void;
}

export default function CardFilmes(props: Props) {
    const filme = props.filme;

    const handleClick = () => {
        props.onToggle(filme.id);
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
                <p className='filme-descricao'>
                    {filme.overview}
                </p>
            </div>
        </li>
    )
}