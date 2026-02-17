import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.intro}>
      <h1>Charis</h1>

      <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
        <button className="btn-primary">Primary Action</button>
        <button className="btn-secondary">Secondary Action</button>
      </div>

    </div>
  );
}
