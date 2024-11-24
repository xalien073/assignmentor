// app/about/page.js
import Link from "next/link";
import { SiMicrosoftazure } from "react-icons/si";

export default function About() {
  return (
    <div style={{ padding: "2em", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h3>
        <Link href="/" style={{ marginRight: "1em", fontSize: "18px" }}>
        <SiMicrosoftazure style={{ fontSize: "24px" }} />ssignMentor
      </Link>
        </h3>
      <h1 style={{ fontSize: "2em", color: "#333", marginBottom: "0.5em" }}>
        About the <SiMicrosoftazure style={{ fontSize: "32px" }} />ssignMentor
      </h1>
      <p>
        This project is a tribute to<strong> Hemlata Ma'am, Director of Azure at Barclays.
        </strong>
      </p>
      <hr></hr>
      <p>
        The purpose of this project is to track the progress of students and the assignments she has provided. 
        It allows her to assess students, grade them, and keep track of their performance in real-time.
      </p>
      <hr></hr>
      <p>
        <strong>Key Features:</strong>
      </p>
      <p>
        <strong>Students can update the status of their assignments directly on the platform.</strong>
      </p>
      <p>
        <strong>Grades are assigned based on the progress and status updates provided by students.</strong>
      </p>
      <p>
        <strong>An Excel report can be generated whenever needed, summarizing assignment statuses and grades.</strong>
      </p>
      <p>
        Future plans for this project include introducing a <strong>Leaderboard</strong> to showcase top-performing students and additional features to make assessments more interactive and insightful.
      </p>
      <p>
        This project is developed using modern technologies like <strong>Azure Storage Account</strong> and <strong>Next.js 14</strong>, ensuring a robust and scalable platform.
      </p>
      <p>
      <hr></hr>
        <strong>Contributors:</strong>
      </p>
      <p>
        <strong>Chetanya</strong> - Intern at <em>iAccessible</em>
      </p>
      <p>
        <strong>Vighnesh</strong> - Intern: <em>DevSecOps Team</em> at Kohler IT
      </p>
      <hr></hr>
      <p>
        This platform aims to assist educators and students in maintaining a streamlined and productive learning environment.
      </p>
      <p style={{ marginTop: "1em", fontStyle: "italic" }}>
        Thank you, Hemlata Ma'am, for your dedication and inspiring leadership.
      </p>
    </div>
  );
}
