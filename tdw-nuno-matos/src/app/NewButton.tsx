import React from 'react';
import styles from './newButton.module.css';

const NewButton: React.FC = () => {
    return (
        <button className={styles.button}>
            New Button
        </button>
    );
};

export default NewButton;