import Link from "next/link";
import Navbar from "../../components/navbar";

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

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch("http://localhost:3001/jobs", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not load career listings.");
    }

    const jobs: Job[] = await response.json();

    return jobs.filter((job) => job.active);
  } catch (error) {
    console.error("Failed to load career listings:", error);
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Join our team
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
          Careers at Delight
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-600">
          Explore opportunities to help us create a better shopping
          experience for our customers.
        </p>

        {jobs.length === 0 ? (
          <p className="mt-8 rounded-lg border border-gray-200 p-5 text-gray-600">
            No positions are available right now, or the career service
            is unavailable. Please try again later.
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-xl border border-gray-200 p-6 transition hover:border-emerald-300"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h2>

                <dl className="mt-5 space-y-4 text-sm">
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
                    <dd className="mt-1 whitespace-pre-line leading-6 text-gray-600">
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
                    <dd className="mt-1 whitespace-pre-line leading-6 text-gray-600">
                      {job.compensation}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-gray-900">
                      Use of AI in Hiring
                    </dt>
                    <dd className="mt-1 whitespace-pre-line leading-6 text-gray-600">
                      {job.useOfAIInHiring}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-gray-900">
                      Accessibility and Fair Hiring Statement
                    </dt>
                    <dd className="mt-1 whitespace-pre-line leading-6 text-gray-600">
                      {job.accessibilityAndFairHiringStatement}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-gray-900">
                      Record Retention Notice
                    </dt>
                    <dd className="mt-1 whitespace-pre-line leading-6 text-gray-600">
                      {job.recordRetentionNotice}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/careers/apply?jobId=${encodeURIComponent(job.id)}`}
                  className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  Apply now
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}