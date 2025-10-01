import Game from '@/components/Game';
import styles from './home.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Game />
    </div>
  );
}
