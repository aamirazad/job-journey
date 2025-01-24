import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="prose lg:prose-xl mx-auto w-full">
      <h1>About us</h1>
      <p>
        Welcome to JobJourney! This is a platform creted by high school students
        for students! Our goal is to bridge the gap between career-seeking
        teenagers and excited employers, making it easier for students to find
        work they love while simultaneously helping businesses connect with
        opportunistic young individuals ready to work.
      </p>
      <h2> Who we are </h2>
      <p>
        {" "}
        We are Aamir Azad and William Zhu, two high school students passionate
        about coding, technology, and entrepreneurship. Over the years, we
        noticed a common reaccurence: many of our classmates search of places to
        get some work experience, but there were never any easy options for them
        to apply. On the other hand, local businesses often struggled to reach
        out to young job seekers to brighten up their organization. That&apos;s
        when we knew that a solution had to be made. We put our minds together
        and we are pround of our end product: JobJourney.
      </p>
      <Image
        src="https://utfs.io/f/54iPPKBOVfGCwUajN3FbZGLavBS0ATP9n5V1sR4Fky3pUfJx"
        height={427}
        width={568}
        alt="Selfie of Aamir and William"
        className="mx-auto h-[427] w-[568] rounded-xl"
        placeholder="blur"
        blurDataURL="data:image/webp;base64,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"
      />
      <h2> What We Do </h2>
      <p>
        {" "}
        JobJourney allows students who may be searching for a job to easily
        connect to an employer to find their dream job. Simply enter in your
        ideal job, location, or form of work in order to filter through
        potential postings. We also assist businesses that are seeking for
        employees by providing them with a straightforward method of seeking out
        suitable applcants. By leveraging modern front-end frameworks and
        back-end technologies, we ensure that the web pages that people access
        have been built using the latest technologies (e.g. TypeScript) in order
        to provide the most user-friendly experience.{" "}
      </p>
      <h4>
        {" "}
        For students: Browse through job listings, apply for opportunities, and
        keep track of your applications - all in one place. We will also send
        you an email if you have any matches.{" "}
      </h4>
      <h4>
        {" "}
        For Employers: Easily submit job postings, manage listings, and connect
        with enthusiastic and reliable student applicants.
      </h4>
      <p>
        {" "}
        Thank you for visiting JobJourney! Whether you&apos;re looking for a job
        or looking to hire, we&apos;re excited to help you link with the right
        opportunity.
      </p>
      <p>
        If you have any questions, feel free to contact us at{" "}
        <a href="mailto:aamirmazad@gmail.com">aamirmazadgmail.com</a>.
      </p>
    </div>
  );
}
