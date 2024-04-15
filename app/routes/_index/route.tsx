export default function Index() {
  return (
    <div>
      <article className="prose dark:prose-invert">
        <h2>Hello</h2>
        <div className="avatar">
          <div className="w-64 rounded">
            <img
              src="https://stephen-park-personal-website-public.s3.amazonaws.com/assets/headshot.jpg"
              alt="headshot"
            />
          </div>
        </div>
        <p>
          Hello! I&apos;m <b>Stephen Park</b>, a remote{' '}
          <b>Senior Software Engineer</b> based out of{' '}
          <b>Seattle, Washington</b>.
        </p>
        <p>
          With a focus on backend development and full-stack proficiency, I
          bring extensive experience in Node.js, Ruby on Rails, and Golang. My
          skills extend to cloud services like Azure and AWS, alongside
          expertise in both RDBMS (SQL Server, Postgres) and NoSQL databases
          (DynamoDB, MongoDB). On the frontend, I&apos;m adept with
          React.js/Typescript and Vue.js.
        </p>
        <p>
          I enjoy trying out new frameworks and tools, foreign language
          learning, basketball, travel, and photography.
        </p>
        <p>
          For more detailed information, check out my{' '}
          <a
            href="https://stephen-park-personal-website-public.s3.amazonaws.com/assets/current_resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            resume
          </a>
          !
        </p>
      </article>
    </div>
  )
}
