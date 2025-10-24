import { FilmeType } from '@/app/types';
import './index.scss';

export interface Props{
    filme: FilmeType
}

export default function CardFilmes(props: Props) {
    const filme = props.filme;
    return (
        <li className='card-filme'>
                    <p>
                        {filme.title}
                    </p>
                    <img 
                    src={`https://image.tmdb.org/t/p/original${filme.poster_path}`} 
                    alt="" 
                    />
                </li>
    )
}