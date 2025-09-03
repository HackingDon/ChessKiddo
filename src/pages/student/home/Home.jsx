import Tournaments from '../../components/Tournaments';
import './home.css'

const Home = () => {
  return (
    <>
      <h3 className="mt-4 ps-5">Learn, Play, and Grow with Chess:</h3>
      <p className="mt-3 fs-5 ps-5 pe-5 ">
        Chess is one of the oldest and most strategic board games in the world.
        It is played between two players, each controlling sixteen pieces: one
        king, one queen, two rooks, two bishops, two knights, and eight pawns.
        The goal of the game is to checkmate your opponent’s king, which means
        putting the king under attack in a way that it cannot escape. Unlike
        many other games, chess is not based on luck—it is a game of pure skill,
        planning, and foresight. Learning chess helps improve concentration,
        memory, and problem-solving skills. Beginners usually start by learning
        how each piece moves: pawns move forward but capture diagonally, rooks
        move straight in lines, bishops move diagonally, knights jump in an
        L-shape, the queen moves in any direction, and the king moves only one
        square at a time. Understanding these movements is the foundation of the
        game. As you practice, you will discover common strategies and opening
        moves that help set up your position. Simple principles like controlling
        the center of the board, developing your pieces quickly, and protecting
        your king with castling can make a big difference in your games. Over
        time, players also learn tactics such as forks, pins, and discovered
        attacks that can turn the tide of a match. Most importantly, chess
        teaches patience and critical thinking. Every move you make has
        consequences, and good players learn to think several steps ahead. With
        regular practice, solving chess puzzles, and playing against others,
        learners can steadily improve their skills and enjoy the beauty of this
        timeless game.
      </p>
      <h3 className="mt-4 ps-5">Vision:</h3>
      <ul className="list-vision">
        <li>To inspire a global community of learners by making chess accessible, enjoyable, and a tool for intellectual growth.</li>
        <li>To nurture future champions by promoting chess as a lifelong skill that develops critical thinking, creativity, and sportsmanship.</li>
        <li>To be a leading chess organization recognized for empowering learners of all ages through the beauty and strategy of the game.</li>
      </ul>
      <h3 className="mt-4 ps-5">Mission:</h3>
      <ul className="list-vision">
        <li>Our mission is to create a supportive environment where learners of all levels can explore, practice, and master chess.</li>
        <li>We aim to teach chess not only as a game but as a way to improve focus, problem-solving, and decision-making skills.</li>
        <li>Through training, competitions, and community events, we strive to make chess engaging, inclusive, and inspiring for everyone.</li>
      </ul>
      <h3 className='ps-5'>Upcoming Tournaments:</h3>
      <Tournaments/>
    </>
  );
};

export default Home;
