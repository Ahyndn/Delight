import Link from "next/link";
import Navbar from "../../../components/navbar";
import CareerApplicationForm from "../../../components/career-application-form";

type Props = {
  searchParams: Promise<{ jobId?: string }>;
};

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  roleStatus: string;
  qualifications: string[];
  compensation: string;
  useOfAIInHiring: string;
  accessibilityAndFairHiringStatement: string;
  recordRetentionNotice: string;
  active: boolean;
};

export const dynamic = "force-dynamic";

export default async function ApplyPage({ searchParams }: Props) {
  const { jobId } = await searchParams;

  let job: Job | undefined;

  try {
    if (jobId) {
      const response = await fetch(
        `http://localhost:3001/jobs/${encodeURIComponent(jobId)}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data: Job = await response.json ();
        job = data;
      }
    }
  } catch {
    // JSON Server may be unavailable.
  }

  if (!job || !job.active) {
    return (
      <main className="min-h-screen bg-white">
        <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Navbar />
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">
            Position unavailable
          </h1>
          <p className="mt-3 text-gray-600">
            This position could not be found or is no longer open.
          </p>
          <Link
            href="/careers"
            className="mt-5 inline-block text-emerald-800 underline"
          >
            Browse open positions
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/careers"
          className="text-sm text-emerald-800 hover:underline"
        >
          ← Back to Careers
        </Link>

       <h1 className="mt-6 text-3xl font-semibold text-gray-900">
       Apply for {job.title}
       </h1>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
  <h2 className="text-lg font-semibold text-gray-900">
    Position details
  </h2>

  <dl className="mt-5 space-y-5 text-sm">
    <div>
      <dt className="font-semibold text-gray-900">
        Department
      </dt>
      <dd className="mt-1 text-gray-600">
        {job.department}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Location
      </dt>
      <dd className="mt-1 text-gray-600">
        {job.location}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Employment type
      </dt>
      <dd className="mt-1 text-gray-600">
        {job.type}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Job description
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.description}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Role Status
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.roleStatus}
      </dd>
    </div>

    <div>
      <h3 className="font-semibold text-gray-900">
        Qualifications
      </h3>

      <ul className="mt-2 list-disc space-y-2 pl-5 leading-6 text-gray-600">
        {(job.qualifications ?? []).map((qualification, index) => (
          <li key={`${job.id}-qualification-${index}`}>
            {qualification}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Compensation
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.compensation}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Use of AI in Hiring
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.useOfAIInHiring}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Accessibility and Fair Hiring Statement
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.accessibilityAndFairHiringStatement}
      </dd>
    </div>

    <div>
      <dt className="font-semibold text-gray-900">
        Record Retention Notice
      </dt>
      <dd className="mt-1 whitespace-pre-line leading-7 text-gray-600">
        {job.recordRetentionNotice}
      </dd>
      </div>
      </dl>
    </div>

        <p className="mt-8 text-gray-600">
        Complete the application form below and attach your resume.
        </p>

        <div className="mt-6">
        <CareerApplicationForm
            jobId={job.id}
            jobTitle={job.title}
        />
        </div>
      </section>
    </main>
  );
}