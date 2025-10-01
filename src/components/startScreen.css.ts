import { style } from '@vanilla-extract/css';

const container = style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '800px',
    height: '600px',
    backgroundColor: 'black',
    color: 'white',
    border: '1px solid white',
});


const title = style({
    fontSize: '72px',
    fontWeight: 'bold',
    marginBottom: '40px',
    color: '#00ff00',
    textShadow: '0 0 20px #00ff00'
});

const instructions = style({
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '20px',
    lineHeight: '1.8',
});

const startButton = style({
    padding: '15px 40px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#00ff00',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s',
    ':hover': {
    backgroundColor: '#00cc00',
    transform: 'scale(1.1)',
    },
    ':active': {
    transform: 'scale(0.95)',
    },
});

const footer = style({
    fontSize: '16px',
    color: '#888',
});

const difficultySection = style({
    marginBottom: '30px',
    textAlign: 'center',
});

const difficultyButtons = style({
    display: 'flex',
    gap: '15px',
    marginTop: '15px',
});

const difficultyButton = style({
    padding: '10px 25px',
    fontSize: '18px',
    color: 'white',
    backgroundColor: '#333',
    border: '2px solid #666',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
        backgroundColor: '#555',
        borderColor: '#888',
    },
});

const difficultyButtonActive = style({
    padding: '10px 25px',
    fontSize: '18px',
    color: 'black',
    backgroundColor: '#00ff00',
    border: '2px solid #00ff00',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
});

const styles = {
    container,
    title,
    instructions,
    startButton,
    footer,
    difficultySection,
    difficultyButtons,
    difficultyButton,
    difficultyButtonActive,
};

export default styles;
