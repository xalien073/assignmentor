// app/credits/page.js
import Link from "next/link";
import { SiMicrosoftazure } from "react-icons/si";

export default function Credits() {
    return (
      <div style={{ padding: "2em", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <h3>
          <Link href="/" style={{ marginRight: "1em", fontSize: "18px" }}>
            <SiMicrosoftazure style={{ fontSize: "24px" }} />ssignMentor
          </Link>
        </h3>
        <h1 style={{ fontSize: "2em", color: "#333", marginBottom: "0.5em" }}>
          Credits
        </h1>
        <p>
          We would like to extend our heartfelt gratitude to <strong>Hemlata Ma'am, Director of Azure at Barclays.</strong>
        </p>
        <p>
          Thank you for mentoring, guiding, and conducting sessions for us. Your efforts have been invaluable in helping us understand complex concepts and achieve our goals. 
        </p>
        <p>
          We are especially grateful that you conducted these sessions for free, dedicating your precious time to teach us despite your busy schedule.
        </p>
        <hr></hr>
        <p>
          Special thanks to <strong>Vaibhav Sir, Infrastructure Engineer at Barclays</strong>, for your sessions & expert advice. Your insights on Terraform and cloud infrastructure have been invaluable.
        </p>
        <hr></hr>
        <p>
          Special thanks to <strong>Deepak Sir, Global Head of Containerization at Barclays</strong>, and the entire volunteering team from Barclays for their unwavering support in this initiative.
        </p>
        <hr></hr>
        <p>
          Special thanks to <strong>Chetanya</strong> for managing all the Excel-related functionalities in this project. Your expertise made the critical features seamless and efficient.
        </p>
        <hr></hr>
        <p>
          Finally, we extend our sincere thanks to <strong>Kohler Co.</strong> for providing the Azure platform. Without this, the project would not have been hosted or brought to life.
        </p>
        <hr></hr>
        <p style={{ marginTop: "1em", fontStyle: "italic" }}>
          This project is a collaborative effort, made possible by the guidance, dedication, and resources provided by all mentioned contributors. Thank you!
        </p>
      </div>
    );
}
