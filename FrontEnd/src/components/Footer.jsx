import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  const styles = {
    footer: {
      background: "linear-gradient(to right, #991b1b, #facc15, #22c55e)",
      color: "#ffffff",
      paddingTop: "1.5rem", // Reduced from 3rem
      paddingBottom: "1rem", // Reduced from 2rem
      position: "relative",
      marginTop: "auto",
    },
    wave: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "40px", // Reduced from 80px
      background: "white",
      borderBottomRightRadius: "100% 20%",
      borderBottomLeftRadius: "100% 20%",
      zIndex: 1,
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      padding: "0 1rem", // slightly reduced horizontal padding
      zIndex: 2,
      position: "relative",
    },
    column: {
      flex: "1 1 200px",
      marginBottom: "1rem", // Reduced from 1.5rem
    },
    heading: {
      fontWeight: "bold",
      marginBottom: "0.5rem", // Reduced from 1rem
    },
    link: {
      color: "#ffffff",
      display: "block",
      marginBottom: "0.25rem", // Reduced spacing between links
      textDecoration: "none",
      fontSize: "0.85rem", // Slightly smaller
    },
    bottomBar: {
      marginTop: "1rem", // Reduced from 2rem
      textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      paddingTop: "0.5rem", // Reduced from 1rem
      fontSize: "0.75rem", // Slightly smaller text
    },
    iconBar: {
      marginTop: "0.5rem", // Reduced
      display: "flex",
      justifyContent: "center",
      gap: "0.75rem", // slightly reduced gap
    },
    icon: {
      width: "20px", // Slightly smaller
      height: "20px",
      filter: "brightness(0) invert(1)",
    },
    button: {
      marginTop: "0.25rem", // Reduced
      padding: "0.4rem 0.75rem",
      backgroundColor: "#fff",
      color: "#16a34a",
      fontWeight: "bold",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.wave}></div>

      <div style={styles.container}>
        {/* Column 1 */}
        <div style={styles.column}>
          <div style={styles.heading}>LOGO</div>
          <a href="#" style={styles.link}>Start</a>
          <a href="#" style={styles.link}>Documentation</a>
          <a href="#" style={styles.link}>Installation</a>
        </div>

        {/* Column 2 */}
        <div style={styles.column}>
          <div style={styles.heading}>COMPANY</div>
          <a href="#" style={styles.link}>Contact</a>
          <a href="#" style={styles.link}>News</a>
          <a href="#" style={styles.link}>Careers</a>
          <div style={styles.heading}>LEGAL</div>
          <a href="#" style={styles.link}>Privacy Notice</a>
          <a href="#" style={styles.link}>Terms of Use</a>
        </div>

        {/* Column 3 */}
        <div style={styles.column}>
          <div style={styles.heading}>QUICK LINKS</div>
          <a href="#" style={styles.link}>Support Center</a>
          <a href="#" style={styles.link}>Service Status</a>
          <a href="#" style={styles.link}>Security</a>
          <a href="#" style={styles.link}>Blog</a>
          <a href="#" style={styles.link}>Customers</a>
          <a href="#" style={styles.link}>Reviews</a>
        </div>

        {/* Column 4 */}
        <div style={styles.column}>
          <div style={styles.heading}>LET'S CHAT</div>
          <div>Have a support question?</div>
          <button style={styles.button}>GET IN TOUCH</button>
          <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>YOU CALL US</div>
          <div>0124-64XXXX</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.iconBar}>
          <img style={styles.icon} src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg" alt="LinkedIn" />
          <img style={styles.icon} src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg" alt="Twitter" />
          <img style={styles.icon} src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg" alt="YouTube" />
          <img style={styles.icon} src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg" alt="GitHub" />
        </div>
        <p>©{year} | Designed By: Pooja Nahella. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
