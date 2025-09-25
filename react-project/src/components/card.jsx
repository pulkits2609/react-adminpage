import profilePic from './assets/ue5logo.png'
import styles from './card.module.css'

function Card(){
    return(
        <div className={styles.card}>
            <img src={profilePic} alt="hehehe" className={styles.card_Image}/>
            <h2 className={styles.card_title}>Pulkit Sharma</h2>
            <p className={styles.card_text}>Like to Create Games using Unreal engine</p>
        </div>
    );
}

export default Card